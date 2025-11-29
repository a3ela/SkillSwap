import { useState } from 'react';
import { useScheduleSessionMutation } from '../../store/slices/sessionApiSlice';
import { X } from 'lucide-react';

const ScheduleModal = ({ isOpen, onClose, partnerId, partnerName, myId }) => {
  const [skill, setSkill] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [role, setRole] = useState('learner'); 
  
  const [scheduleSession, { isLoading }] = useScheduleSessionMutation();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!skill || !scheduledTime) return;

    try {
      await scheduleSession({
        partnerId: partnerId,
        skill,
        scheduledTime,
        role,
      }).unwrap();
      
      onClose(); // Close the modal on success
      alert('Session successfully scheduled!');
      // In a real app, you might emit a socket event here to notify the partner.
      
    } catch (err) {
      console.error('Failed to schedule session:', err);
      alert('Failed to schedule session.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-xl font-bold text-gray-800">Schedule Session with {partnerName}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Skill to Exchange:
            </label>
            <input
              type="text"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              placeholder="e.g., React Hooks, Public Speaking"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              When is the Session?
            </label>
            <input
              type="datetime-local"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Your Role in this Session:
            </label>
            <div className="mt-2 space-x-4">
                <label className="inline-flex items-center">
                    <input 
                        type="radio" 
                        name="role" 
                        value="learner"
                        checked={role === 'learner'}
                        onChange={() => setRole('learner')}
                        className="form-radio text-primary-600"
                    />
                    <span className="ml-2 text-gray-700">I am the **Learner**</span>
                </label>
                <label className="inline-flex items-center">
                    <input 
                        type="radio" 
                        name="role" 
                        value="tutor"
                        checked={role === 'tutor'}
                        onChange={() => setRole('tutor')}
                        className="form-radio text-primary-600"
                    />
                    <span className="ml-2 text-gray-700">I am the **Tutor**</span>
                </label>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading || !skill || !scheduledTime}
            className="w-full bg-primary-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {isLoading ? 'Scheduling...' : 'Confirm Session'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScheduleModal;