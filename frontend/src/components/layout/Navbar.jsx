import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import {
  useGetMyConnectionsQuery,
  useRespondToRequestMutation,
} from "../../store/slices/connectionsApiSlice";
import {
  Menu,
  X,
  LogOut,
  User,
  LayoutDashboard,
  ChevronDown,
  BookOpen,
  Bell,
  Check,
} from "lucide-react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false); 

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  const location = useLocation();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);


  const { data: connectionsData } = useGetMyConnectionsQuery(undefined, {
    skip: !userInfo,
    pollingInterval: 30000, 
  });

  const [respondToRequest] = useRespondToRequestMutation();

  const pendingRequests =
    connectionsData?.data?.filter(
      (c) => c.status === "pending" && c.recipient._id === userInfo?._id
    ) || [];

  const unreadCount = pendingRequests.length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsNotifDropdownOpen(false);
  }, [location]);

  const handleLogout = () => {
    dispatch(logout());
    setIsProfileDropdownOpen(false);
  };

  const handleAccept = async (id) => {
    try {
      await respondToRequest({ id, status: "accepted" }).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-primary-600 p-1.5 rounded-lg group-hover:bg-primary-700 transition-colors">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              Skill<span className="text-primary-600">Swap</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" active={isActive("/")}>
              Home
            </NavLink>
            <NavLink to="/matches" active={isActive("/matches")}>
              Find Matches
            </NavLink>
            <NavLink to="/chat" active={isActive("/chat")}>
              Messages
            </NavLink>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {userInfo ? (
              <>
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
                    className="p-2 text-gray-400 hover:text-gray-600 relative transition-colors focus:outline-none"
                  >
                    <Bell className="h-6 w-6" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-white animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {isNotifDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 border border-gray-100 ring-1 ring-black ring-opacity-5 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                        <span className="font-semibold text-sm text-gray-700">
                          Notifications
                        </span>
                        <span className="text-xs text-gray-500">
                          {unreadCount} Pending
                        </span>
                      </div>

                      <div className="max-h-64 overflow-y-auto">
                        {pendingRequests.length === 0 ? (
                          <div className="px-4 py-6 text-center text-sm text-gray-500">
                            No new requests
                          </div>
                        ) : (
                          pendingRequests.map((req) => (
                            <div
                              key={req._id}
                              className="px-4 py-3 hover:bg-gray-50 flex items-start space-x-3"
                            >
                              <img
                                src={
                                  req.requester.avatar ||
                                  "https://via.placeholder.com/40"
                                }
                                alt=""
                                className="h-10 w-10 rounded-full object-cover border border-gray-200"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {req.requester.name}
                                </p>
                                <p className="text-xs text-gray-500 mb-2">
                                  Wants to connect
                                </p>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleAccept(req._id)}
                                    className="inline-flex items-center px-2 py-1 bg-primary-600 text-white text-xs font-medium rounded hover:bg-primary-700"
                                  >
                                    Accept
                                  </button>
                                  <button className="inline-flex items-center px-2 py-1 bg-white border border-gray-300 text-gray-700 text-xs font-medium rounded hover:bg-gray-50">
                                    Decline
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
            
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() =>
                      setIsProfileDropdownOpen(!isProfileDropdownOpen)
                    }
                    className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none pl-2 border-l border-gray-200"
                  >
                    {userInfo.avatar ? (
                      <img
                        src={userInfo.avatar}
                        alt="Profile"
                        className="h-8 w-8 rounded-full object-cover border border-gray-200"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                        {userInfo.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="font-medium text-sm hidden lg:block">
                      {userInfo.name}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        isProfileDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100 ring-1 ring-black ring-opacity-5 animate-in fade-in slide-in-from-top-2 duration-200">
                      <Link
                        to="/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <User className="h-4 w-4 mr-2" /> My Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 mr-2" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 font-medium text-sm"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-all shadow-sm hover:shadow-md"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 pb-4">
          {userInfo && (
            <MobileNavLink to="/requests" active={isActive("/requests")}>
              Notifications {unreadCount > 0 && `(${unreadCount})`}
            </MobileNavLink>
          )}
        </div>
      )}
    </nav>
  );
};
const NavLink = ({ to, active, children }) => (
  <Link
    to={to}
    className={`text-sm font-medium transition-colors ${
      active ? "text-primary-600" : "text-gray-500 hover:text-gray-900"
    }`}
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, active, children }) => (
  <Link
    to={to}
    className={`block px-3 py-2 rounded-md text-base font-medium ${
      active
        ? "bg-primary-50 text-primary-700"
        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
    }`}
  >
    {children}
  </Link>
);

export default Navbar;