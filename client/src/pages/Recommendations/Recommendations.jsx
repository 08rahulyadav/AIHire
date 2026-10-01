import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  FiBriefcase,
  FiMapPin,
  FiDollarSign,
  FiArrowRight,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
  FiStar,
} from "react-icons/fi";

import toast from "react-hot-toast";

import { getJobRecommendations } from "../../services/recommendationService";

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD RECOMMENDATIONS
  // ==========================================

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getJobRecommendations();

      setRecommendations(response.recommendations || []);
      setResume(response.resume || null);
    } catch (error) {
      console.error("Recommendation error:", error);

      const message =
        error.response?.data?.message ||
        "Unable to load job recommendations.";

      setError(message);
      setRecommendations([]);

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadRecommendations();
  }, []);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 sm:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex min-h-60 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-10">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

              <p className="mt-4 text-sm leading-6 text-slate-400 sm:text-base">
                AI is finding suitable jobs for you...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error && !resume) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 sm:py-10">
        <div className="mx-auto flex min-h-96 max-w-3xl items-center justify-center">
          <div className="w-full rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-6 text-center sm:p-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-500/10">
              <FiBriefcase size={30} className="text-yellow-400" />
            </div>

            <h1 className="mt-5 text-xl font-bold sm:text-2xl">
              AI Job Recommendations
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">
              {error}
            </p>

            <Link
              to="/candidate/resume"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-700 sm:w-auto"
            >
              Upload Resume
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}

        <div className="mb-6 flex flex-col gap-5 sm:mb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-start gap-3 sm:items-center sm:gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 sm:h-12 sm:w-12">
                <FiStar size={22} className="text-blue-400 sm:size-5.5" />
              </div>

              <div className="min-w-0">
                <h1 className="wrap-break-word text-2xl font-bold sm:text-3xl">
                  AI Job Recommendations
                </h1>

                <p className="mt-1 text-sm leading-5 text-slate-400">
                  Jobs matched with your resume skills
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={loadRecommendations}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white sm:w-auto"
          >
            <FiRefreshCw />
            Refresh
          </button>
        </div>

        {/* RESUME SUMMARY */}

        {resume && (
          <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg shadow-black/10 sm:mb-8 sm:p-5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  Based on your resume
                </p>

                <h2 className="mt-1 wrap-break-word text-base font-semibold sm:text-lg">
                  {resume.fileName}
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Resume Score:{" "}
                  <span className="font-semibold text-green-400">
                    {resume.score || 0}/100
                  </span>
                </p>
              </div>

              {resume.skills?.length > 0 && (
                <div className="flex min-w-0 flex-wrap gap-2 lg:max-w-3xl lg:justify-end">
                  {resume.skills.slice(0, 12).map((skill) => (
                    <span
                      key={skill}
                      className="max-w-full wrap-break-word rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs text-blue-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* RESULTS */}

        {recommendations.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center sm:p-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800">
              <FiBriefcase size={30} className="text-slate-500" />
            </div>

            <h2 className="mt-5 text-lg font-semibold sm:text-xl">
              No matching jobs found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
              We couldn't find available jobs matching your current resume
              skills.
            </p>

            <Link
              to="/candidate/jobs"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-700 sm:w-auto"
            >
              Browse All Jobs
              <FiArrowRight />
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-5">
              <h2 className="text-lg font-semibold sm:text-xl">
                Recommended Jobs
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                {recommendations.length} jobs matched with your profile
              </p>
            </div>

            <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
              {recommendations.map((job) => (
                <article
                  key={job.jobId}
                  className="group rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg shadow-black/5 transition hover:border-blue-500/30 sm:p-6"
                >
                  {/* JOB HEADER */}

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 gap-3 sm:gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 sm:h-12 sm:w-12">
                        <FiBriefcase
                          size={20}
                          className="text-blue-400 sm:size-5.5"
                        />
                      </div>

                      <div className="min-w-0">
                        <h3 className="wrap-break-word text-base font-semibold leading-6 text-white sm:text-lg">
                          {job.title}
                        </h3>

                        <p className="mt-1 wrap-break-word text-sm text-blue-400">
                          {job.company}
                        </p>
                      </div>
                    </div>

                    {/* MATCH */}

                    <div className="flex w-fit shrink-0 items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 px-3 py-2 sm:block sm:min-w-18 sm:text-center">
                      <p className="text-base font-bold text-green-400 sm:text-lg">
                        {job.matchPercentage}%
                      </p>

                      <p className="text-[10px] uppercase tracking-wide text-slate-500">
                        Match
                      </p>
                    </div>
                  </div>

                  {/* META */}

                  <div className="mt-5 grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
                    {job.location && (
                      <span className="inline-flex min-w-0 items-center gap-2 rounded-lg bg-slate-950 px-3 py-2 text-xs text-slate-400">
                        <FiMapPin className="shrink-0 text-blue-400" />
                        <span className="wrap-break-word">
                          {job.location}
                        </span>
                      </span>
                    )}

                    {job.jobType && (
                      <span className="inline-flex min-w-0 items-center gap-2 rounded-lg bg-slate-950 px-3 py-2 text-xs text-slate-400">
                        <FiBriefcase className="shrink-0 text-blue-400" />
                        <span className="wrap-break-word">
                          {job.jobType}
                        </span>
                      </span>
                    )}

                    {job.salary !== undefined && job.salary !== null && (
                      <span className="inline-flex min-w-0 items-center gap-2 rounded-lg bg-slate-950 px-3 py-2 text-xs text-slate-400">
                        <FiDollarSign className="shrink-0 text-blue-400" />
                        <span className="wrap-break-word">
                          {job.salary}
                        </span>
                      </span>
                    )}
                  </div>

                  {/* AI REASON */}

                  <div className="mt-5 rounded-xl border border-blue-500/10 bg-blue-500/5 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-400">
                      AI Recommendation
                    </p>

                    <p className="mt-2 wrap-break-word text-sm leading-6 text-slate-300">
                      {job.aiReason}
                    </p>
                  </div>

                  {/* MATCHING SKILLS */}

                  {job.matchingSkills?.length > 0 && (
                    <div className="mt-5">
                      <div className="mb-2 flex items-center gap-2">
                        <FiCheckCircle className="shrink-0 text-green-400" />

                        <h4 className="text-sm font-semibold">
                          Matching Skills
                        </h4>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {job.matchingSkills.map((skill) => (
                          <span
                            key={skill}
                            className="max-w-full wrap-break-word rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-xs text-green-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* MISSING SKILLS */}

                  {job.missingSkills?.length > 0 && (
                    <div className="mt-5">
                      <div className="mb-2 flex items-center gap-2">
                        <FiXCircle className="shrink-0 text-yellow-400" />

                        <h4 className="text-sm font-semibold">
                          Skills to Improve
                        </h4>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {job.missingSkills.map((skill) => (
                          <span
                            key={skill}
                            className="max-w-full wrap-break-word rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1.5 text-xs text-yellow-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* VIEW JOB */}

                  <div className="mt-6 border-t border-slate-800 pt-5">
                    <Link
                      to={`/candidate/jobs/${job.jobId}`}
                      className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                      View Job
                      <FiArrowRight />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Recommendations;