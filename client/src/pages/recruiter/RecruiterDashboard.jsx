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
        totalApplicants: data.totalApplicants || 0,
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

  const statCards = [
    {
      title: "Total Jobs",
      value: stats.totalJobs,
      description: "Jobs posted by you",
      icon: FiBriefcase,
      iconClass: "text-blue-400",
      iconBg: "bg-blue-500/10",
      borderHover: "hover:border-blue-500/50",
    },
    {
      title: "Total Applicants",
      value: stats.totalApplicants,
      description: "Candidates applied",
      icon: FiUsers,
      iconClass: "text-emerald-400",
      iconBg: "bg-emerald-500/10",
      borderHover: "hover:border-emerald-500/50",
    },
    {
      title: "Active Jobs",
      value: stats.activeJobs,
      description: "Currently active jobs",
      icon: FiBriefcase,
      iconClass: "text-purple-400",
      iconBg: "bg-purple-500/10",
      borderHover: "hover:border-purple-500/50",
    },
  ];

  const quickActions = [
    {
      to: "/recruiter/jobs",
      title: "My Jobs",
      description: "Manage your posted jobs.",
      icon: FiBriefcase,
      iconClass: "text-blue-400",
      iconBg: "bg-blue-500/10",
      borderHover: "hover:border-blue-500/50",
    },
    {
      to: "/recruiter/create-job",
      title: "Create Job",
      description: "Post a new vacancy.",
      icon: FiPlusCircle,
      iconClass: "text-emerald-400",
      iconBg: "bg-emerald-500/10",
      borderHover: "hover:border-emerald-500/50",
    },
    {
      to: "/recruiter/applications",
      title: "Applicants",
      description: "View candidates.",
      icon: FiUsers,
      iconClass: "text-purple-400",
      iconBg: "bg-purple-500/10",
      borderHover: "hover:border-purple-500/50",
    },
    {
      to: "/direct-chat",
      title: "Messages",
      description: "Chat with candidates.",
      icon: FiMessageCircle,
      iconClass: "text-cyan-400",
      iconBg: "bg-cyan-500/10",
      borderHover: "hover:border-cyan-500/50",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* HEADER */}
        <section className="mb-7 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-black/10 sm:mb-8 sm:p-6 lg:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
                  Recruiter Dashboard
                </span>

                {!loading && !error && (
                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                    Dashboard Active
                  </span>
                )}
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                Welcome, {recruiterName} 👋
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                Manage your jobs, applicants and hiring
                process from one place.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchDashboardStats}
              disabled={loading}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-blue-500 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              <FiRefreshCw
                className={`text-base ${
                  loading ? "animate-spin" : ""
                }`}
              />

              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </section>

        {/* ERROR */}
        {error && (
          <div className="mb-6 flex flex-col gap-3 rounded-xl border border-red-900/70 bg-red-950/40 p-4 text-sm text-red-300 sm:flex-row sm:items-center sm:justify-between">
            <p className="wrap-break-word">{error}</p>

            <button
              type="button"
              onClick={fetchDashboardStats}
              className="inline-flex min-h-10 w-full shrink-0 items-center justify-center gap-2 rounded-lg border border-red-800 bg-red-950/60 px-4 py-2 font-medium text-red-200 transition hover:bg-red-900/50 sm:w-auto"
            >
              <FiRefreshCw />
              Retry
            </button>
          </div>
        )}

        {/* STATS */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your current hiring activity at a glance.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {statCards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className={`group rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-black/5 transition duration-200 hover:-translate-y-0.5 hover:bg-slate-900/90 sm:p-6 ${card.borderHover}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${card.iconBg}`}
                    >
                      <Icon
                        className={`text-xl ${card.iconClass}`}
                      />
                    </div>

                    <span className="text-xs font-medium text-slate-500">
                      Overview
                    </span>
                  </div>

                  <p className="mt-5 text-sm font-medium text-slate-400">
                    {card.title}
                  </p>

                  <h3 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    {loading ? "..." : card.value}
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section className="mt-8 sm:mt-10">
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-white sm:text-2xl">
                Quick Actions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Quickly access your most-used recruiter tools.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.title}
                  to={action.to}
                  className={`group flex min-h-48 flex-col rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-black/5 transition duration-200 hover:-translate-y-1 hover:bg-slate-900/90 sm:p-6 ${action.borderHover}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${action.iconBg}`}
                    >
                      <Icon
                        className={`text-xl ${action.iconClass}`}
                      />
                    </div>

                    <FiArrowRight className="text-lg text-slate-600 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-slate-300" />
                  </div>

                  <div className="mt-auto pt-8">
                    <h3 className="text-base font-semibold text-white">
                      {action.title}
                    </h3>

                    <p className="mt-2 text-sm leading-5 text-slate-400">
                      {action.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

export default RecruiterDashboard;