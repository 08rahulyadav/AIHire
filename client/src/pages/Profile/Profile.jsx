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
          error?.response?.data?.message ||
            "Failed to load profile"
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

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

          <p className="mt-4 text-sm text-slate-400">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  // ==============================
  // PROFILE NOT FOUND
  // ==============================

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center shadow-sm sm:p-8">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-slate-500">
            <FiUser className="text-3xl" />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-white">
            Profile not found
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            We couldn't load your profile information.
          </p>

          <Link
            to="/candidate/dashboard"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
          >
            <FiArrowLeft />
            Back to Dashboard
          </Link>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 text-white">

      <main className="mx-auto w-full max-w-6xl px-3 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

        {/* ==============================
            PAGE HEADER
        ============================== */}

        <div className="mb-6 sm:mb-8">
          <p className="text-sm font-semibold text-blue-400">
            Account Settings
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            My Profile
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-400 sm:text-base">
            View your account information and profile details.
          </p>
        </div>

        {/* ==============================
            PROFILE CARD
        ============================== */}

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-sm">

          {/* Profile Hero */}
          <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-5 py-7 sm:px-8 sm:py-9">

            <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">

              {/* Avatar */}
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-white/20 bg-white shadow-lg sm:h-28 sm:w-28">

                <span className="text-3xl font-bold text-blue-600 sm:text-4xl">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </span>

              </div>

              {/* User Info */}
              <div className="min-w-0 text-center sm:text-left">

                <h2 className="wrap-break-word text-2xl font-bold text-white sm:text-3xl">
                  {user.name || "User"}
                </h2>

                <p className="mt-1 wrap-break-word text-sm text-blue-100 sm:text-base">
                  {user.email || "No email available"}
                </p>

                <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm sm:text-sm">
                  <FiShield />

                  <span className="capitalize">
                    {user.role || "candidate"}
                  </span>
                </div>

              </div>

            </div>
          </div>

          {/* ==============================
              ACCOUNT CONTENT
          ============================== */}

          <div className="p-5 sm:p-7 lg:p-8">

            <div className="mb-6">
              <h3 className="text-lg font-semibold sm:text-xl">
                Account Information
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Your registered account details.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">

              {/* Name */}
              <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-4 transition hover:border-slate-700 sm:p-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                    <FiUser />
                  </div>

                  <span className="text-sm text-slate-500">
                    Full Name
                  </span>

                </div>

                <p className="mt-4 wrap-break-word font-medium text-white">
                  {user.name || "Not available"}
                </p>

              </div>

              {/* Email */}
              <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-4 transition hover:border-slate-700 sm:p-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-green-400">
                    <FiMail />
                  </div>

                  <span className="text-sm text-slate-500">
                    Email Address
                  </span>

                </div>

                <p className="mt-4 break-all font-medium text-white">
                  {user.email || "Not available"}
                </p>

              </div>

              {/* Role */}
              <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-4 transition hover:border-slate-700 sm:p-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                    <FiShield />
                  </div>

                  <span className="text-sm text-slate-500">
                    Account Role
                  </span>

                </div>

                <p className="mt-4 font-medium capitalize text-white">
                  {user.role || "candidate"}
                </p>

              </div>

              {/* User ID */}
              <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-4 transition hover:border-slate-700 sm:p-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">
                    <FiUser />
                  </div>

                  <span className="text-sm text-slate-500">
                    User ID
                  </span>

                </div>

                <p className="mt-4 wrap-break-word text-sm font-medium text-white">
                  {user.id || user._id || "Not available"}
                </p>

              </div>

            </div>

            {/* Read Only Notice */}
            <div className="mt-6 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 sm:p-5">
              <div className="flex gap-3">

                <div className="mt-0.5 shrink-0">
                  <FiShield className="text-blue-400" />
                </div>

                <p className="text-sm leading-6 text-blue-300">
                  Your profile information is currently
                  read-only. Profile editing can be added once
                  the backend update API is available.
                </p>

              </div>
            </div>

            {/* Logout */}
            <div className="mt-6 flex justify-stretch sm:justify-end">
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 sm:w-auto"
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