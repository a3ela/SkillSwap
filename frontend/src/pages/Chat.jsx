import { useState, useRef, useEffect } from "react";
import { useGetMyConnectionsQuery } from "../store/slices/connectionsApiSlice";
import {
  useGetMessagesQuery,
  useSendMessageMutation,
} from "../store/slices/chatApiSlice";
import { Send, MessageSquare } from "lucide-react";
import { useSelector } from "react-redux";
import ScheduleModal from "../components/common/ScheduleModal";
import io from "socket.io-client";

const ENDPOINT = import.meta.env.VITE_API_URL || "http://localhost:5000";
let socket;

const Chat = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const [selectedUser, setSelectedUser] = useState(null);

  // ⭐ Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: connectionsData } = useGetMyConnectionsQuery();

  const friends =
    connectionsData?.data
      ?.filter((c) => c.status === "accepted")
      .map((c) =>
        c.requester._id === userInfo._id ? c.recipient : c.requester
      ) || [];

  return (
    <div className="max-w-6xl mx-auto p-4 h-[calc(100vh-80px)]">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-full flex">
        {/* Sidebar */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="font-bold text-gray-700">Messages</h2>
          </div>

          <div className="overflow-y-auto flex-1">
            {friends.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">
                No connections yet.
              </div>
            ) : (
              friends.map((friend) => (
                <div
                  key={friend._id}
                  onClick={() => setSelectedUser(friend)}
                  className={`p-4 flex items-center cursor-pointer hover:bg-gray-50 transition ${
                    selectedUser?._id === friend._id
                      ? "bg-primary-50 border-r-4 border-primary-600"
                      : ""
                  }`}
                >
                  <img
                    src={friend.avatar}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900 text-sm">
                      {friend.name}
                    </p>
                    <p className="text-xs text-gray-500">Click to chat</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedUser ? (
            <ChatWindow
              recipient={selectedUser}
              myId={userInfo._id}
              onScheduleClick={() => setIsModalOpen(true)}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <MessageSquare className="h-8 w-8 mb-4" />
              <p>Select a conversation</p>
            </div>
          )}
        </div>
      </div>

      {/* ⭐ Schedule Modal */}
      {selectedUser && (
        <ScheduleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          partnerId={selectedUser._id}
          partnerName={selectedUser.name}
          myId={userInfo._id}
        />
      )}
    </div>
  );
};

const ChatWindow = ({ recipient, myId, onScheduleClick }) => {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  const { data: messagesData, isLoading } = useGetMessagesQuery(recipient._id);
  const [sendMessage] = useSendMessageMutation();

  const scrollRef = useRef();

  // 1. Setup Socket
  useEffect(() => {
    if (!socket) {
      socket = io(ENDPOINT);
      socket.emit("setup", { _id: myId });
    }
  }, []);

  // 2. Join user room + join chat room
  useEffect(() => {
    if (socket && recipient?._id) {
      socket.emit("join chat", recipient._id);
    }
  }, [recipient]);

  // 3. Load conversation
  useEffect(() => {
    if (messagesData?.data) {
      setMessages(messagesData.data);
    }
  }, [messagesData]);

  // 4. Listen for new messages
  useEffect(() => {
    const handleIncoming = (newMessage) => {
      if (
        newMessage.sender._id === recipient._id ||
        newMessage.sender === recipient._id
      ) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    socket.on("message received", handleIncoming);
    return () => socket.off("message received", handleIncoming);
  }, [recipient]);

  // 5. Auto scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const res = await sendMessage({
      recipientId: recipient._id,
      message: text,
    }).unwrap();

    const newMessage = res.data;

    setMessages((prev) => [...prev, newMessage]);

    socket.emit("new message", newMessage);

    setText("");
  };

  return (
    <>
      {/* ⭐ HEADER WITH SCHEDULE BUTTON */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center">
          <img src={recipient.avatar} className="h-8 w-8 rounded-full mr-3" />
          <span className="font-bold">{recipient.name}</span>
        </div>

        <button
          onClick={onScheduleClick}
          className="px-3 py-1 bg-green-500 text-white text-sm rounded-full hover:bg-green-600 transition-colors"
        >
          Schedule Session
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
        {isLoading ? (
          <div className="text-center text-gray-400 mt-10">
            Loading messages...
          </div>
        ) : (
          messages.map((msg, idx) => {
            const mine = msg.sender === myId || msg.sender?._id === myId;

            return (
              <div
                key={idx}
                className={`flex ${mine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                    mine
                      ? "bg-primary-600 text-white rounded-br-none"
                      : "bg-white border text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            className="flex-1 border rounded-full px-4 py-2"
            placeholder="Type message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="bg-primary-600 text-white p-2 rounded-full">
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </>
  );
};

export default Chat;
