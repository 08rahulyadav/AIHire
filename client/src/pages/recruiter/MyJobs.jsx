import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  FiBriefcase,
  FiMapPin,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiDollarSign,
} from "react-icons/fi";

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
      <div className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center shadow-lg sm:p-12">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-slate-700 border-t-blue-500">
              <span className="sr-only">
                Loading
              </span>
            </div>

            <p className="text-sm text-slate-400 sm:text-base">
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
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="mb-7 flex flex-col gap-5 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
              <FiBriefcase />
              Recruiter Jobs
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              My Jobs
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-400 sm:text-base">
              Manage your posted job vacancies.
            </p>
          </div>

          <Link
            to="/recruiter/create-job"
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-950/20 transition hover:bg-blue-500 sm:w-auto"
          >
            <FiPlus className="text-lg" />
            Create Job
          </Link>
        </div>

        {/* ======================================
            JOB COUNT
        ====================================== */}

        {jobs.length > 0 && (
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-400">
              <span className="font-semibold text-white">
                {jobs.length}
              </span>{" "}
              {jobs.length === 1
                ? "job"
                : "jobs"}{" "}
              posted
            </p>
          </div>
        )}

        {/* ======================================
            NO JOBS
        ====================================== */}

        {jobs.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7 text-center shadow-lg sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10">
              <FiBriefcase className="text-3xl text-blue-400" />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-white">
              No Jobs Found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
              You have not posted any jobs yet. Create
              your first vacancy to start receiving
              applications.
            </p>

            <Link
              to="/recruiter/create-job"
              className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 sm:w-auto"
            >
              <FiPlus />
              Create Your First Job
            </Link>
          </div>
        ) : (
          <>
            {/* ======================================
                MOBILE JOB CARDS
            ====================================== */}

            <div className="grid gap-4 md:hidden">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-black/5"
                >
                  {/* TITLE */}

                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="wrap-break-word text-lg font-semibold text-white">
                        {job.title || "N/A"}
                      </h2>

                      <p className="mt-1 wrap-break-word text-sm text-slate-400">
                        {job.company || "N/A"}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400">
                      {job.jobType ||
                        job.type ||
                        "Full-time"}
                    </span>
                  </div>

                  {/* DETAILS */}

                  <div className="mt-5 grid gap-3">
                    <div className="flex items-start gap-3 rounded-xl bg-slate-950/60 p-3">
                      <FiMapPin className="mt-0.5 shrink-0 text-blue-400" />

                      <div className="min-w-0">
                        <p className="text-xs text-slate-500">
                          Location
                        </p>

                        <p className="mt-1 wrap-break-word text-sm text-slate-300">
                          {job.location || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-xl bg-slate-950/60 p-3">
                      <FiDollarSign className="mt-0.5 shrink-0 text-emerald-400" />

                      <div className="min-w-0">
                        <p className="text-xs text-slate-500">
                          Salary
                        </p>

                        <p className="mt-1 text-sm text-slate-300">
                          ₹
                          {Number(
                            job.salary || 0
                          ).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl bg-slate-950/60 p-3">
                      <p className="text-xs text-slate-500">
                        Skills
                      </p>

                      <p className="mt-1 wrap-break-word text-sm leading-5 text-slate-300">
                        {Array.isArray(job.skills)
                          ? job.skills.join(", ")
                          : job.skills || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* ACTIONS */}

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <Link
                      to={`/recruiter/jobs/${job._id}/edit`}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
                    >
                      <FiEdit2 />
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(job._id)
                      }
                      disabled={
                        deletingId === job._id
                      }
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <FiTrash2 />

                      {deletingId === job._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ======================================
                DESKTOP TABLE
            ====================================== */}

            <div className="hidden overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg md:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-262.5 text-left">
                  {/* TABLE HEADER */}

                  <thead className="border-b border-slate-800 bg-slate-950/70">
                    <tr>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Job Title
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Company
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Location
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Job Type
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Salary
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Skills
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Action
                      </th>
                    </tr>
                  </thead>

                  {/* TABLE BODY */}

                  <tbody>
                    {jobs.map((job) => (
                      <tr
                        key={job._id}
                        className="border-b border-slate-800/80 transition last:border-b-0 hover:bg-slate-800/30"
                      >
                        {/* JOB TITLE */}

                        <td className="max-w-56 px-5 py-5">
                          <p className="wrap-break-word font-semibold text-white">
                            {job.title || "N/A"}
                          </p>
                        </td>

                        {/* COMPANY */}

                        <td className="max-w-48 px-5 py-5">
                          <p className="wrap-break-word text-sm text-slate-300">
                            {job.company || "N/A"}
                          </p>
                        </td>

                        {/* LOCATION */}

                        <td className="max-w-48 px-5 py-5">
                          <div className="flex items-start gap-2">
                            <FiMapPin className="mt-0.5 shrink-0 text-blue-400" />

                            <span className="wrap-break-word text-sm text-slate-300">
                              {job.location || "N/A"}
                            </span>
                          </div>
                        </td>

                        {/* JOB TYPE */}

                        <td className="px-5 py-5">
                          <span className="inline-flex whitespace-nowrap rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400">
                            {job.jobType ||
                              job.type ||
                              "Full-time"}
                          </span>
                        </td>

                        {/* SALARY */}

                        <td className="whitespace-nowrap px-5 py-5">
                          <span className="text-sm font-medium text-slate-300">
                            ₹
                            {Number(
                              job.salary || 0
                            ).toLocaleString("en-IN")}
                          </span>
                        </td>

                        {/* SKILLS */}

                        <td className="max-w-64 px-5 py-5">
                          <p className="wrap-break-word text-sm leading-5 text-slate-400">
                            {Array.isArray(job.skills)
                              ? job.skills.join(", ")
                              : job.skills || "N/A"}
                          </p>
                        </td>

                        {/* ACTION */}

                        <td className="px-5 py-5">
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/recruiter/jobs/${job._id}/edit`}
                              className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
                            >
                              <FiEdit2 />
                              Edit
                            </Link>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(job._id)
                              }
                              disabled={
                                deletingId === job._id
                              }
                              className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              <FiTrash2 />

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
          </>
        )}
      </div>
    </div>
  );
}

export default MyJobs;