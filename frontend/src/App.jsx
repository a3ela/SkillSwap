import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import OAuthSuccess from "./components/auth/OAuthSuccess";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import { setCredentials } from "./store/slices/authSlice";
import EditProfile from "./pages/EditProfile";
import Matches from "./components/matching/Matches";
import Chat from './pages/Chat'

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      dispatch(setCredentials(JSON.parse(userInfo)));
    }
  }, [dispatch]);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/edit"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/matches"
            element={
              <ProtectedRoute>
                <Matches />
              </ProtectedRoute>
            }
          />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/matches"
            element={
              <div className="p-8 text-center">Matches Page - Coming Soon</div>
            }
          />
          <Route
            path="/chat"
            element={
              <div className="p-8 text-center">Chat Page - Coming Soon</div>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
