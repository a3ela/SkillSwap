import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "../store/slices/usersApiSlice";
import SkillInput from "../components/common/SkillInput";
import { Save, Loader, ArrowLeft, User, Mail, FileText } from "lucide-react";

const EditProfile = () => {
  const navigate = useNavigate();

  const { data: profile, isLoading: isFetching } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
  });
  const [skillsToTeach, setSkillsToTeach] = useState([]);
  const [skillsToLearn, setSkillsToLearn] = useState([]);

  // Populate form when data arrives
  useEffect(() => {
    if (profile?.data) {
      const user = profile.data;
      setFormData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
      });

      // Helper to extract just the skill names if they are objects
      const extractSkills = (arr) => {
        if (!arr) return [];
        return arr.map((item) =>
          typeof item === "string" ? item : item.skill
        );
      };

      setSkillsToTeach(extractSkills(user.skillsToTeach));
      setSkillsToLearn(extractSkills(user.skillsToLearn));
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({
        ...formData,
        skillsToTeach,
        skillsToLearn,
      }).unwrap();
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  if (isFetching)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/dashboard")}
              className="mr-4 p-2 rounded-full hover:bg-white hover:shadow-sm transition-all text-gray-600"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <section>
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-3 mb-6">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-2.5"
                    />
                  </div>
                </div>

                <div className="space-y-1 opacity-60 cursor-not-allowed">
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={formData.email}
                      readOnly
                      disabled
                      className="bg-gray-50 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-2.5"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Bio
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <FileText className="h-4 w-4 text-gray-400" />
                    </div>
                    <textarea
                      rows={3}
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-3"
                      placeholder="Tell us about your learning goals..."
                    />
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-3 mb-6">
                Skills & Interests
              </h3>
              <div className="space-y-8">
                <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                  <SkillInput
                    label="Skills I can teach"
                    placeholder="Type a skill (e.g. React) and hit Enter"
                    skills={skillsToTeach}
                    setSkills={setSkillsToTeach}
                    color="blue"
                  />
                </div>

                <div className="bg-green-50/50 p-6 rounded-xl border border-green-100">
                  <SkillInput
                    label="Skills I want to learn"
                    placeholder="Type a skill (e.g. Piano) and hit Enter"
                    skills={skillsToLearn}
                    setSkills={setSkillsToLearn}
                    color="green"
                  />
                </div>
              </div>
            </section>

            <div className="pt-6 flex items-center justify-end space-x-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 transition-all"
              >
                {isUpdating ? (
                  <>
                    <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="-ml-1 mr-2 h-4 w-4" />
                    Save Profile
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
