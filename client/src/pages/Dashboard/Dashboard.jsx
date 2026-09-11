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
  const [loading, setLoading] = useState(true);

  const [applicationStats, setApplicationStats] = useState({
    total: 0,
    pending: 0,
    shortlisted: 0,
    rejected: 0,
  });

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

        if (profileResponse.status === "fulfilled") {
          setUser(profileResponse.value?.user || null);
        }

        if (resumeResponse.status === "fulfilled") {
          setResume(resumeResponse.value?.resume || null);
        }

        if (statsResponse.status === "fulfilled") {
          const stats = statsResponse.value || {};

          setApplicationStats({
            total: stats.total ?? stats.totalApplications ?? 0,
            pending: stats.pending ?? stats.reviewing ?? 0,
            shortlisted: stats.shortlisted ?? 0,
            rejected: stats.rejected ?? 0,
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

          <p className="mt-4 text-sm text-slate-400">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  const resumeUploaded = Boolean(resume);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        {/* Welcome Section */}
        <div className="mb-8">
          <p className="text-sm font-medium text-blue-400">
            Candidate Dashboard
          </p>

          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
            Welcome, {user?.name || "Candidate"} 👋
          </h1>

          <p className="mt-2 text-sm text-slate-400 sm:text-base">
            Manage your resume, applications and job search from here.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">Resume</p>

              {resumeUploaded ? (
                <FiCheckCircle className="text-xl text-green-400" />
              ) : (
                <FiFileText className="text-xl text-blue-400" />
              )}
            </div>

            <h2 className="mt-4 text-xl font-bold sm:text-2xl">
              {resumeUploaded ? "Uploaded" : "Not Uploaded"}
            </h2>

            <p className="mt-2 truncate text-sm text-slate-500">
              {resume?.fileName ||
                "Upload your resume to get AI analysis."}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">
                Resume Score
              </p>

              <FiFileText className="text-xl text-green-400" />
            </div>

            <h2 className="mt-4 text-xl font-bold sm:text-2xl">
              {resume?.score ?? 0}/100
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              AI-powered resume score
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">
                Applications
              </p>

              <FiSend className="text-xl text-purple-400" />
            </div>

            <h2 className="mt-4 text-xl font-bold sm:text-2xl">
              {applicationStats.total}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Jobs you have applied for
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">
                Shortlisted
              </p>

              <FiCheckCircle className="text-xl text-yellow-400" />
            </div>

            <h2 className="mt-4 text-xl font-bold sm:text-2xl">
              {applicationStats.shortlisted}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Applications shortlisted
            </p>
          </div>
        </div>

        {/* Main Cards */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Resume Analysis */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Resume & AI Analysis
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  View and improve your resume using AI.
                </p>
              </div>

              <FiFileText className="text-2xl text-blue-400" />
            </div>

            {resumeUploaded ? (
              <div className="mt-6 rounded-xl border border-slate-700 bg-slate-800/40 p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-blue-500/10 p-3">
                    <FiFileText className="text-2xl text-blue-400" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-semibold">
                      {resume.fileName}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Resume uploaded and analyzed successfully.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg bg-slate-900 p-4">
                    <p className="text-sm text-slate-500">
                      AI Score
                    </p>

                    <p className="mt-1 text-2xl font-bold text-blue-400">
                      {resume.score ?? 0}/100
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-900 p-4">
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
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-700"
                >
                  View Resume Analysis
                  <FiArrowRight />
                </Link>
              </div>
            ) : (
              <div className="mt-6 rounded-xl border border-dashed border-slate-700 bg-slate-800/40 p-8 text-center">
                <FiFileText className="mx-auto text-4xl text-slate-500" />

                <h3 className="mt-4 font-semibold">
                  No resume uploaded
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Upload a PDF resume to analyze your skills,
                  strengths and weaknesses.
                </p>

                <Link
                  to="/candidate/resume"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-700"
                >
                  Upload Resume
                  <FiArrowRight />
                </Link>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
            <h2 className="text-xl font-semibold">
              Quick Actions
            </h2>

            <div className="mt-5 space-y-3">
              <Link
                to="/candidate/jobs"
                className="flex items-center justify-between rounded-xl bg-slate-800 p-4 transition hover:bg-slate-700"
              >
                <span className="flex items-center gap-3">
                  <FiBriefcase />
                  <span>Find Jobs</span>
                </span>

                <FiArrowRight />
              </Link>

              <Link
                to="/candidate/resume"
                className="flex items-center justify-between rounded-xl bg-slate-800 p-4 transition hover:bg-slate-700"
              >
                <span className="flex items-center gap-3">
                  <FiFileText />
                  <span>My Resume</span>
                </span>

                <FiArrowRight />
              </Link>

              <Link
                to="/candidate/applications"
                className="flex items-center justify-between rounded-xl bg-slate-800 p-4 transition hover:bg-slate-700"
              >
                <span className="flex items-center gap-3">
                  <FiSend />
                  <span>My Applications</span>
                </span>

                <FiArrowRight />
              </Link>

              <Link
                to="/candidate/profile"
                className="flex items-center justify-between rounded-xl bg-slate-800 p-4 transition hover:bg-slate-700"
              >
                <span className="flex items-center gap-3">
                  <FiUser />
                  <span>My Profile</span>
                </span>

                <FiArrowRight />
              </Link>

              <Link
                to="/candidate/ai-assistant"
                className="flex w-full items-center justify-between rounded-xl bg-slate-800 p-4 text-left transition hover:bg-slate-700"
              >
                <span className="flex items-center gap-3">
                  <FiMessageCircle />
                  <span>AI Assistant</span>
                </span>

                <FiArrowRight />
              </Link>

              <Link
                to="/candidate/notifications"
                className="flex w-full items-center justify-between rounded-xl bg-slate-800 p-4 text-left transition hover:bg-slate-700"
              >
                <span className="flex items-center gap-3">
                  <FiBell />
                  <span>Notifications</span>
                </span>

                <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>

        {/* Application Summary */}
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Application Summary
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Track your job application progress.
              </p>
            </div>

            <FiSend className="text-2xl text-purple-400" />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-800/70 p-4">
              <div className="flex items-center gap-3">
                <FiClock className="text-yellow-400" />

                <p className="text-sm text-slate-400">
                  Pending
                </p>
              </div>

              <p className="mt-3 text-2xl font-bold">
                {applicationStats.pending}
              </p>
            </div>

            <div className="rounded-xl bg-slate-800/70 p-4">
              <div className="flex items-center gap-3">
                <FiCheckCircle className="text-green-400" />

                <p className="text-sm text-slate-400">
                  Shortlisted
                </p>
              </div>

              <p className="mt-3 text-2xl font-bold">
                {applicationStats.shortlisted}
              </p>
            </div>

            <div className="rounded-xl bg-slate-800/70 p-4">
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
          </div>

          <Link
            to="/candidate/applications"
            className="mt-5 inline-flex items-center gap-2 rounded-lg border border-slate-700 px-5 py-3 text-sm font-semibold transition hover:bg-slate-800"
          >
            View All Applications
            <FiArrowRight />
          </Link>
        </div>

        {/* Account Information */}
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
          <h2 className="text-xl font-semibold">
            Account Information
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            <div>
              <p className="text-sm text-slate-500">
                Name
              </p>

              <p className="mt-1 font-medium">
                {user?.name || "Not available"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Email
              </p>

              <p className="mt-1 break-all font-medium">
                {user?.email || "Not available"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Role
              </p>

              <p className="mt-1 font-medium capitalize">
                {user?.role || "candidate"}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;