import { useGetMatchesQuery, useGetProfileQuery } from '../../store/slices/usersApiSlice';
import MatchCard from './MatchCard';
import { Loader, Frown, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Matches = () => {
  // 1. Get my profile (to compare skills)
  const { data: myProfile } = useGetProfileQuery();
  
  // 2. Get matches from backend
  const { data: matchesData, isLoading, error } = useGetMatchesQuery();

  // Helper to safely get skill strings array
  const getSkillNames = (skills) => {
    if (!skills) return [];
    return skills.map(s => typeof s === 'string' ? s : s.skill);
  };

  const mySkillsToLearn = getSkillNames(myProfile?.data?.skillsToLearn);
  const mySkillsToTeach = getSkillNames(myProfile?.data?.skillsToTeach);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="bg-red-100 p-3 rounded-full inline-block mb-3">
             <Frown className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Oops! Something went wrong.</h2>
          <p className="text-gray-500 mt-2">We couldn't load your matches right now.</p>
        </div>
      </div>
    );
  }

  const matches = matchesData?.data || [];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 text-center md:text-left md:flex md:justify-between md:items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2 justify-center md:justify-start">
              <Sparkles className="text-yellow-500 h-8 w-8" />
              Your Smart Matches
            </h1>
            <p className="mt-2 text-gray-600">
              We found {matches.length} people who match your skill goals.
            </p>
          </div>
          
          {/* Quick Filter (Future feature placeholder) */}
          <div className="mt-4 md:mt-0">
             <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
               <option>All Matches</option>
               <option>Teaching what I need</option>
               <option>Needing what I teach</option>
             </select>
          </div>
        </div>

        {/* Content */}
        {matches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {matches.map((match) => (
              <MatchCard 
                key={match._id} 
                match={match} 
                mySkillsToLearn={mySkillsToLearn}
                mySkillsToTeach={mySkillsToTeach}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="max-w-md mx-auto">
              <Sparkles className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No matches found yet</h3>
              <p className="mt-2 text-gray-500">
                Try adding more diverse skills to your profile to increase your chances of finding a partner.
              </p>
              <Link 
                to="/profile/edit"
                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                Update My Skills
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;