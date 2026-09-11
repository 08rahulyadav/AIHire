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
        <div className="flex min-h-screen items-center justify-center">
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
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <Link
            to="/candidate/jobs"
            className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
          >
            <FiArrowLeft />
            Back to Jobs
          </Link>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
            <FiBriefcase
              size={42}
              className="mx-auto mb-4 text-slate-600"
            />

            <h1 className="text-xl font-semibold">
              Job Not Found
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              This job may have been removed or is no longer
              available.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto max-w-5xl px-6 py-10">
        {/* Job Header */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                <FiBriefcase
                  size={26}
                  className="text-blue-400"
                />
              </div>

              <div>
                <h1 className="text-2xl font-bold md:text-3xl">
                  {job.title || "Untitled Job"}
                </h1>

                <p className="mt-2 text-blue-400">
                  {job.company || "Company"}
                </p>
              </div>
            </div>

            {applied ? (
              <button
                disabled
                className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-green-600/20 px-6 py-3 text-sm font-semibold text-green-400"
              >
                <FiCheckCircle />
                Applied
              </button>
            ) : (
              <button
                onClick={openApplyForm}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold transition hover:bg-blue-700"
              >
                <FiSend />
                Apply Now
              </button>
            )}
          </div>

          {/* Job Meta */}
          <div className="mt-7 flex flex-wrap gap-3">
            {job.location && (
              <span className="flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm text-slate-400">
                <FiMapPin className="text-blue-400" />
                {job.location}
              </span>
            )}

            {(job.jobType || job.type) && (
              <span className="flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm text-slate-400">
                <FiClock className="text-blue-400" />
                {job.jobType || job.type}
              </span>
            )}

            {(job.salary || job.salaryRange) && (
              <span className="flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm text-slate-400">
                <FiDollarSign className="text-blue-400" />
                {job.salary || job.salaryRange}
              </span>
            )}
          </div>
        </section>

        {/* Apply Form */}
        {showApplyForm && !applied && (
          <section className="mt-6 rounded-2xl border border-blue-500/20 bg-slate-900 p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Apply for this position
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Select a resume and add an optional cover letter.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowApplyForm(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
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
                    <p className="text-sm text-yellow-400">
                      You have not uploaded any resume yet.
                    </p>

                    <Link
                      to="/candidate/resume"
                      className="mt-2 inline-block text-sm font-medium text-blue-400 hover:text-blue-300"
                    >
                      Upload Resume
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {resumes.map((item) => (
                      <label
                        key={item._id}
                        className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${
                          selectedResumeId === item._id
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-slate-700 bg-slate-950 hover:border-slate-600"
                        }`}
                      >
                        <div className="flex items-center gap-3">
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
                            className="h-4 w-4 accent-blue-600"
                          />

                          <div>
                            <p className="text-sm font-medium text-white">
                              {item.fileName || "Resume.pdf"}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              AI Score: {item.score || 0}/100
                            </p>
                          </div>
                        </div>

                        {selectedResumeId === item._id && (
                          <FiCheckCircle className="text-blue-400" />
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
                className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
              />

              <button
                type="submit"
                disabled={
                  applying ||
                  loadingResumes ||
                  resumes.length === 0 ||
                  !selectedResumeId
                }
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
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
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="space-y-6 md:col-span-2">
            {/* Description */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="mb-4 text-xl font-semibold">
                Job Description
              </h2>

              <p className="whitespace-pre-line leading-7 text-slate-400">
                {job.description ||
                  "No job description available."}
              </p>
            </section>

            {/* Requirements */}
            {job.requirements?.length > 0 && (
              <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="mb-4 text-xl font-semibold">
                  Requirements
                </h2>

                <div className="space-y-3">
                  {job.requirements.map(
                    (requirement, index) => (
                      <div
                        key={index}
                        className="flex gap-3 rounded-lg bg-slate-950 p-3"
                      >
                        <FiCheckCircle className="mt-1 shrink-0 text-blue-400" />

                        <p className="text-sm leading-6 text-slate-400">
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
              <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="mb-4 text-xl font-semibold">
                  Responsibilities
                </h2>

                <div className="space-y-3">
                  {job.responsibilities.map(
                    (responsibility, index) => (
                      <div
                        key={index}
                        className="flex gap-3 rounded-lg bg-slate-950 p-3"
                      >
                        <span className="mt-1 text-blue-400">
                          •
                        </span>

                        <p className="text-sm leading-6 text-slate-400">
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
          <aside className="space-y-6">
            {/* Skills */}
            {job.skills?.length > 0 && (
              <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="mb-4 text-lg font-semibold">
                  Required Skills
                </h2>

                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-xs font-medium text-blue-400"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Apply Card */}
            <section className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6">
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
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold hover:bg-blue-700"
                >
                  <FiSend />
                  Apply Now
                </button>
              )}

              {applied && (
                <div className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-green-500/10 px-5 py-3 text-sm font-semibold text-green-400">
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