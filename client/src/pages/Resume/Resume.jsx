import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FiUpload,
  FiFileText,
  FiCheckCircle,
  FiTrash2,
  FiEye,
  FiArrowLeft,
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
          error.response?.data?.message || "Failed to fetch resumes"
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
        error.response?.data?.message || "Resume upload failed"
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
        previousResumes.filter((item) => item._id !== resumeId)
      );

      setResume((previousResume) =>
        previousResume?._id === resumeId ? null : previousResume
      );

      toast.success(
        response.message || "Resume deleted successfully"
      );
    } catch (error) {
      console.error("Delete resume error:", error);

      toast.error(
        error.response?.data?.message || "Failed to delete resume"
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

  const scorePercentage = Math.min(Math.max(score, 0), 100);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-blue-400">
            Candidate Profile
          </p>

          <h1 className="text-3xl font-bold">My Resumes</h1>

          <p className="mt-2 text-slate-400">
            Upload multiple resumes and select the right resume for each job.
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500" />

            <p className="text-sm text-slate-400">
              Loading resumes...
            </p>
          </div>
        ) : (
          <>
            {resumes.length > 0 && (
              <div className="mb-8 space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">My Resumes</h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Each resume can be used for different job applications.
                  </p>
                </div>

                {resumes.map((item) => (
                  <div
                    key={item._id}
                    className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
                  >
                    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                      <div className="flex items-center gap-4">
                        <div className="rounded-xl bg-blue-500/10 p-4">
                          <FiFileText
                            size={28}
                            className="text-blue-400"
                          />
                        </div>

                        <div>
                          <h3 className="font-semibold text-white">
                            {item.fileName || "My Resume.pdf"}
                          </h3>

                          <div className="mt-2 flex flex-wrap gap-3 text-sm">
                            <span className="flex items-center gap-1 text-green-400">
                              <FiCheckCircle />
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

                      <div className="flex gap-3">
                        {item.fileUrl && (
                          <a
                            href={item.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium transition hover:bg-slate-800"
                          >
                            <FiEye />
                            Preview
                          </a>
                        )}

                        <button
                          onClick={() => handleDelete(item._id)}
                          disabled={deleting}
                          className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <FiTrash2 />
                          {deleting ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
              <div className="mb-6">
                <h2 className="text-xl font-semibold">
                  Upload New Resume
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  PDF only • Maximum size 5MB
                </p>
              </div>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-700 bg-slate-950/50 px-6 py-12 text-center transition hover:border-blue-500 hover:bg-slate-950">
                <div className="mb-4 rounded-full bg-blue-500/10 p-4">
                  <FiUpload size={30} className="text-blue-400" />
                </div>

                <p className="font-medium">
                  Click to select your resume
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Upload your PDF resume
                </p>

                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {file && (
                <div className="mt-5 flex items-center justify-between rounded-xl border border-slate-700 bg-slate-950 p-4">
                  <div className="flex items-center gap-3">
                    <FiFileText
                      size={22}
                      className="text-blue-400"
                    />

                    <div>
                      <p className="text-sm font-medium">
                        {file.name}
                      </p>

                      <p className="text-xs text-slate-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-sm text-red-400 transition hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={handleUpload}
                disabled={!file || uploading}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiUpload />

                {uploading
                  ? "Uploading & Analyzing..."
                  : "Upload Resume"}
              </button>
            </div>

            {resume && (
              <div className="mt-8 space-y-6">
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                  <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <FiTarget
                          size={22}
                          className="text-blue-400"
                        />

                        <h2 className="text-xl font-semibold">
                          AI Resume Analysis
                        </h2>
                      </div>

                      <p className="mt-2 text-sm text-slate-400">
                        Latest uploaded resume analysis
                      </p>
                    </div>

                    <div className="flex items-center gap-5">
                      <div
                        className="relative flex h-28 w-28 items-center justify-center rounded-full"
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

                      <div>
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

                {resume.aiSummary && (
                  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                    <h3 className="mb-3 text-lg font-semibold">
                      AI Summary
                    </h3>

                    <p className="leading-7 text-slate-400">
                      {resume.aiSummary}
                    </p>
                  </div>
                )}

                {resume.skills?.length > 0 && (
                  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-semibold">
                        Technical Skills
                      </h3>

                      <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-400">
                        {resume.skills.length} Skills
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {resume.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                  {resume.strengths?.length > 0 && (
                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                      <div className="mb-4 flex items-center gap-2">
                        <FiCheckCircle
                          size={20}
                          className="text-green-400"
                        />

                        <h3 className="text-lg font-semibold">
                          Strengths
                        </h3>
                      </div>

                      <div className="space-y-3">
                        {resume.strengths.map((item, index) => (
                          <div
                            key={index}
                            className="rounded-lg bg-slate-950 p-3 text-sm leading-6 text-slate-400"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {resume.weaknesses?.length > 0 && (
                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                      <h3 className="mb-4 text-lg font-semibold">
                        Areas to Improve
                      </h3>

                      <div className="space-y-3">
                        {resume.weaknesses.map((item, index) => (
                          <div
                            key={index}
                            className="rounded-lg bg-slate-950 p-3 text-sm leading-6 text-slate-400"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {resume.missingSkills?.length > 0 && (
                  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                    <h3 className="text-lg font-semibold">
                      Recommended Skills
                    </h3>

                    <p className="mt-2 mb-4 text-sm text-slate-400">
                      These skills could improve your profile.
                    </p>

                    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                      {resume.missingSkills.map((skill, index) => (
                        <div
                          key={index}
                          className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-slate-300"
                        >
                          <span className="mr-2 text-blue-400">+</span>
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {resume.suggestions?.length > 0 && (
                  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                    <h3 className="mb-4 text-lg font-semibold">
                      AI Suggestions
                    </h3>

                    <div className="space-y-3">
                      {resume.suggestions.map((item, index) => (
                        <div
                          key={index}
                          className="flex gap-3 rounded-lg bg-slate-950 p-4"
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-xs font-bold text-blue-400">
                            {index + 1}
                          </span>

                          <p className="text-sm leading-6 text-slate-400">
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Resume;