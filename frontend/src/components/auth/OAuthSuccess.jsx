// src/components/auth/OAuthSuccess.jsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setCredentials } from "../../store/slices/authSlice";
import { useGetProfileQuery } from "../../store/slices/usersApiSlice";

const OAuthSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");
  const userId = searchParams.get("userId");

  useEffect(() => {
    if (token && userId) {
      dispatch(setCredentials({ token, _id: userId }));
    } else {
      navigate("/login");
    }
  }, [token, userId, dispatch, navigate]);

  const {
    data: profile,
    isLoading,
    error,
  } = useGetProfileQuery(undefined, {
    skip: token,
  });

  useEffect(() => {
    if (profile) {
      navigate("/dashboard", { replace: true });
    }
  }, [profile, navigate]);

  useEffect(() => {
    if (error) {
      console.error("OAuth Profile Fetch Error:", error);
      navigate("/login", {
        state: { error: "Authentication failed. Please try again." },
      });
    }
  }, [error, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">
          {isLoading ? "Finalizing account..." : "Securely logging you in..."}
        </p>
      </div>
    </div>
  );
};

export default OAuthSuccess;
