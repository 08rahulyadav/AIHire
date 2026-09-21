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

import {
  getJobRecommendations,
} from "../../services/recommendationService";

const Recommendations = () => {
  const [recommendations, setRecommendations] =
    useState([]);

  const [resume, setResume] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==========================================
  // LOAD RECOMMENDATIONS
  // ==========================================

  const loadRecommendations =
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getJobRecommendations();

        setRecommendations(
          response.recommendations || []
        );

        setResume(
          response.resume || null
        );
      } catch (error) {
        console.error(
          "Recommendation error:",
          error
        );

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
      <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

            <p className="mt-4 text-slate-400">
              AI is finding suitable jobs
              for you...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (
    error &&
    !resume
  ) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-8 text-center">
            <FiBriefcase
              size={42}
              className="mx-auto text-yellow-400"
            />

            <h1 className="mt-4 text-2xl font-bold">
              AI Job Recommendations
            </h1>

            <p className="mt-3 text-slate-400">
              {error}
            </p>

            <Link
              to="/candidate/resume"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-700"
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
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-7xl">

        {/* ==================================
            HEADER
        ================================== */}

        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-500/10 p-3">
                <FiStar
                  size={24}
                  className="text-blue-400"
                />
              </div>

              <div>
                <h1 className="text-2xl font-bold sm:text-3xl">
                  AI Job Recommendations
                </h1>

                <p className="mt-1 text-sm text-slate-400">
                  Jobs matched with your
                  resume skills
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={loadRecommendations}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <FiRefreshCw />
            Refresh
          </button>
        </div>

        {/* ==================================
            RESUME SUMMARY
        ================================== */}

        {resume && (
          <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Based on your resume
                </p>

                <h2 className="mt-1 text-lg font-semibold">
                  {resume.fileName}
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Resume Score:{" "}
                  <span className="font-semibold text-green-400">
                    {resume.score || 0}/100
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {resume.skills
                  ?.slice(0, 12)
                  .map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs text-blue-300"
                    >
                      {skill}
                    </span>
                  ))}
              </div>
            </div>
          </section>
        )}

        {/* ==================================
            RESULTS
        ================================== */}

        {recommendations.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
            <FiBriefcase
              size={42}
              className="mx-auto text-slate-600"
            />

            <h2 className="mt-4 text-xl font-semibold">
              No matching jobs found
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              We couldn't find available
              jobs matching your current
              resume skills.
            </p>

            <Link
              to="/candidate/jobs"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold hover:bg-blue-700"
            >
              Browse All Jobs
              <FiArrowRight />
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-5">
              <h2 className="text-xl font-semibold">
                Recommended Jobs
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                {recommendations.length} jobs
                matched with your profile
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {recommendations.map(
                (job) => (
                  <article
                    key={job.jobId}
                    className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-blue-500/30"
                  >

                    {/* JOB HEADER */}

                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                          <FiBriefcase
                            size={22}
                            className="text-blue-400"
                          />
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {job.title}
                          </h3>

                          <p className="mt-1 text-sm text-blue-400">
                            {job.company}
                          </p>
                        </div>
                      </div>

                      {/* MATCH */}

                      <div className="shrink-0 rounded-xl border border-green-500/20 bg-green-500/10 px-3 py-2 text-center">
                        <p className="text-lg font-bold text-green-400">
                          {job.matchPercentage}%
                        </p>

                        <p className="text-[10px] uppercase text-slate-500">
                          Match
                        </p>
                      </div>
                    </div>

                    {/* META */}

                    <div className="mt-5 flex flex-wrap gap-2">
                      {job.location && (
                        <span className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-3 py-2 text-xs text-slate-400">
                          <FiMapPin className="text-blue-400" />
                          {job.location}
                        </span>
                      )}

                      {job.jobType && (
                        <span className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-3 py-2 text-xs text-slate-400">
                          <FiBriefcase className="text-blue-400" />
                          {job.jobType}
                        </span>
                      )}

                      {job.salary !==
                        undefined &&
                        job.salary !==
                          null && (
                          <span className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-3 py-2 text-xs text-slate-400">
                            <FiDollarSign className="text-blue-400" />
                            {job.salary}
                          </span>
                        )}
                    </div>

                    {/* AI REASON */}

                    <div className="mt-5 rounded-xl border border-blue-500/10 bg-blue-500/5 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-400">
                        AI Recommendation
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {job.aiReason}
                      </p>
                    </div>

                    {/* MATCHING SKILLS */}

                    {job.matchingSkills
                      ?.length > 0 && (
                      <div className="mt-5">
                        <div className="mb-2 flex items-center gap-2">
                          <FiCheckCircle className="text-green-400" />

                          <h4 className="text-sm font-semibold">
                            Matching Skills
                          </h4>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {job.matchingSkills.map(
                            (skill) => (
                              <span
                                key={skill}
                                className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs text-green-300"
                              >
                                {skill}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* MISSING SKILLS */}

                    {job.missingSkills
                      ?.length > 0 && (
                      <div className="mt-5">
                        <div className="mb-2 flex items-center gap-2">
                          <FiXCircle className="text-yellow-400" />

                          <h4 className="text-sm font-semibold">
                            Skills to Improve
                          </h4>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {job.missingSkills.map(
                            (skill) => (
                              <span
                                key={skill}
                                className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs text-yellow-300"
                              >
                                {skill}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* VIEW JOB */}

                    <div className="mt-6 border-t border-slate-800 pt-5">
                      <Link
                        to={`/candidate/jobs/${job.jobId}`}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-700"
                      >
                        View Job
                        <FiArrowRight />
                      </Link>
                    </div>

                  </article>
                )
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Recommendations;