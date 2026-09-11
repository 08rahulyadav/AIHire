import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiShield,
  FiArrowLeft,
  FiLogOut,
} from "react-icons/fi";
import toast from "react-hot-toast";

import { getProfile, logoutUser } from "../../services/authService";

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();

        if (response?.user) {
          setUser(response.user);
        } else {
          setUser(response);
        }
      } catch (error) {
        console.error("Profile error:", error);

        toast.error(
          error?.response?.data?.message || "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    logoutUser();
    localStorage.removeItem("user");

    toast.success("Logged out successfully");

    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border p-8 text-center max-w-md w-full">
          <FiUser className="text-5xl text-gray-400 mx-auto mb-4" />

          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Profile not found
          </h2>

          <p className="text-gray-500 mb-6">
            We couldn't load your profile information.
          </p>

          <Link
            to="/candidate/dashboard"
            className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FiArrowLeft />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            My Profile
          </h1>

          <p className="text-gray-500 mt-2">
            View your account information
          </p>
        </div>

        {/* Profile card */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          {/* Profile top */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 sm:px-8 py-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-md">
                <span className="text-3xl font-bold text-blue-600">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>

              <div className="text-center sm:text-left text-white">
                <h2 className="text-2xl font-bold">
                  {user.name || "User"}
                </h2>

                <p className="text-blue-100 mt-1">
                  {user.email || "No email available"}
                </p>

                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full text-sm">
                  <FiShield />

                  <span className="capitalize">
                    {user.role || "candidate"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Information */}
          <div className="p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Account Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Name */}
              <div className="border rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <FiUser className="text-blue-600" />
                  </div>

                  <span className="text-sm text-gray-500">
                    Full Name
                  </span>
                </div>

                <p className="font-medium text-gray-900">
                  {user.name || "Not available"}
                </p>
              </div>

              {/* Email */}
              <div className="border rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                    <FiMail className="text-green-600" />
                  </div>

                  <span className="text-sm text-gray-500">
                    Email Address
                  </span>
                </div>

                <p className="font-medium text-gray-900 break-all">
                  {user.email || "Not available"}
                </p>
              </div>

              {/* Role */}
              <div className="border rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                    <FiShield className="text-purple-600" />
                  </div>

                  <span className="text-sm text-gray-500">
                    Account Role
                  </span>
                </div>

                <p className="font-medium text-gray-900 capitalize">
                  {user.role || "candidate"}
                </p>
              </div>

              {/* User ID */}
              <div className="border rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                    <FiUser className="text-orange-600" />
                  </div>

                  <span className="text-sm text-gray-500">
                    User ID
                  </span>
                </div>

                <p className="font-medium text-gray-900 break-all text-sm">
                  {user.id || user._id || "Not available"}
                </p>
              </div>
            </div>

            {/* Notice */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-sm text-blue-700">
                Your profile information is currently read-only.
                Profile editing can be added once the backend update
                API is available.
              </p>
            </div>

            {/* Logout */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                <FiLogOut />
                Logout
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;