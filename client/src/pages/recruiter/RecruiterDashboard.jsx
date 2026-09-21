import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  FiBriefcase,
  FiUsers,
  FiPlusCircle,
  FiArrowRight,
  FiRefreshCw,
  FiMessageCircle,
} from "react-icons/fi";

import axios from "../../services/axios";

function RecruiterDashboard() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplicants: 0,
    activeJobs: 0,
  });

  const [recruiterName, setRecruiterName] =
    useState("Recruiter");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getRecruiterName = () => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user") || "null"
      );

      if (user?.name) {
        setRecruiterName(user.name);
      }
    } catch (error) {
      console.error("User data error:", error);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "/applications/recruiter/stats"
      );

      const data = response.data?.stats || {};

      setStats({
        totalJobs: data.totalJobs || 0,
        totalApplicants:
          data.totalApplicants || 0,
        activeJobs: data.totalJobs || 0,
      });
    } catch (error) {
      console.error(
        "Recruiter Dashboard Error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRecruiterName();
    fetchDashboardStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">

        {/* HEADER */}

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-blue-400">
              Recruiter Dashboard
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Welcome, {recruiterName} 👋
            </h1>

            <p className="mt-2 text-slate-400">
              Manage your jobs, applicants and hiring
              process from here.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchDashboardStats}
            disabled={loading}
            className="flex w-fit items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300 hover:border-blue-500 disabled:opacity-50"
          >
            <FiRefreshCw
              className={
                loading ? "animate-spin" : ""
              }
            />

            Refresh
          </button>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-900 bg-red-950/40 p-4 text-red-300">
            {error}
          </div>
        )}

        {/* STATS */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex justify-between">
              <p className="text-slate-400">
                Total Jobs
              </p>

              <FiBriefcase className="text-xl text-blue-400" />
            </div>

            <h2 className="mt-4 text-3xl font-bold">
              {loading ? "..." : stats.totalJobs}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Jobs posted by you
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex justify-between">
              <p className="text-slate-400">
                Total Applicants
              </p>

              <FiUsers className="text-xl text-green-400" />
            </div>

            <h2 className="mt-4 text-3xl font-bold">
              {loading
                ? "..."
                : stats.totalApplicants}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Candidates applied
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex justify-between">
              <p className="text-slate-400">
                Active Jobs
              </p>

              <FiBriefcase className="text-xl text-purple-400" />
            </div>

            <h2 className="mt-4 text-3xl font-bold">
              {loading ? "..." : stats.activeJobs}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Currently active jobs
            </p>
          </div>
        </div>

        {/* QUICK ACTIONS */}

        <div className="mt-8">
          <h2 className="text-xl font-semibold">
            Quick Actions
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <Link
              to="/recruiter/jobs"
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6 hover:border-blue-500"
            >
              <FiBriefcase className="text-2xl text-blue-400" />

              <h3 className="mt-5 font-semibold">
                My Jobs
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Manage your posted jobs.
              </p>
            </Link>

            <Link
              to="/recruiter/create-job"
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6 hover:border-green-500"
            >
              <FiPlusCircle className="text-2xl text-green-400" />

              <h3 className="mt-5 font-semibold">
                Create Job
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Post a new vacancy.
              </p>
            </Link>

            <Link
              to="/recruiter/applications"
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6 hover:border-purple-500"
            >
              <FiUsers className="text-2xl text-purple-400" />

              <h3 className="mt-5 font-semibold">
                Applicants
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                View candidates.
              </p>
            </Link>

            <Link
              to="/direct-chat"
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6 hover:border-blue-500"
            >
              <FiMessageCircle className="text-2xl text-blue-400" />

              <h3 className="mt-5 font-semibold">
                Messages
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Chat with candidates.
              </p>
            </Link>

          </div>
        </div>
      </main>
    </div>
  );
}

export default RecruiterDashboard;