import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FiArrowLeft,
  FiBriefcase,
  FiMapPin,
  FiDollarSign,
  FiClock,
  FiCheckCircle,
  FiSend,
  FiX,
} from "react-icons/fi";

import { getJobById } from "../../services/jobService";
import { applyForJob } from "../../services/applicationService";
import { getMyResume } from "../../services/resumeService";

const JobDetails = () => {
  const { jobId } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showApplyForm, setShowApplyForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);

        const response = await getJobById(jobId);

        setJob(response.job || response.data || null);
      } catch (error) {
        console.error("Fetch job details error:", error);

        toast.error(
          error.response?.data?.message ||
            "Failed to load job details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  const fetchResumes = async () => {
    try {
      setLoadingResumes(true);

      const response = await getMyResume();
      const resumeList = response.resumes || [];

      setResumes(resumeList);

      if (resumeList.length > 0) {
        setSelectedResumeId(resumeList[0]._id);
      }
    } catch (error) {
      console.error("Fetch resumes error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load resumes"
      );
    } finally {
      setLoadingResumes(false);
    }
  };

  const openApplyForm = () => {
    setShowApplyForm(true);
    fetchResumes();
  };

  const handleApply = async (event) => {
    event.preventDefault();

    if (!selectedResumeId) {
      toast.error("Please select a resume before applying");
      return;
    }

    try {
      setApplying(true);

      const response = await applyForJob(
        jobId,
        selectedResumeId,
        coverLetter
      );

      setApplied(true);
      setShowApplyForm(false);
      setCoverLetter("");
      setSelectedResumeId("");

      toast.success(
        response.message ||
          "Application submitted successfully"
      );
    } catch (error) {
      console.error("Apply job error:", error);

      if (error.response?.status === 409) {
        setApplied(true);

        toast.error(
          "You have already applied for this job"
        );
      } else {
        toast.error(
          error.response?.data?.message ||
            "Failed to submit application"
        );
      }
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="text-center">
            <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500" />

            <p className="text-sm text-slate-400">
              Loading job details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
        <div className="mx-auto w-full max-w-4xl px-3 py-6 sm:px-6 sm:py-10">
          <Link
            to="/candidate/jobs"
            className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white sm:mb-8"
          >
            <FiArrowLeft />
            Back to Jobs
          </Link>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-10 text-center sm:p-10">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-slate-600">
              <FiBriefcase size={30} />
            </div>

            <h1 className="text-xl font-semibold">
              Job Not Found
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              This job may have been removed or is no longer
              available.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <main className="mx-auto w-full max-w-6xl px-3 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

        {/* Back */}
        <Link
          to="/candidate/jobs"
          className="mb-5 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white sm:mb-6"
        >
          <FiArrowLeft />
          Back to Jobs
        </Link>

        {/* Job Header */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-sm sm:p-6 lg:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

            <div className="flex min-w-0 items-start gap-3 sm:gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 sm:h-14 sm:w-14">
                <FiBriefcase
                  size={24}
                  className="text-blue-400 sm:text-[26px]"
                />
              </div>

              <div className="min-w-0">
                <h1 className="wrap-break-word text-xl font-bold leading-7 sm:text-2xl lg:text-3xl">
                  {job.title || "Untitled Job"}
                </h1>

                <p className="wrap-break-word mt-1.5 text-sm text-blue-400 sm:mt-2 sm:text-base">
                  {job.company || "Company"}
                </p>
              </div>
            </div>

            {applied ? (
              <button
                disabled
                className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-green-600/20 px-5 py-3 text-sm font-semibold text-green-400 sm:w-auto sm:px-6"
              >
                <FiCheckCircle />
                Applied
              </button>
            ) : (
              <button
                onClick={openApplyForm}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-700 sm:w-auto sm:px-6"
              >
                <FiSend />
                Apply Now
              </button>
            )}
          </div>

          {/* Job Meta */}
          <div className="mt-5 flex flex-wrap gap-2 sm:mt-7 sm:gap-3">
            {job.location && (
              <span className="flex max-w-full items-center gap-2 rounded-lg bg-slate-950 px-3 py-2 text-xs text-slate-400 sm:px-4 sm:text-sm">
                <FiMapPin className="shrink-0 text-blue-400" />

                <span className="wrap-break-word">
                  {job.location}
                </span>
              </span>
            )}

            {(job.jobType || job.type) && (
              <span className="flex max-w-full items-center gap-2 rounded-lg bg-slate-950 px-3 py-2 text-xs text-slate-400 sm:px-4 sm:text-sm">
                <FiClock className="shrink-0 text-blue-400" />

                <span className="wrap-break-word">
                  {job.jobType || job.type}
                </span>
              </span>
            )}

            {(job.salary || job.salaryRange) && (
              <span className="flex max-w-full items-center gap-2 rounded-lg bg-slate-950 px-3 py-2 text-xs text-slate-400 sm:px-4 sm:text-sm">
                <FiDollarSign className="shrink-0 text-blue-400" />

                <span className="wrap-break-word">
                  {job.salary || job.salaryRange}
                </span>
              </span>
            )}
          </div>
        </section>

        {/* Apply Form */}
        {showApplyForm && !applied && (
          <section className="mt-5 rounded-2xl border border-blue-500/20 bg-slate-900 p-4 shadow-sm sm:mt-6 sm:p-6">

            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold sm:text-xl">
                  Apply for this position
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Select a resume and add an optional cover
                  letter.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowApplyForm(false)}
                className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                aria-label="Close application form"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleApply}>

              {/* Resume Selection */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Select Resume
                </label>

                {loadingResumes ? (
                  <div className="rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm text-slate-400">
                    Loading resumes...
                  </div>
                ) : resumes.length === 0 ? (
                  <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
                    <p className="text-sm leading-6 text-yellow-400">
                      You have not uploaded any resume yet.
                    </p>

                    <Link
                      to="/candidate/resume"
                      className="mt-2 inline-block text-sm font-medium text-blue-400 transition hover:text-blue-300"
                    >
                      Upload Resume
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {resumes.map((item) => (
                      <label
                        key={item._id}
                        className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-3 transition sm:p-4 ${
                          selectedResumeId === item._id
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-slate-700 bg-slate-950 hover:border-slate-600"
                        }`}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <input
                            type="radio"
                            name="resume"
                            value={item._id}
                            checked={
                              selectedResumeId === item._id
                            }
                            onChange={(event) =>
                              setSelectedResumeId(
                                event.target.value
                              )
                            }
                            className="h-4 w-4 shrink-0 accent-blue-600"
                          />

                          <div className="min-w-0">
                            <p className="wrap-break-word text-sm font-medium text-white">
                              {item.fileName || "Resume.pdf"}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              AI Score: {item.score || 0}/100
                            </p>
                          </div>
                        </div>

                        {selectedResumeId === item._id && (
                          <FiCheckCircle className="shrink-0 text-blue-400" />
                        )}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Cover Letter */}
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Cover Letter
                <span className="ml-2 text-xs text-slate-500">
                  Optional
                </span>
              </label>

              <textarea
                value={coverLetter}
                onChange={(event) =>
                  setCoverLetter(event.target.value)
                }
                rows={7}
                placeholder="Tell the recruiter why you are a good fit for this position..."
                className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
              />

              <button
                type="submit"
                disabled={
                  applying ||
                  loadingResumes ||
                  resumes.length === 0 ||
                  !selectedResumeId
                }
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                <FiSend />

                {applying
                  ? "Submitting..."
                  : "Submit Application"}
              </button>
            </form>
          </section>
        )}

        {/* Content */}
        <div className="mt-5 grid gap-5 md:mt-6 md:grid-cols-3 md:gap-6">

          {/* Main Content */}
          <div className="min-w-0 space-y-5 sm:space-y-6 md:col-span-2">

            {/* Description */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-sm sm:p-6">
              <h2 className="mb-4 text-lg font-semibold sm:text-xl">
                Job Description
              </h2>

              <p className="whitespace-pre-line wrap-break-word text-sm leading-7 text-slate-400 sm:text-base">
                {job.description ||
                  "No job description available."}
              </p>
            </section>

            {/* Requirements */}
            {job.requirements?.length > 0 && (
              <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-sm sm:p-6">
                <h2 className="mb-4 text-lg font-semibold sm:text-xl">
                  Requirements
                </h2>

                <div className="space-y-3">
                  {job.requirements.map(
                    (requirement, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 rounded-xl bg-slate-950 p-3 sm:p-4"
                      >
                        <FiCheckCircle className="mt-1 shrink-0 text-blue-400" />

                        <p className="wrap-break-word text-sm leading-6 text-slate-400">
                          {requirement}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </section>
            )}

            {/* Responsibilities */}
            {job.responsibilities?.length > 0 && (
              <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-sm sm:p-6">
                <h2 className="mb-4 text-lg font-semibold sm:text-xl">
                  Responsibilities
                </h2>

                <div className="space-y-3">
                  {job.responsibilities.map(
                    (responsibility, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 rounded-xl bg-slate-950 p-3 sm:p-4"
                      >
                        <span className="mt-1 shrink-0 text-blue-400">
                          •
                        </span>

                        <p className="wrap-break-word text-sm leading-6 text-slate-400">
                          {responsibility}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="min-w-0 space-y-5 sm:space-y-6">

            {/* Skills */}
            {job.skills?.length > 0 && (
              <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-sm sm:p-6">
                <h2 className="mb-4 text-lg font-semibold">
                  Required Skills
                </h2>

                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="wrap-break-word rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-xs font-medium text-blue-400"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Apply Card */}
            <section className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 sm:p-6">
              <h2 className="text-lg font-semibold">
                {applied
                  ? "Application Submitted"
                  : "Interested in this job?"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                {applied
                  ? "Your application has been submitted successfully."
                  : "Apply now and take the next step in your career."}
              </p>

              {!applied && (
                <button
                  onClick={openApplyForm}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-700"
                >
                  <FiSend />
                  Apply Now
                </button>
              )}

              {applied && (
                <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-green-500/10 px-5 py-3 text-sm font-semibold text-green-400">
                  <FiCheckCircle />
                  Application Submitted
                </div>
              )}
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default JobDetails;