import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  FiArrowLeft,
  FiBriefcase,
  FiMapPin,
  FiDollarSign,
  FiCode,
  FiFileText,
  FiSave,
  FiX,
} from "react-icons/fi";

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
          jobType:
            job.jobType ||
            job.type ||
            "Full-time",
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

  const inputClassName =
    "mt-2 min-h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center shadow-lg sm:p-12">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500" />

            <p className="text-sm text-slate-400 sm:text-base">
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
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-3xl">

        {/* HEADER */}

        <div className="mb-6">
          <Link
            to="/recruiter/jobs"
            className="inline-flex min-h-10 items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-900 hover:text-white"
          >
            <FiArrowLeft />
            Back to My Jobs
          </Link>

          <div className="mt-5 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
              <FiBriefcase className="text-xl text-blue-400" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                Recruiter
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Edit Job
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Update your job vacancy details.
              </p>
            </div>
          </div>
        </div>

        {/* FORM CARD */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-7 lg:p-8">
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* JOB TITLE */}

            <div>
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-slate-200"
              >
                <span className="inline-flex items-center gap-2">
                  <FiBriefcase className="text-blue-400" />
                  Job Title
                </span>
              </label>

              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. .NET Developer"
                className={inputClassName}
              />
            </div>

            {/* COMPANY */}

            <div>
              <label
                htmlFor="company"
                className="block text-sm font-semibold text-slate-200"
              >
                Company Name
              </label>

              <input
                id="company"
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. Digital Power India Pvt Ltd"
                className={inputClassName}
              />
            </div>

            {/* LOCATION + JOB TYPE */}

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-semibold text-slate-200"
                >
                  <span className="inline-flex items-center gap-2">
                    <FiMapPin className="text-blue-400" />
                    Location
                  </span>
                </label>

                <input
                  id="location"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Remote / Noida"
                  className={inputClassName}
                />
              </div>

              <div>
                <label
                  htmlFor="jobType"
                  className="block text-sm font-semibold text-slate-200"
                >
                  Job Type
                </label>

                <select
                  id="jobType"
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className={inputClassName}
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
              <label
                htmlFor="salary"
                className="block text-sm font-semibold text-slate-200"
              >
                <span className="inline-flex items-center gap-2">
                  <FiDollarSign className="text-emerald-400" />
                  Salary
                </span>
              </label>

              <input
                id="salary"
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g. 500000"
                className={inputClassName}
              />

              <p className="mt-2 text-xs text-slate-500">
                You can enter a number, commas, spaces,
                or ₹. It will be normalized before saving.
              </p>
            </div>

            {/* SKILLS */}

            <div>
              <label
                htmlFor="skills"
                className="block text-sm font-semibold text-slate-200"
              >
                <span className="inline-flex items-center gap-2">
                  <FiCode className="text-purple-400" />
                  Required Skills
                </span>
              </label>

              <input
                id="skills"
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="C#, .NET, ASP.NET Core, SQL Server"
                className={inputClassName}
              />

              <p className="mt-2 text-xs text-slate-500">
                Separate skills with commas.
              </p>

              {formData.skills.trim() && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.skills
                    .split(",")
                    .map((skill) => skill.trim())
                    .filter(Boolean)
                    .map((skill, index) => (
                      <span
                        key={`${skill}-${index}`}
                        className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-medium text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                </div>
              )}
            </div>

            {/* DESCRIPTION */}

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-slate-200"
              >
                <span className="inline-flex items-center gap-2">
                  <FiFileText className="text-cyan-400" />
                  Job Description
                </span>
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={7}
                placeholder="Write job description..."
                className={`${inputClassName} min-h-40 resize-y`}
              />
            </div>

            {/* BUTTONS */}

            <div className="grid gap-3 border-t border-slate-800 pt-6 sm:grid-cols-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FiSave />

                {saving
                  ? "Updating..."
                  : "Update Job"}
              </button>

              <Link
                to="/recruiter/jobs"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                <FiX />
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