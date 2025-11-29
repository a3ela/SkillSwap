// src/components/dashboard/Dashboard.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
// --- NEW IMPORT ---
import { useGetUserSessionsQuery } from "../store/slices/sessionApiSlice";
// ------------------
import { useGetProfileQuery } from "../store/slices/usersApiSlice";
import {
  BookOpen,
  GraduationCap,
  Users,
  Calendar,
  Settings,
  Video, // Import Video icon
  Clock,
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: profile, isLoading: isProfileLoading } = useGetProfileQuery();

  // --- 1. FETCH SESSIONS ---
  const { data: sessionsData, isLoading: isSessionsLoading } =
    useGetUserSessionsQuery();
  const sessions = sessionsData?.data || [];

  // Filter for sessions that are NOT completed/cancelled
  const upcomingSessions = sessions
    .filter((s) => s.status !== "completed" && s.status !== "cancelled")
    .sort((a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime)); // Sort by soonest
  // -------------------------

  const user = profile?.data;
  const isLoading = isProfileLoading || isSessionsLoading;

  // ... (Keep getGreeting and getCompletionScore functions exactly as they were) ...
  const getGreeting = () => {
    /*...*/
  };
  const getCompletionScore = () => {
    /*...*/
  };
  const completionPercent = getCompletionScore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
        <p className="text-gray-500 font-medium">Loading...</p>
      </div>
    );
  }

  // Helper to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* ... (Keep Header Section exactly the same) ... */}
      <div className="bg-white border-b border-gray-200">
        {/* ... header content ... */}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid - Updated Values */}
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
            value={/* You can calculate this if you want, or leave 0 */ "0"}
            icon={Users}
            color="bg-purple-500"
          />
          {/* UPDATED STAT CARD */}
          <StatCard
            title="Upcoming Sessions"
            value={upcomingSessions.length} // Real number now!
            icon={Calendar}
            color="bg-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* --- NEW: UPCOMING SESSIONS LIST --- */}
            {upcomingSessions.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Next Up
                  </h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {upcomingSessions.slice(0, 3).map((session) => {
                    // Determine who is the partner
                    const isLearner = session.learner._id === user._id;
                    const partner = isLearner ? session.tutor : session.learner;
                    const myRole = isLearner ? "Learning" : "Teaching";

                    return (
                      <div
                        key={session._id}
                        className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          {/* Calendar Date Box */}
                          <div className="flex-shrink-0 w-16 h-16 bg-primary-50 rounded-lg flex flex-col items-center justify-center text-primary-700 border border-primary-100">
                            <span className="text-xs font-bold uppercase">
                              {new Date(session.scheduledTime).toLocaleString(
                                "default",
                                { month: "short" }
                              )}
                            </span>
                            <span className="text-2xl font-bold">
                              {new Date(session.scheduledTime).getDate()}
                            </span>
                          </div>

                          <div>
                            <h4 className="text-lg font-bold text-gray-900">
                              {session.skill}
                            </h4>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <span className="inline-flex items-center mr-4">
                                <Clock className="h-4 w-4 mr-1" />
                                {formatDate(session.scheduledTime)}
                              </span>
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                  isLearner
                                    ? "bg-green-100 text-green-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {myRole} from {partner.name}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Join Button */}
                        <button
                          onClick={() => navigate(`/room/${session.roomId}`)}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Join Call
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {/* ----------------------------------- */}

            {/* ... (Keep "Your Skills" Section exactly the same) ... */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* ... */}
            </div>

            {/* ... (Keep "Recent Activity" Section exactly the same) ... */}
          </div>

          {/* ... (Keep Sidebar exactly the same) ... */}
        </div>
      </div>
    </div>
  );
};

// ... (Keep Sub-components StatCard, ActionButton, EmptyState exactly the same) ...

export default Dashboard;
