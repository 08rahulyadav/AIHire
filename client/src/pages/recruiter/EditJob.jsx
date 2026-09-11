import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  getJobById,
  updateJob,
} from "../../services/jobService";

const EditJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    jobType: "Full-time",
    salary: "",
    skills: "",
    description: "",
  });

  // ==========================================
  // GET JOB DETAILS
  // ==========================================

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);

        if (!jobId) {
          toast.error("Job ID is missing");
          navigate("/recruiter/jobs");
          return;
        }

        const response = await getJobById(jobId);

        const job = response?.job;

        if (!job) {
          toast.error("Job not found");
          navigate("/recruiter/jobs");
          return;
        }

        setFormData({
          title: job.title || "",
          company: job.company || "",
          location: job.location || "",
          jobType: job.jobType || job.type || "Full-time",
          salary: job.salary ?? "",
          skills: Array.isArray(job.skills)
            ? job.skills.join(", ")
            : job.skills || "",
          description: job.description || "",
        });
      } catch (error) {
        console.error(
          "Fetch Job Error:",
          error.response?.data || error.message
        );

        toast.error(
          error.response?.data?.message ||
            "Failed to load job"
        );

        navigate("/recruiter/jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId, navigate]);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // NORMALIZE SALARY
  // ==========================================

  const normalizeSalary = (value) => {
    const cleaned = String(value)
      .replace(/[₹,\s]/g, "")
      .trim();

    if (!cleaned) {
      return null;
    }

    const number = Number(cleaned);

    if (!Number.isFinite(number)) {
      return null;
    }

    return number;
  };

  // ==========================================
  // UPDATE JOB
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Title
    if (!formData.title.trim()) {
      toast.error("Job title is required");
      return;
    }

    // Company
    if (!formData.company.trim()) {
      toast.error("Company name is required");
      return;
    }

    // Location
    if (!formData.location.trim()) {
      toast.error("Location is required");
      return;
    }

    // Job Type
    if (!formData.jobType.trim()) {
      toast.error("Job type is required");
      return;
    }

    // Salary
    const salary = normalizeSalary(formData.salary);

    if (salary === null) {
      toast.error("Please enter a valid salary");
      return;
    }

    // Description
    if (!formData.description.trim()) {
      toast.error("Job description is required");
      return;
    }

    // Skills
    const skills = formData.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    if (skills.length === 0) {
      toast.error("Please enter at least one skill");
      return;
    }

    try {
      setSaving(true);

      const response = await updateJob(jobId, {
        title: formData.title.trim(),
        company: formData.company.trim(),
        location: formData.location.trim(),
        jobType: formData.jobType.trim(),
        salary,
        skills,
        description: formData.description.trim(),
      });

      if (!response?.success) {
        toast.error(
          response?.message ||
            "Failed to update job"
        );
        return;
      }

      toast.success("Job updated successfully");

      navigate("/recruiter/jobs");
    } catch (error) {
      console.error(
        "Update Job Error:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update job"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
            <p className="text-slate-400">
              Loading job...
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
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-3xl">

        {/* HEADER */}
        <div className="mb-6">
          <Link
            to="/recruiter/jobs"
            className="text-sm text-blue-400 transition hover:text-blue-300"
          >
            ← Back to My Jobs
          </Link>

          <h1 className="mt-4 text-2xl font-bold sm:text-3xl">
            Edit Job
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Update your job vacancy details.
          </p>
        </div>

        {/* FORM CARD */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-8">
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* JOB TITLE */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Job Title
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. .NET Developer"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
              />
            </div>

            {/* COMPANY */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Company Name
              </label>

              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. Digital Power India Pvt Ltd"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
              />
            </div>

            {/* LOCATION + JOB TYPE */}
            <div className="grid gap-5 md:grid-cols-2">

              {/* LOCATION */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Remote / Noida"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
                />
              </div>

              {/* JOB TYPE */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Job Type
                </label>

                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-blue-500"
                >
                  <option value="Full-time">
                    Full-time
                  </option>

                  <option value="Part-time">
                    Part-time
                  </option>

                  <option value="Contract">
                    Contract
                  </option>

                  <option value="Internship">
                    Internship
                  </option>

                  <option value="Freelance">
                    Freelance
                  </option>
                </select>
              </div>
            </div>

            {/* SALARY */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Salary
              </label>

              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g. 500000"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
              />
            </div>

            {/* SKILLS */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Required Skills
              </label>

              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="C#, .NET, ASP.NET Core, SQL Server"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
              />

              <p className="mt-2 text-xs text-slate-500">
                Separate skills with commas.
              </p>
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Job Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={7}
                placeholder="Write job description..."
                className="w-full resize-y rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
              />
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col gap-3 pt-3 sm:flex-row">

              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Updating..."
                  : "Update Job"}
              </button>

              <Link
                to="/recruiter/jobs"
                className="rounded-lg border border-slate-700 px-5 py-3 text-center font-semibold text-slate-300 transition hover:bg-slate-800"
              >
                Cancel
              </Link>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default EditJob;