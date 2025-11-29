import {
  User,
  Check,
  MessageCircle,
  Star,
  Clock,
  UserPlus,
} from "lucide-react";
import {
  useSendConnectionRequestMutation,
  useGetMyConnectionsQuery,
} from "../../store/slices/connectionsApiSlice";

const MatchCard = ({ match, mySkillsToLearn, mySkillsToTeach }) => {
  const { data: connectionsData } = useGetMyConnectionsQuery();
  const [sendRequest, { isLoading: isSending }] =
    useSendConnectionRequestMutation();

  const teachMatch = match.skillsToTeach?.filter((s) =>
    mySkillsToLearn.includes(typeof s === "string" ? s : s.skill)
  );

  const learnMatch = match.skillsToLearn?.filter((s) =>
    mySkillsToTeach.includes(typeof s === "string" ? s : s.skill)
  );

  const getConnectionStatus = () => {
    if (!connectionsData?.data) return null;

    const connection = connectionsData.data.find(
      (c) => c.requester._id === match._id || c.recipient._id === match._id
    );

    return connection ? connection.status : null;
  };

  const status = getConnectionStatus();

  const handleConnect = async () => {
    try {
      await sendRequest(match._id).unwrap();
      console.log("sent");
    } catch (err) {
      console.error("Failed to connect:", err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
      <div className="p-6 flex-1">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              {match.avatar ? (
                <img
                  src={match.avatar}
                  alt={match.name}
                  referrerPolicy="no-referrer"
                  className="h-16 w-16 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xl font-bold">
                  {match.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <span
                className={`absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white 
    ${match.isOnline ? "bg-green-500" : "bg-gray-400"}`}
              ></span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900">{match.name}</h3>
              <div className="flex items-center text-sm text-yellow-500 mt-1">
                <Star className="h-4 w-4 fill-current" />
                <span className="ml-1 font-medium text-gray-700">
                  {match.rating || "New"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-4 text-gray-600 text-sm line-clamp-2 min-h-[40px]">
          {match.bio || "No bio provided yet."}
        </p>

        <div className="mt-6 space-y-3">
          {teachMatch?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Can teach you
              </p>
              <div className="flex flex-wrap gap-2">
                {teachMatch.map((skill, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {typeof skill === "string" ? skill : skill.skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {learnMatch?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Wants to learn
              </p>
              <div className="flex flex-wrap gap-2">
                {learnMatch.map((skill, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  >
                    {typeof skill === "string" ? skill : skill.skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-100 bg-gray-50 px-6 py-4 flex gap-3">
        {status === "accepted" ? (
          <button className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <MessageCircle className="h-4 w-4 mr-2" />
            Message
          </button>
        ) : status === "pending" ? (
          <button
            disabled
            className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-yellow-500 cursor-not-allowed opacity-80"
          >
            <Clock className="h-4 w-4 mr-2" />
            Pending
          </button>
        ) : (
          <button
            onClick={handleConnect}
            disabled={isSending}
            className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50"
          >
            {isSending ? (
              "Sending..."
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Connect
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default MatchCard;
