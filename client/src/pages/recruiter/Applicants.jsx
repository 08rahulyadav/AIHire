import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  FiUsers,
  FiMail,
  FiBriefcase,
  FiFileText,
  FiExternalLink,
  FiRefreshCw,
  FiMessageCircle,
  FiMapPin,
  FiCalendar,
} from "react-icons/fi";

import {
  getRecruiterApplications,
  updateApplicationStatus,
} from "../../services/applicationService";

const Applicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // ==========================================
  // FETCH APPLICANTS
  // ==========================================

  const fetchApplicants = async () => {
    try {
      setLoading(true);

      const response = await getRecruiterApplications();

      setApplicants(response?.applications || []);
    } catch (error) {
      console.error(
        "Fetch recruiter applications error:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load applicants"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  // ==========================================
  // UPDATE APPLICATION STATUS
  // ==========================================

  const handleStatusChange = async (
    applicationId,
    newStatus
  ) => {
    try {
      setUpdatingId(applicationId);

      const response = await updateApplicationStatus(
        applicationId,
        newStatus
      );

      const updatedApplication =
        response?.application;

      setApplicants((previousApplicants) =>
        previousApplicants.map((application) =>
          application._id === applicationId
            ? {
                ...application,
                ...updatedApplication,
                status: newStatus,
              }
            : application
        )
      );

      toast.success(
        response?.message ||
          "Application status updated"
      );
    } catch (error) {
      console.error(
        "Update application status error:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update application status"
      );

      await fetchApplicants();
    } finally {
      setUpdatingId(null);
    }
  };

  // ==========================================
  // STATUS CLASS
  // ==========================================

  const getStatusClass = (status) => {
    switch (status) {
      case "shortlisted":
        return "border-blue-500/30 bg-blue-500/10 text-blue-400";

      case "interview":
        return "border-purple-500/30 bg-purple-500/10 text-purple-400";

      case "selected":
        return "border-green-500/30 bg-green-500/10 text-green-400";

      case "rejected":
        return "border-red-500/30 bg-red-500/10 text-red-400";

      default:
        return "border-yellow-500/30 bg-yellow-500/10 text-yellow-400";
    }
  };

  // ==========================================
  // FORMAT STATUS
  // ==========================================

  const formatStatus = (status) => {
    if (!status) return "Applied";

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1)
    );
  };

  // ==========================================
  // RESUME URL
  // ==========================================

  const getResumeUrl = (fileUrl) => {
    if (!fileUrl) return null;

    if (
      fileUrl.startsWith("http://") ||
      fileUrl.startsWith("https://")
    ) {
      return fileUrl;
    }

    return `http://localhost:7000${fileUrl}`;
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex min-h-96 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900">
            <div className="text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500" />

              <p className="text-sm text-slate-400">
                Loading applicants...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

        {/* HEADER */}

        <div className="mb-7 flex flex-col gap-5 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
              <FiUsers />
              Recruiter Applications
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Applicants
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              View and manage candidates who applied
              for your jobs.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchApplicants}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-blue-500 hover:bg-slate-800 hover:text-white sm:w-auto"
          >
            <FiRefreshCw />
            Refresh
          </button>
        </div>

        {/* APPLICANT COUNT */}

        <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg sm:p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
              <FiUsers className="text-xl text-blue-400" />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Total Applicants
              </p>

              <p className="mt-1 text-2xl font-bold text-white">
                {applicants.length}
              </p>
            </div>
          </div>
        </div>

        {/* EMPTY STATE */}

        {applicants.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center shadow-lg sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800">
              <FiUsers className="text-3xl text-slate-500" />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-white">
              No Applicants Found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              No candidates have applied for your jobs
              yet.
            </p>
          </div>
        ) : (
          /* APPLICANTS */

          <div className="space-y-5">
            {applicants.map((application) => {
              const resumeUrl = getResumeUrl(
                application.resume?.fileUrl
              );

              const candidateId =
                application.candidate?._id;

              return (
                <article
                  key={application._id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-black/5 transition hover:border-slate-700 sm:p-6"
                >
                  {/* TOP */}

                  <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    {/* CANDIDATE */}

                    <div className="flex min-w-0 gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                        <FiUsers className="text-xl text-blue-400" />
                      </div>

                      <div className="min-w-0">
                        <h2 className="wrap-break-word text-lg font-semibold text-white sm:text-xl">
                          {application.candidate?.name ||
                            "Unknown Candidate"}
                        </h2>

                        <div className="mt-3 flex flex-col gap-2 text-sm text-slate-400 sm:flex-row sm:flex-wrap sm:gap-x-5 sm:gap-y-2">
                          <span className="flex min-w-0 items-start gap-2">
                            <FiMail className="mt-0.5 shrink-0 text-blue-400" />

                            <span className="wrap-break-word">
                              {application.candidate
                                ?.email || "No email"}
                            </span>
                          </span>

                          <span className="flex min-w-0 items-start gap-2">
                            <FiBriefcase className="mt-0.5 shrink-0 text-purple-400" />

                            <span className="wrap-break-word">
                              {application.job?.title ||
                                "Unknown Job"}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ACTIONS */}

                    <div className="grid w-full gap-3 sm:flex sm:flex-wrap xl:w-auto xl:justify-end">
                      {/* CHAT */}

                      {candidateId ? (
                        <Link
                          to={`/direct-chat/${candidateId}`}
                          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
                        >
                          <FiMessageCircle />
                          Chat
                        </Link>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="inline-flex min-h-10 cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-500"
                        >
                          <FiMessageCircle />
                          Chat unavailable
                        </button>
                      )}

                      {/* STATUS */}

                      <select
                        aria-label="Application status"
                        value={
                          application.status ||
                          "applied"
                        }
                        disabled={
                          updatingId ===
                          application._id
                        }
                        onChange={(event) =>
                          handleStatusChange(
                            application._id,
                            event.target.value
                          )
                        }
                        className={`min-h-10 w-full rounded-xl border px-4 py-2 text-sm font-semibold outline-none transition sm:w-auto ${getStatusClass(
                          application.status
                        )} disabled:cursor-not-allowed disabled:opacity-60`}
                      >
                        <option value="applied">
                          Applied
                        </option>

                        <option value="shortlisted">
                          Shortlisted
                        </option>

                        <option value="interview">
                          Interview
                        </option>

                        <option value="selected">
                          Selected
                        </option>

                        <option value="rejected">
                          Rejected
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* DETAILS */}

                  <div className="mt-6 grid gap-4 md:grid-cols-3">

                    {/* JOB */}

                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                        <FiBriefcase />
                        Job
                      </div>

                      <p className="mt-3 wrap-break-word font-semibold text-white">
                        {application.job?.title ||
                          "Not available"}
                      </p>

                      <p className="mt-1 wrap-break-word text-sm text-slate-500">
                        {application.job?.company ||
                          "Company not available"}
                      </p>
                    </div>

                    {/* RESUME */}

                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                        <FiFileText />
                        Resume
                      </div>

                      <p className="mt-3 wrap-break-word font-semibold text-white">
                        {application.resume?.fileName ||
                          "Resume not available"}
                      </p>

                      {application.resume?.score !==
                        undefined && (
                        <p className="mt-2 text-sm font-medium text-blue-400">
                          AI Score:{" "}
                          {application.resume.score}/100
                        </p>
                      )}

                      {resumeUrl && (
                        <a
                          href={resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 inline-flex min-h-9 items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-blue-400 transition hover:bg-slate-800 hover:text-blue-300"
                        >
                          View Resume
                          <FiExternalLink />
                        </a>
                      )}
                    </div>

                    {/* APPLICATION STATUS */}

                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                        <FiCalendar />
                        Application
                      </div>

                      <div className="mt-3">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(
                            application.status
                          )}`}
                        >
                          {formatStatus(
                            application.status
                          )}
                        </span>
                      </div>

                      <p className="mt-3 text-sm text-slate-500">
                        Applied{" "}
                        {application.createdAt
                          ? new Date(
                              application.createdAt
                            ).toLocaleDateString()
                          : "Recently"}
                      </p>
                    </div>
                  </div>

                  {/* COVER LETTER */}

                  {application.coverLetter && (
                    <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Cover Letter
                      </p>

                      <p className="mt-3 wrap-break-word whitespace-pre-wrap text-sm leading-6 text-slate-300">
                        {application.coverLetter}
                      </p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Applicants;