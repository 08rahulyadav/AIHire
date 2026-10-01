import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiFileText,
  FiBriefcase,
  FiSend,
  FiUser,
  FiBell,
  FiMessageCircle,
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiXCircle,
} from "react-icons/fi";
import toast from "react-hot-toast";

import { getProfile } from "../../services/authService";
import { getMyResume } from "../../services/resumeService";
import { getMyApplicationStats } from "../../services/applicationService";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [resume, setResume] = useState(null);

  const [applicationStats, setApplicationStats] = useState({
    totalApplications: 0,
    applied: 0,
    shortlisted: 0,
    interview: 0,
    selected: 0,
    rejected: 0,
    withdrawn: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          profileResponse,
          resumeResponse,
          statsResponse,
        ] = await Promise.allSettled([
          getProfile(),
          getMyResume(),
          getMyApplicationStats(),
        ]);

        // ==============================
        // PROFILE
        // ==============================

        if (profileResponse.status === "fulfilled") {
          setUser(profileResponse.value?.user || null);
        }

        // ==============================
        // RESUME
        // ==============================

        if (resumeResponse.status === "fulfilled") {
          setResume(
            resumeResponse.value?.resume ||
              resumeResponse.value?.resumes?.[0] ||
              null
          );
        }

        // ==============================
        // APPLICATION STATS
        // ==============================

        if (statsResponse.status === "fulfilled") {
          const response = statsResponse.value || {};
          const stats = response.stats || response;

          setApplicationStats({
            totalApplications:
              stats.totalApplications ??
              stats.total ??
              stats.totalApplicants ??
              0,

            applied: stats.applied ?? 0,
            shortlisted: stats.shortlisted ?? 0,
            interview: stats.interview ?? 0,
            selected: stats.selected ?? 0,
            rejected: stats.rejected ?? 0,
            withdrawn: stats.withdrawn ?? 0,
          });
        }
      } catch (error) {
        console.error("Dashboard data error:", error);

        toast.error(
          error.response?.data?.message ||
            "Unable to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="text-center">
          <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

          <p className="mt-4 text-sm text-slate-400">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  const resumeUploaded = Boolean(resume);

  const statCard =
    "group rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-900/90 sm:p-6";

  const actionLink =
    "group flex min-w-0 items-center justify-between rounded-xl border border-transparent bg-slate-800/70 p-4 transition duration-200 hover:border-slate-700 hover:bg-slate-800";

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <main className="mx-auto w-full max-w-7xl px-3 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

        {/* ==============================
            WELCOME
        ============================== */}

        <section className="mb-7 sm:mb-8">
          <div className="rounded-2xl border border-slate-800 bg-linear-to-br from-slate-900 via-slate-900 to-slate-900/70 p-5 shadow-sm sm:p-7">
            <p className="text-sm font-semibold text-blue-400">
              Candidate Dashboard
            </p>

            <h1 className="mt-2 wrap-break-word text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              Welcome, {user?.name || "Candidate"} 👋
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              Manage your resume, applications and job search
              from one place.
            </p>
          </div>
        </section>

        {/* ==============================
            TOP STATS
        ============================== */}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* Resume */}
          <div className={statCard}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-400">
                  Resume
                </p>

                <h2 className="mt-3 text-xl font-bold sm:text-2xl">
                  {resumeUploaded ? "Uploaded" : "Not Uploaded"}
                </h2>
              </div>

              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  resumeUploaded
                    ? "bg-green-500/10 text-green-400"
                    : "bg-blue-500/10 text-blue-400"
                }`}
              >
                {resumeUploaded ? (
                  <FiCheckCircle className="text-xl" />
                ) : (
                  <FiFileText className="text-xl" />
                )}
              </div>
            </div>

            <p className="mt-3 truncate text-sm text-slate-500">
              {resume?.fileName ||
                "Upload your resume to get AI analysis."}
            </p>
          </div>

          {/* Resume Score */}
          <div className={statCard}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-400">
                  Resume Score
                </p>

                <h2 className="mt-3 text-xl font-bold sm:text-2xl">
                  {resume?.score ?? 0}
                  <span className="text-base font-medium text-slate-500">
                    /100
                  </span>
                </h2>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                <FiFileText className="text-xl" />
              </div>
            </div>

            <p className="mt-3 text-sm text-slate-500">
              AI-powered resume score
            </p>
          </div>

          {/* Applications */}
          <div className={statCard}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-400">
                  Applications
                </p>

                <h2 className="mt-3 text-xl font-bold sm:text-2xl">
                  {applicationStats.totalApplications}
                </h2>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                <FiSend className="text-xl" />
              </div>
            </div>

            <p className="mt-3 text-sm text-slate-500">
              Jobs you have applied for
            </p>
          </div>

          {/* Shortlisted */}
          <div className={statCard}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-400">
                  Shortlisted
                </p>

                <h2 className="mt-3 text-xl font-bold sm:text-2xl">
                  {applicationStats.shortlisted}
                </h2>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400">
                <FiCheckCircle className="text-xl" />
              </div>
            </div>

            <p className="mt-3 text-sm text-slate-500">
              Applications shortlisted
            </p>
          </div>
        </section>

        {/* ==============================
            MAIN CARDS
        ============================== */}

        <section className="mt-6 grid gap-6 lg:grid-cols-3 lg:items-start">

          {/* Resume Analysis */}
          <div className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm sm:p-6 lg:col-span-2">

            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold sm:text-xl">
                  Resume & AI Analysis
                </h2>

                <p className="mt-1 text-sm leading-5 text-slate-400">
                  View and improve your resume using AI.
                </p>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <FiFileText className="text-xl" />
              </div>
            </div>

            {resumeUploaded ? (
              <div className="mt-6 rounded-xl border border-slate-700/80 bg-slate-800/40 p-4 sm:p-6">

                <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                    <FiFileText className="text-xl" />
                  </div>

                  <div className="min-w-0">
                    <p className="wrap-break-word font-semibold text-white">
                      {resume.fileName}
                    </p>

                    <p className="mt-1 text-sm leading-5 text-slate-500">
                      Resume uploaded and analyzed successfully.
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                    <p className="text-sm text-slate-500">
                      AI Score
                    </p>

                    <p className="mt-1 text-2xl font-bold text-blue-400">
                      {resume.score ?? 0}
                      <span className="text-sm font-medium text-slate-500">
                        /100
                      </span>
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                    <p className="text-sm text-slate-500">
                      Skills Found
                    </p>

                    <p className="mt-1 text-2xl font-bold">
                      {resume.skills?.length || 0}
                    </p>
                  </div>
                </div>

                <Link
                  to="/candidate/resume"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-700 sm:w-auto"
                >
                  View Resume Analysis
                  <FiArrowRight />
                </Link>
              </div>
            ) : (
              <div className="mt-6 rounded-xl border border-dashed border-slate-700 bg-slate-800/30 p-6 text-center sm:p-8">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-slate-500">
                  <FiFileText className="text-2xl" />
                </div>

                <h3 className="mt-4 font-semibold">
                  No resume uploaded
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Upload a PDF resume to analyze your skills,
                  strengths and weaknesses.
                </p>

                <Link
                  to="/candidate/resume"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-700 sm:w-auto"
                >
                  Upload Resume
                  <FiArrowRight />
                </Link>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm sm:p-6">

            <div>
              <h2 className="text-lg font-semibold sm:text-xl">
                Quick Actions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Jump to frequently used features.
              </p>
            </div>

            <div className="mt-5 space-y-2.5">

              <Link
                to="/candidate/jobs"
                className={actionLink}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                    <FiBriefcase />
                  </span>

                  <span className="truncate text-sm font-medium">
                    Find Jobs
                  </span>
                </span>

                <FiArrowRight className="shrink-0 text-slate-500 transition group-hover:translate-x-1 group-hover:text-white" />
              </Link>

              <Link
                to="/candidate/resume"
                className={actionLink}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-green-400">
                    <FiFileText />
                  </span>

                  <span className="truncate text-sm font-medium">
                    My Resume
                  </span>
                </span>

                <FiArrowRight className="shrink-0 text-slate-500 transition group-hover:translate-x-1 group-hover:text-white" />
              </Link>

              <Link
                to="/candidate/applications"
                className={actionLink}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                    <FiSend />
                  </span>

                  <span className="truncate text-sm font-medium">
                    My Applications
                  </span>
                </span>

                <FiArrowRight className="shrink-0 text-slate-500 transition group-hover:translate-x-1 group-hover:text-white" />
              </Link>

              <Link
                to="/candidate/profile"
                className={actionLink}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">
                    <FiUser />
                  </span>

                  <span className="truncate text-sm font-medium">
                    My Profile
                  </span>
                </span>

                <FiArrowRight className="shrink-0 text-slate-500 transition group-hover:translate-x-1 group-hover:text-white" />
              </Link>

              <Link
                to="/candidate/ai-assistant"
                className={actionLink}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                    <FiMessageCircle />
                  </span>

                  <span className="truncate text-sm font-medium">
                    AI Assistant
                  </span>
                </span>

                <FiArrowRight className="shrink-0 text-slate-500 transition group-hover:translate-x-1 group-hover:text-white" />
              </Link>

              <Link
                to="/candidate/notifications"
                className={actionLink}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-400">
                    <FiBell />
                  </span>

                  <span className="truncate text-sm font-medium">
                    Notifications
                  </span>
                </span>

                <FiArrowRight className="shrink-0 text-slate-500 transition group-hover:translate-x-1 group-hover:text-white" />
              </Link>

            </div>
          </div>
        </section>

        {/* ==============================
            APPLICATION SUMMARY
        ============================== */}

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm sm:p-6">

          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-lg font-semibold sm:text-xl">
                Application Summary
              </h2>

              <p className="mt-1 text-sm leading-5 text-slate-400">
                Track your job application progress.
              </p>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <FiSend className="text-xl" />
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

            <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-4 transition hover:bg-slate-800">
              <div className="flex items-center gap-3">
                <FiClock className="text-yellow-400" />

                <p className="text-sm text-slate-400">
                  Applied
                </p>
              </div>

              <p className="mt-3 text-2xl font-bold">
                {applicationStats.applied}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-4 transition hover:bg-slate-800">
              <div className="flex items-center gap-3">
                <FiCheckCircle className="text-blue-400" />

                <p className="text-sm text-slate-400">
                  Shortlisted
                </p>
              </div>

              <p className="mt-3 text-2xl font-bold">
                {applicationStats.shortlisted}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-4 transition hover:bg-slate-800">
              <div className="flex items-center gap-3">
                <FiClock className="text-purple-400" />

                <p className="text-sm text-slate-400">
                  Interview
                </p>
              </div>

              <p className="mt-3 text-2xl font-bold">
                {applicationStats.interview}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-4 transition hover:bg-slate-800">
              <div className="flex items-center gap-3">
                <FiCheckCircle className="text-green-400" />

                <p className="text-sm text-slate-400">
                  Selected
                </p>
              </div>

              <p className="mt-3 text-2xl font-bold">
                {applicationStats.selected}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-4 transition hover:bg-slate-800">
              <div className="flex items-center gap-3">
                <FiXCircle className="text-red-400" />

                <p className="text-sm text-slate-400">
                  Rejected
                </p>
              </div>

              <p className="mt-3 text-2xl font-bold">
                {applicationStats.rejected}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-4 transition hover:bg-slate-800">
              <div className="flex items-center gap-3">
                <FiXCircle className="text-slate-400" />

                <p className="text-sm text-slate-400">
                  Withdrawn
                </p>
              </div>

              <p className="mt-3 text-2xl font-bold">
                {applicationStats.withdrawn}
              </p>
            </div>

          </div>

          <Link
            to="/candidate/applications"
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold transition hover:bg-slate-800 sm:w-auto"
          >
            View All Applications
            <FiArrowRight />
          </Link>
        </section>

        {/* ==============================
            ACCOUNT INFORMATION
        ============================== */}

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm sm:p-6">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <FiUser />
            </div>

            <div>
              <h2 className="text-lg font-semibold sm:text-xl">
                Account Information
              </h2>

              <p className="text-sm text-slate-500">
                Your current account details.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Name
              </p>

              <p className="mt-2 wrap-break-word font-medium text-white">
                {user?.name || "Not available"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Email
              </p>

              <p className="mt-2 break-all font-medium text-white">
                {user?.email || "Not available"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-4 sm:col-span-2 lg:col-span-1">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Role
              </p>

              <p className="mt-2 font-medium capitalize text-white">
                {user?.role || "candidate"}
              </p>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
};

export default Dashboard;