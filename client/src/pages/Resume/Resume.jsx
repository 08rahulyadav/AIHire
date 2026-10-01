import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  FiUpload,
  FiFileText,
  FiCheckCircle,
  FiTrash2,
  FiEye,
  FiTarget,
} from "react-icons/fi";

import {
  getMyResume,
  deleteMyResume,
} from "../../services/resumeService";

import axios from "../../services/axios";

const Resume = () => {
  const [file, setFile] = useState(null);
  const [resume, setResume] = useState(null);
  const [resumes, setResumes] = useState([]);

  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchResume = async () => {
    try {
      setLoading(true);

      const response = await getMyResume();

      setResume(response.resume || null);
      setResumes(response.resumes || []);
    } catch (error) {
      console.error("Fetch resumes error:", error);

      if (error.response?.status !== 404) {
        toast.error(
          error.response?.data?.message ||
            "Failed to fetch resumes"
        );
      }

      setResume(null);
      setResumes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResume();
  }, []);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      toast.error("Please select a PDF file");
      event.target.value = "";
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("Resume must be less than 5MB");
      event.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a resume first");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("resume", file);

      const response = await axios.post("/resumes", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await fetchResume();
      setFile(null);

      toast.success(
        response.data.message || "Resume uploaded successfully"
      );
    } catch (error) {
      console.error("Resume upload error:", error);

      toast.error(
        error.response?.data?.message ||
          "Resume upload failed"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (resumeId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resume?"
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      const response = await deleteMyResume(resumeId);

      setResumes((previousResumes) =>
        previousResumes.filter(
          (item) => item._id !== resumeId
        )
      );

      setResume((previousResume) =>
        previousResume?._id === resumeId
          ? null
          : previousResume
      );

      toast.success(
        response.message || "Resume deleted successfully"
      );
    } catch (error) {
      console.error("Delete resume error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete resume"
      );
    } finally {
      setDeleting(false);
    }
  };

  const score = resume?.score ?? 0;

  const scoreStatus =
    score >= 80
      ? "Excellent"
      : score >= 60
        ? "Good"
        : "Needs Improvement";

  const scorePercentage = Math.min(
    Math.max(score, 0),
    100
  );

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <main className="mx-auto w-full max-w-6xl px-3 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

        {/* ==============================
            PAGE HEADER
        ============================== */}

        <div className="mb-6 sm:mb-8">
          <p className="text-sm font-semibold text-blue-400">
            Candidate Profile
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            My Resumes
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Upload multiple resumes and select the right
            resume for each job.
          </p>
        </div>

        {loading ? (
          /* ==============================
              LOADING
          ============================== */

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center shadow-sm sm:p-14">
            <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

            <p className="text-sm text-slate-400">
              Loading resumes...
            </p>
          </div>
        ) : (
          <>
            {/* ==============================
                MY RESUMES
            ============================== */}

            {resumes.length > 0 && (
              <section className="mb-6 sm:mb-8">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold sm:text-xl">
                    My Resumes
                  </h2>

                  <p className="mt-1 text-sm leading-5 text-slate-400">
                    Each resume can be used for different job
                    applications.
                  </p>
                </div>

                <div className="space-y-4">
                  {resumes.map((item) => (
                    <div
                      key={item._id}
                      className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-sm transition hover:border-slate-700 sm:p-6"
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                        {/* Resume Info */}
                        <div className="flex min-w-0 items-start gap-3 sm:gap-4">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 sm:h-14 sm:w-14">
                            <FiFileText className="text-xl sm:text-2xl" />
                          </div>

                          <div className="min-w-0">
                            <h3 className="wrap-break-word font-semibold text-white sm:text-base">
                              {item.fileName || "My Resume.pdf"}
                            </h3>

                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs sm:text-sm">

                              <span className="flex items-center gap-1.5 text-green-400">
                                <FiCheckCircle className="shrink-0" />
                                Uploaded
                              </span>

                              <span className="text-slate-400">
                                Score:{" "}
                                <span className="font-semibold text-white">
                                  {item.score || 0}/100
                                </span>
                              </span>

                              <span className="text-slate-400">
                                Skills:{" "}
                                <span className="font-semibold text-white">
                                  {item.skills?.length || 0}
                                </span>
                              </span>

                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">

                          {item.fileUrl && (
                            <a
                              href={item.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white sm:w-auto"
                            >
                              <FiEye />
                              Preview
                            </a>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(item._id)
                            }
                            disabled={deleting}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                          >
                            <FiTrash2 />

                            {deleting
                              ? "Deleting..."
                              : "Delete"}
                          </button>

                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ==============================
                UPLOAD
            ============================== */}

            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-sm sm:p-6 lg:p-7">

              <div className="mb-5 sm:mb-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                    <FiUpload />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold sm:text-xl">
                      Upload New Resume
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                      PDF only • Maximum size 5MB
                    </p>
                  </div>
                </div>
              </div>

              <label className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950/50 px-4 py-10 text-center transition hover:border-blue-500 hover:bg-blue-500/5 sm:px-6 sm:py-14">

                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 transition group-hover:scale-105">
                  <FiUpload className="text-2xl" />
                </div>

                <p className="font-medium">
                  Click to select your resume
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Upload your PDF resume
                </p>

                <span className="mt-4 rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
                  PDF • Max 5MB
                </span>

                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {/* Selected File */}
              {file && (
                <div className="mt-5 rounded-xl border border-slate-700 bg-slate-950 p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                        <FiFileText />
                      </div>

                      <div className="min-w-0">
                        <p className="wrap-break-word text-sm font-medium text-white">
                          {file.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="w-full rounded-lg px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300 sm:w-auto"
                    >
                      Remove
                    </button>

                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleUpload}
                disabled={!file || uploading}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiUpload />

                {uploading
                  ? "Uploading & Analyzing..."
                  : "Upload Resume"}
              </button>
            </section>

            {/* ==============================
                AI ANALYSIS
            ============================== */}

            {resume && (
              <section className="mt-6 space-y-5 sm:mt-8 sm:space-y-6">

                {/* Score */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm sm:p-6">

                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                    <div>
                      <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                          <FiTarget />
                        </div>

                        <h2 className="text-lg font-semibold sm:text-xl">
                          AI Resume Analysis
                        </h2>
                      </div>

                      <p className="mt-2 text-sm text-slate-400">
                        Latest uploaded resume analysis
                      </p>
                    </div>

                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-end">

                      <div
                        className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full"
                        style={{
                          background: `conic-gradient(#3b82f6 ${
                            scorePercentage * 3.6
                          }deg, #1e293b 0deg)`,
                        }}
                      >
                        <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-slate-900">
                          <span className="text-2xl font-bold">
                            {score}
                          </span>

                          <span className="text-xs text-slate-500">
                            / 100
                          </span>
                        </div>
                      </div>

                      <div className="text-center sm:text-left">
                        <p className="text-sm text-slate-400">
                          Resume Score
                        </p>

                        <p className="mt-1 text-lg font-semibold text-blue-400">
                          {scoreStatus}
                        </p>
                      </div>

                    </div>
                  </div>
                </div>

                {/* AI Summary */}
                {resume.aiSummary && (
                  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm sm:p-6">
                    <h3 className="text-lg font-semibold">
                      AI Summary
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-400 sm:text-base">
                      {resume.aiSummary}
                    </p>
                  </div>
                )}

                {/* Technical Skills */}
                {resume.skills?.length > 0 && (
                  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm sm:p-6">

                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-lg font-semibold">
                        Technical Skills
                      </h3>

                      <span className="w-fit rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-400">
                        {resume.skills.length} Skills
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                      {resume.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="wrap-break-word rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-sm font-medium text-blue-400 sm:px-4"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Strengths / Weaknesses */}
                <div className="grid gap-5 lg:grid-cols-2">

                  {resume.strengths?.length > 0 && (
                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm sm:p-6">

                      <div className="mb-4 flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10 text-green-400">
                          <FiCheckCircle />
                        </div>

                        <h3 className="text-lg font-semibold">
                          Strengths
                        </h3>
                      </div>

                      <div className="space-y-3">
                        {resume.strengths.map((item, index) => (
                          <div
                            key={index}
                            className="wrap-break-word rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm leading-6 text-slate-400"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {resume.weaknesses?.length > 0 && (
                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm sm:p-6">

                      <div className="mb-4">
                        <h3 className="text-lg font-semibold">
                          Areas to Improve
                        </h3>
                      </div>

                      <div className="space-y-3">
                        {resume.weaknesses.map((item, index) => (
                          <div
                            key={index}
                            className="wrap-break-word rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm leading-6 text-slate-400"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                {/* Missing Skills */}
                {resume.missingSkills?.length > 0 && (
                  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm sm:p-6">

                    <h3 className="text-lg font-semibold">
                      Recommended Skills
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      These skills could improve your profile.
                    </p>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {resume.missingSkills.map(
                        (skill, index) => (
                          <div
                            key={index}
                            className="wrap-break-word rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-slate-300"
                          >
                            <span className="mr-2 font-semibold text-blue-400">
                              +
                            </span>

                            {skill}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* AI Suggestions */}
                {resume.suggestions?.length > 0 && (
                  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm sm:p-6">

                    <h3 className="mb-4 text-lg font-semibold">
                      AI Suggestions
                    </h3>

                    <div className="space-y-3">
                      {resume.suggestions.map(
                        (item, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4"
                          >
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-xs font-bold text-blue-400">
                              {index + 1}
                            </span>

                            <p className="wrap-break-word text-sm leading-6 text-slate-400">
                              {item}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Resume;