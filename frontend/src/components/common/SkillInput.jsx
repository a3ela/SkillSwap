import React, { useState } from 'react';
import { X, Plus, Tag } from 'lucide-react';

const SkillInput = ({ label, skills = [], setSkills, placeholder, color = "blue" }) => {
  const [input, setInput] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill();
    }
  };

  const addSkill = () => {
    const val = input.trim();
    if (val && !skills.includes(val)) {
      setSkills([...skills, val]);
      setInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  // Styling logic
  const styles = {
    blue: "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100",
    green: "bg-green-50 text-green-700 border-green-100 hover:bg-green-100"
  };
  const activeStyle = color === "green" ? styles.green : styles.blue;

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
        <Tag className="w-4 h-4 mr-2 text-gray-400" />
        {label}
      </label>
      
      {/* Chip Container */}
      <div className="flex flex-wrap gap-2 mb-3 min-h-[40px]">
        {skills.length === 0 && (
          <p className="text-sm text-gray-400 italic py-2">No skills added yet.</p>
        )}
        {skills.map((skill, index) => (
          <span 
            key={index} 
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border transition-colors ${activeStyle}`}
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              className="ml-2 focus:outline-none hover:text-red-500"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>

      {/* Input Field */}
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="block w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-shadow"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={addSkill}
          className="absolute inset-y-0 right-0 px-4 flex items-center text-gray-400 hover:text-primary-600"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
      <p className="mt-2 text-xs text-gray-500">Press <kbd className="font-sans px-1 py-0.5 bg-gray-100 border rounded">Enter</kbd> to add a tag</p>
    </div>
  );
};

export default SkillInput;