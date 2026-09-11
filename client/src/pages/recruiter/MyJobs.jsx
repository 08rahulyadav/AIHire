import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getMyJobs,
  deleteJob,
} from "../../services/jobService";

function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // ==========================================
  // FETCH MY JOBS
  // ==========================================

  const fetchMyJobs = async () => {
    try {
      setLoading(true);

      const response = await getMyJobs();

      if (response?.success === false) {
        toast.error(
          response.message || "Unable to load your jobs."
        );
        setJobs([]);
        return;
      }

      setJobs(response?.jobs || []);
    } catch (error) {
      console.error(
        "Get My Jobs Error:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to load your jobs."
      );

      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  // ==========================================
  // DELETE JOB
  // ==========================================

  const handleDelete = async (jobId) => {
    if (!jobId) {
      toast.error("Invalid job ID");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(jobId);

      const response = await deleteJob(jobId);

      if (response?.success) {
        setJobs((previousJobs) =>
          previousJobs.filter(
            (job) => job._id !== jobId
          )
        );

        toast.success("Job deleted successfully");
      } else {
        toast.error(
          response?.message ||
            "Unable to delete job."
        );
      }
    } catch (error) {
      console.error(
        "Delete Job Error:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to delete job."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-lg bg-white p-10 text-center shadow">
            <p className="text-gray-600">
              Loading your jobs...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              My Jobs
            </h1>

            <p className="mt-2 text-gray-600">
              Manage your posted job vacancies.
            </p>
          </div>

          <Link
            to="/recruiter/create-job"
            className="inline-block rounded-lg bg-blue-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
          >
            + Create Job
          </Link>
        </div>

        {/* ======================================
            NO JOBS
        ====================================== */}

        {jobs.length === 0 ? (
          <div className="rounded-lg bg-white p-10 text-center shadow">
            <h2 className="text-xl font-semibold text-gray-700">
              No Jobs Found
            </h2>

            <p className="mt-2 text-gray-500">
              You have not posted any jobs yet.
            </p>

            <Link
              to="/recruiter/create-job"
              className="mt-5 inline-block rounded-lg bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
            >
              Create Your First Job
            </Link>
          </div>
        ) : (

          /* ======================================
             JOB TABLE
          ====================================== */

          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left">

                {/* TABLE HEADER */}

                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-6 py-4">
                      Job Title
                    </th>

                    <th className="px-6 py-4">
                      Company
                    </th>

                    <th className="px-6 py-4">
                      Location
                    </th>

                    <th className="px-6 py-4">
                      Job Type
                    </th>

                    <th className="px-6 py-4">
                      Salary
                    </th>

                    <th className="px-6 py-4">
                      Skills
                    </th>

                    <th className="px-6 py-4">
                      Action
                    </th>
                  </tr>
                </thead>

                {/* TABLE BODY */}

                <tbody>
                  {jobs.map((job) => (
                    <tr
                      key={job._id}
                      className="border-b last:border-b-0 hover:bg-gray-50"
                    >

                      {/* JOB TITLE */}

                      <td className="px-6 py-4 font-semibold text-gray-800">
                        {job.title || "N/A"}
                      </td>

                      {/* COMPANY */}

                      <td className="px-6 py-4 text-gray-700">
                        {job.company || "N/A"}
                      </td>

                      {/* LOCATION */}

                      <td className="px-6 py-4 text-gray-700">
                        {job.location || "N/A"}
                      </td>

                      {/* JOB TYPE */}

                      <td className="px-6 py-4 text-gray-700">
                        {job.jobType ||
                          job.type ||
                          "Full-time"}
                      </td>

                      {/* SALARY */}

                      <td className="px-6 py-4 text-gray-700">
                        ₹
                        {Number(
                          job.salary || 0
                        ).toLocaleString("en-IN")}
                      </td>

                      {/* SKILLS */}

                      <td className="max-w-xs px-6 py-4 text-gray-700">
                        {Array.isArray(job.skills)
                          ? job.skills.join(", ")
                          : job.skills || "N/A"}
                      </td>

                      {/* ACTION */}

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">

                          {/* EDIT */}

                          <Link
                            to={`/recruiter/jobs/${job._id}/edit`}
                            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
                          >
                            Edit
                          </Link>

                          {/* DELETE */}

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(job._id)
                            }
                            disabled={
                              deletingId === job._id
                            }
                            className="rounded-lg bg-red-500 px-4 py-2 font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {deletingId === job._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyJobs;