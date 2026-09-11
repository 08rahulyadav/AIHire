import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiBriefcase,
  FiUsers,
  FiPlusCircle,
  FiArrowRight,
  FiRefreshCw,
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
        localStorage.getItem("user")
      );

      if (user?.name) {
        setRecruiterName(user.name);
      }
    } catch (err) {
      console.error("User data error:", err);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError("");

      const [jobsResponse, applicationsResponse] =
        await Promise.all([
          axios.get("/jobs/recruiter/my-jobs"),
          axios.get("/applications/recruiter/stats"),
        ]);

      const jobs =
        jobsResponse.data?.jobs || [];

      const applicationStats =
        applicationsResponse.data?.stats || {};

      setStats({
        totalJobs: jobs.length,
        totalApplicants:
          applicationStats.totalApplicants || 0,
        activeJobs: jobs.length,
      });
    } catch (err) {
      console.error(
        "Recruiter Dashboard Error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
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
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        {/* Welcome */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-blue-400">
              Recruiter Dashboard
            </p>

            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
              Welcome, {recruiterName} 👋
            </h1>

            <p className="mt-2 text-sm text-slate-400 sm:text-base">
              Manage your jobs, applicants and hiring
              process from here.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchDashboardStats}
            disabled={loading}
            className="flex w-fit items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-blue-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiRefreshCw
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
            <span>{error}</span>

            <button
              type="button"
              onClick={fetchDashboardStats}
              className="font-semibold text-red-200 underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Total Jobs */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">
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

          {/* Total Applicants */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">
                Total Applicants
              </p>

              <FiUsers className="text-xl text-green-400" />
            </div>

            <h2 className="mt-4 text-3xl font-bold">
              {loading ? "..." : stats.totalApplicants}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Candidates applied
            </p>
          </div>

          {/* Active Jobs */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">
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

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold">
            Quick Actions
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* My Jobs */}
            <Link
              to="/recruiter/jobs"
              className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-blue-500 hover:bg-slate-800 sm:p-6"
            >
              <div className="flex items-center justify-between">
                <FiBriefcase className="text-2xl text-blue-400" />

                <FiArrowRight className="text-slate-500" />
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                My Jobs
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                View and manage your posted jobs.
              </p>
            </Link>

            {/* Create Job */}
            <Link
              to="/recruiter/create-job"
              className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-green-500 hover:bg-slate-800 sm:p-6"
            >
              <div className="flex items-center justify-between">
                <FiPlusCircle className="text-2xl text-green-400" />

                <FiArrowRight className="text-slate-500" />
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                Create Job
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Post a new job vacancy.
              </p>
            </Link>

            {/* Applicants */}
            <Link
              to="/recruiter/applications"
              className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-purple-500 hover:bg-slate-800 sm:p-6"
            >
              <div className="flex items-center justify-between">
                <FiUsers className="text-2xl text-purple-400" />

                <FiArrowRight className="text-slate-500" />
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                Applicants
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                View candidates who applied for your jobs.
              </p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RecruiterDashboard;