// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";

// Temporary Register component
const Register = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
    <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Register Page - Coming Soon
      </h2>
      <p className="text-gray-600 text-center">
        Registration functionality will be implemented soon!
      </p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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
