import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FiBriefcase,
  FiMapPin,
  FiCalendar,
  FiFileText,
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
        return "bg-blue-500/20 text-blue-400";

      case "interview":
        return "bg-purple-500/20 text-purple-400";

      case "selected":
        return "bg-green-500/20 text-green-400";

      case "rejected":
        return "bg-red-500/20 text-red-400";

      default:
        return "bg-yellow-500/20 text-yellow-400";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-blue-400">
            Track your job applications
          </p>

          <h1 className="text-3xl font-bold">
            My Applications
          </h1>

          <p className="mt-2 text-slate-400">
            View all jobs you have applied for.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500" />
          </div>
        ) : applications.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center">
            <FiBriefcase
              size={42}
              className="mx-auto mb-4 text-slate-600"
            />

            <h2 className="text-xl font-semibold">
              No applications yet
            </h2>

            <p className="mt-2 text-slate-400">
              You have not applied for any jobs yet.
            </p>

            <Link
              to="/candidate/jobs"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold hover:bg-blue-700"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {applications.map((application) => (
              <div
                key={application._id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {application.job?.title || "Job Title"}
                    </h2>

                    <p className="mt-2 text-blue-400">
                      {application.job?.company || "Company"}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-400">
                      {application.job?.location && (
                        <span className="flex items-center gap-2">
                          <FiMapPin />
                          {application.job.location}
                        </span>
                      )}

                      <span className="flex items-center gap-2">
                        <FiCalendar />
                        {application.createdAt
                          ? new Date(
                              application.createdAt
                            ).toLocaleDateString()
                          : "Date not available"}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-4 py-2 text-sm font-medium capitalize ${getStatusClass(
                      application.status
                    )}`}
                  >
                    {application.status || "applied"}
                  </span>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  {application.job?._id && (
                    <Link
                      to={`/candidate/jobs/${application.job._id}`}
                      className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
                    >
                      View Job Details
                    </Link>
                  )}

                  {application.resume?.fileUrl && (
                    <a
                      href={application.resume.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
                    >
                      <FiFileText />
                      View Resume
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Applications;