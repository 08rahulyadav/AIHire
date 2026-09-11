import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  FiUsers,
  FiMail,
  FiBriefcase,
  FiFileText,
  FiExternalLink,
  FiRefreshCw,
} from "react-icons/fi";

import {
  getRecruiterApplications,
  updateApplicationStatus,
} from "../../services/applicationService";

const Applicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchApplicants = async () => {
    try {
      setLoading(true);

      const response = await getRecruiterApplications();

      setApplicants(response.applications || []);
    } catch (error) {
      console.error("Fetch recruiter applications error:", error);

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

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      setUpdatingId(applicationId);

      const response = await updateApplicationStatus(
        applicationId,
        newStatus
      );

      const updatedApplication = response.application;

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
        response.message || "Application status updated"
      );
    } catch (error) {
      console.error("Update application status error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update application status"
      );

      // Reload original data in case update failed
      await fetchApplicants();
    } finally {
      setUpdatingId(null);
    }
  };

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

  const formatStatus = (status) => {
    if (!status) return "Applied";

    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getResumeUrl = (fileUrl) => {
    if (!fileUrl) return null;

    if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
      return fileUrl;
    }

    return `http://localhost:7000${fileUrl}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex min-h-[400px] items-center justify-center">
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

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-blue-400">
              <FiUsers />
              <span className="text-sm font-medium">
                Recruiter Applications
              </span>
            </div>

            <h1 className="text-3xl font-bold">
              Applicants
            </h1>

            <p className="mt-2 text-slate-400">
              View and manage candidates who applied for your jobs.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchApplicants}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <FiRefreshCw />
            Refresh
          </button>
        </div>

        {/* Applicant Count */}
        <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-500/10 p-3">
              <FiUsers className="text-xl text-blue-400" />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Total Applicants
              </p>

              <p className="text-2xl font-bold">
                {applicants.length}
              </p>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {applicants.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center">
            <FiUsers className="mx-auto text-5xl text-slate-600" />

            <h2 className="mt-5 text-xl font-semibold">
              No Applicants Found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              No candidates have applied for your jobs yet.
            </p>
          </div>
        ) : (
          /* Applicants */
          <div className="space-y-5">
            {applicants.map((application) => {
              const resumeUrl = getResumeUrl(
                application.resume?.fileUrl
              );

              return (
                <div
                  key={application._id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
                >
                  {/* Top */}
                  <div className="flex flex-col justify-between gap-5 lg:flex-row">

                    {/* Candidate */}
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-500/10">
                        <FiUsers className="text-xl text-blue-400" />
                      </div>

                      <div>
                        <h2 className="text-xl font-semibold">
                          {application.candidate?.name ||
                            "Unknown Candidate"}
                        </h2>

                        <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-400">
                          <span className="flex items-center gap-2">
                            <FiMail />
                            {application.candidate?.email ||
                              "No email"}
                          </span>

                          <span className="flex items-center gap-2">
                            <FiBriefcase />
                            {application.job?.title ||
                              "Unknown Job"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <select
                        value={application.status || "applied"}
                        disabled={updatingId === application._id}
                        onChange={(event) =>
                          handleStatusChange(
                            application._id,
                            event.target.value
                          )
                        }
                        className={`rounded-lg border px-4 py-2 text-sm font-medium outline-none ${getStatusClass(
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

                  {/* Details */}
                  <div className="mt-6 grid gap-4 md:grid-cols-3">

                    {/* Job */}
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <FiBriefcase />
                        Job
                      </div>

                      <p className="mt-2 font-medium text-white">
                        {application.job?.title ||
                          "Not available"}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {application.job?.company ||
                          "Company not available"}
                      </p>
                    </div>

                    {/* Resume */}
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <FiFileText />
                        Resume
                      </div>

                      <p className="mt-2 truncate font-medium text-white">
                        {application.resume?.fileName ||
                          "Resume not available"}
                      </p>

                      {application.resume?.score !== undefined && (
                        <p className="mt-1 text-sm text-blue-400">
                          AI Score: {application.resume.score}/100
                        </p>
                      )}

                      {resumeUrl && (
                        <a
                          href={resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300"
                        >
                          View Resume
                          <FiExternalLink />
                        </a>
                      )}
                    </div>

                    {/* Status */}
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                      <p className="text-sm text-slate-500">
                        Application Status
                      </p>

                      <p className="mt-2 font-semibold">
                        {formatStatus(application.status)}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Applied{" "}
                        {application.createdAt
                          ? new Date(
                              application.createdAt
                            ).toLocaleDateString()
                          : "Recently"}
                      </p>
                    </div>
                  </div>

                  {/* Cover Letter */}
                  {application.coverLetter && (
                    <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-5">
                      <p className="text-sm font-medium text-slate-400">
                        Cover Letter
                      </p>

                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-300">
                        {application.coverLetter}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Applicants;