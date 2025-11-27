// src/components/dashboard/Dashboard.jsx
import React from "react";
import { useGetProfileQuery } from "../store/slices/usersApiSlice";
import {
  BookOpen,
  GraduationCap,
  Users,
  Calendar,
  ArrowRight,
  Plus,
  Settings,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate

const Dashboard = () => {
  const navigate = useNavigate(); // Hook for navigation
  const { data: profile, isLoading, error } = useGetProfileQuery();
  const user = profile?.data;

  // 1. Logic: Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // 2. Logic: Calculate Profile Completion Score
  const getCompletionScore = () => {
    if (!user) return 0;
    let score = 0;
    if (user.name) score += 20;
    if (user.email) score += 10; // Email is usually always there
    if (user.bio) score += 20;
    if (user.avatar) score += 10;
    if (user.skillsToTeach?.length > 0) score += 20;
    if (user.skillsToLearn?.length > 0) score += 20;
    return Math.min(score, 100);
  };

  const completionPercent = getCompletionScore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
        <p className="text-gray-500 font-medium animate-pulse">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-red-50 p-6 rounded-lg border border-red-200 text-center">
          <h3 className="text-red-800 font-semibold">Unable to load profile</h3>
          <p className="text-red-600 mt-1">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              {/* Avatar Logic */}
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="h-16 w-16 rounded-full object-cover border-2 border-primary-100 shadow-sm"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-2xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">
                  {getGreeting()}
                </p>
                <h1 className="text-3xl font-bold text-gray-900">
                  {user?.name || "User"}
                </h1>
                <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <Link
                to="/profile/edit"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Skills to Teach"
            value={user?.skillsToTeach?.length || 0}
            icon={GraduationCap}
            color="bg-blue-500"
          />
          <StatCard
            title="Skills to Learn"
            value={user?.skillsToLearn?.length || 0}
            icon={BookOpen}
            color="bg-green-500"
          />
          <StatCard
            title="Active Matches"
            value="0"
            icon={Users}
            color="bg-purple-500"
          />
          <StatCard
            title="Upcoming Sessions"
            value="0"
            icon={Calendar}
            color="bg-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content (Skills) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Your Skills
                </h3>
                <button
                  onClick={() => navigate("/profile/edit")}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Manage Skills
                </button>
              </div>
              <div className="p-6 grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Teaching
                  </h4>
                  {user?.skillsToTeach?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {user.skillsToTeach.map((skill, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {typeof skill === "string" ? skill : skill.skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      text="Add skills you can teach"
                      onClick={() => navigate("/profile/edit")}
                    />
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Learning
                  </h4>
                  {user?.skillsToLearn?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {user.skillsToLearn.map((skill, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                        >
                          {typeof skill === "string" ? skill : skill.skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      text="What do you want to learn?"
                      onClick={() => navigate("/profile/edit")}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Activity
                </h3>
              </div>
              <div className="p-6 text-center text-gray-500 text-sm py-12">
                <div className="inline-flex items-center justify-center p-4 bg-gray-50 rounded-full mb-3">
                  <Calendar className="h-6 w-6 text-gray-400" />
                </div>
                <p>No recent activity to show.</p>
                <p className="mt-1">
                  Start matching with others to see updates here!
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <ActionButton
                  text="Find a Mentor"
                  subtext="Browse users teaching your target skills"
                  color="bg-primary-50 hover:bg-primary-100"
                  textColor="text-primary-700"
                  icon={Users}
                  onClick={() => navigate("/matches")}
                />
                <ActionButton
                  text="Update Availability"
                  subtext="Set when you are free to meet"
                  color="bg-gray-50 hover:bg-gray-100"
                  textColor="text-gray-700"
                  icon={Calendar}
                  onClick={() => navigate("/profile/edit")} // Redirect to edit for now
                />
              </div>
            </div>

            {/* Profile Completion Widget - NOW DYNAMIC */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    {completionPercent === 100
                      ? "Profile Complete!"
                      : "Complete Profile"}
                  </h3>
                  <p className="text-primary-100 text-sm mt-1 mb-4">
                    {completionPercent === 100
                      ? "You are all set to find matches."
                      : "Add a bio and skills to increase your match rate."}
                  </p>
                </div>
                <div className="p-2 bg-white/10 rounded-lg">
                  <div className="font-bold text-lg">{completionPercent}%</div>
                </div>
              </div>
              <div className="w-full bg-primary-900/30 rounded-full h-2 mb-4">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${completionPercent}%` }}
                ></div>
              </div>

              {completionPercent < 100 && (
                <button
                  onClick={() => navigate("/profile/edit")}
                  className="w-full py-2 bg-white text-primary-700 rounded-md text-sm font-medium hover:bg-primary-50 transition-colors"
                >
                  Continue Setup
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white overflow-hidden rounded-xl shadow-sm border border-gray-100 p-5 flex items-center">
    <div className={`flex-shrink-0 rounded-md p-3 ${color} bg-opacity-10`}>
      <Icon className={`h-6 w-6 ${color.replace("bg-", "text-")}`} />
    </div>
    <div className="ml-5 w-0 flex-1">
      <dl>
        <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
        <dd className="text-2xl font-semibold text-gray-900">{value}</dd>
      </dl>
    </div>
  </div>
);

// Updated ActionButton to accept onClick
const ActionButton = ({
  text,
  subtext,
  color,
  textColor,
  icon: Icon,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 group ${color}`}
  >
    <div className={`p-2 rounded-md bg-white/60 mr-4`}>
      <Icon className={`h-5 w-5 ${textColor}`} />
    </div>
    <div className="text-left">
      <p className={`text-sm font-semibold ${textColor}`}>{text}</p>
      <p className={`text-xs ${textColor} opacity-80`}>{subtext}</p>
    </div>
    <ArrowRight
      className={`ml-auto h-4 w-4 ${textColor} opacity-0 group-hover:opacity-100 transition-opacity`}
    />
  </button>
);

// Updated EmptyState to accept onClick
const EmptyState = ({ text, onClick }) => (
  <button
    onClick={onClick}
    className="w-full border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-primary-300 hover:bg-primary-50 transition-all group"
  >
    <Plus className="h-6 w-6 mx-auto text-gray-400 group-hover:text-primary-500 mb-1" />
    <span className="text-sm text-gray-500 group-hover:text-primary-600">
      {text}
    </span>
  </button>
);

export default Dashboard;
