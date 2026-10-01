import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FiBriefcase,
  FiMapPin,
  FiCalendar,
  FiFileText,
  FiArrowRight,
} from "react-icons/fi";

import { getMyApplications } from "../../services/applicationService";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await getMyApplications();

        setApplications(response.applications || []);
      } catch (error) {
        console.error("Fetch applications error:", error);

        toast.error(
          error.response?.data?.message ||
            "Failed to load applications"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "shortlisted":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";

      case "interview":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";

      case "selected":
        return "bg-green-500/10 text-green-400 border-green-500/20";

      case "rejected":
        return "bg-red-500/10 text-red-400 border-red-500/20";

      default:
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 text-white">

      <main className="mx-auto w-full max-w-6xl px-3 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

        {/* ==============================
            HEADER
        ============================== */}

        <div className="mb-6 sm:mb-8">
          <p className="text-sm font-semibold text-blue-400">
            Track your job applications
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            My Applications
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            View and track the status of all jobs you have
            applied for.
          </p>
        </div>

        {/* ==============================
            LOADING
        ============================== */}

        {loading ? (
          <div className="flex min-h-60 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

              <p className="mt-4 text-sm text-slate-400">
                Loading applications...
              </p>
            </div>
          </div>
        ) : applications.length === 0 ? (

          /* ==============================
              EMPTY STATE
          ============================== */

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7 text-center shadow-sm sm:p-12">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-slate-500">
              <FiBriefcase className="text-3xl" />
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              No applications yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
              You have not applied for any jobs yet. Start
              exploring available opportunities.
            </p>

            <Link
              to="/candidate/jobs"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-700 sm:w-auto"
            >
              Browse Jobs
              <FiArrowRight />
            </Link>
          </div>

        ) : (

          /* ==============================
              APPLICATION LIST
          ============================== */

          <div className="space-y-4 sm:space-y-5">

            {applications.map((application) => (
              <article
                key={application._id}
                className="group min-w-0 rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-sm transition duration-200 hover:border-slate-700 hover:bg-slate-900/90 sm:p-6"
              >

                {/* Job Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                  <div className="min-w-0 flex-1">

                    <div className="flex min-w-0 items-start gap-3">

                      <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 sm:flex">
                        <FiBriefcase className="text-xl" />
                      </div>

                      <div className="min-w-0">
                        <h2 className="wrap-break-word text-lg font-semibold text-white sm:text-xl">
                          {application.job?.title || "Job Title"}
                        </h2>

                        <p className="mt-1 wrap-break-word text-sm font-medium text-blue-400 sm:text-base">
                          {application.job?.company || "Company"}
                        </p>
                      </div>

                    </div>

                    {/* Meta */}
                    <div className="mt-4 flex flex-col gap-2 text-sm text-slate-400 sm:flex-row sm:flex-wrap sm:gap-x-5 sm:gap-y-2">

                      {application.job?.location && (
                        <span className="flex min-w-0 items-center gap-2">
                          <FiMapPin className="shrink-0 text-slate-500" />

                          <span className="wrap-break-word">
                            {application.job.location}
                          </span>
                        </span>
                      )}

                      <span className="flex items-center gap-2">
                        <FiCalendar className="shrink-0 text-slate-500" />

                        <span>
                          {application.createdAt
                            ? new Date(
                                application.createdAt
                              ).toLocaleDateString()
                            : "Date not available"}
                        </span>
                      </span>

                    </div>
                  </div>

                  {/* Status */}
                  <span
                    className={`inline-flex w-fit shrink-0 items-center rounded-full border px-3 py-1.5 text-xs font-semibold capitalize sm:px-4 sm:py-2 sm:text-sm ${getStatusClass(
                      application.status
                    )}`}
                  >
                    {application.status || "applied"}
                  </span>

                </div>

                {/* Divider */}
                <div className="my-5 border-t border-slate-800" />

                {/* Actions */}
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">

                  {application.job?._id && (
                    <Link
                      to={`/candidate/jobs/${application.job._id}`}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white sm:w-auto"
                    >
                      View Job Details
                      <FiArrowRight />
                    </Link>
                  )}

                  {application.resume?.fileUrl && (
                    <a
                      href={application.resume.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white sm:w-auto"
                    >
                      <FiFileText />
                      View Resume
                    </a>
                  )}

                </div>

              </article>
            ))}

          </div>
        )}

      </main>
    </div>
  );
}

export default Applications;