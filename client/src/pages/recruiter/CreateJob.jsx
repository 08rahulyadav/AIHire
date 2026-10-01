import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiBriefcase,
  FiMapPin,
  FiDollarSign,
  FiCode,
  FiFileText,
  FiArrowLeft,
  FiCheckCircle,
  FiAlertCircle,
  FiPlus,
} from "react-icons/fi";

import { createJob } from "../../services/jobService";

const initialFormData = {
  title: "",
  company: "",
  location: "",
  salary: "",
  description: "",
  skills: "",
};

function CreateJob() {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState(initialFormData);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    const skillsArray = formData.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    const salaryNumber = Number(formData.salary);

    if (
      !Number.isFinite(salaryNumber) ||
      salaryNumber <= 0
    ) {
      setError(
        "Please enter a valid salary number."
      );
      return;
    }

    if (skillsArray.length === 0) {
      setError(
        "Please enter at least one required skill."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await createJob({
        title: formData.title.trim(),
        company: formData.company.trim(),
        location: formData.location.trim(),
        salary: salaryNumber,
        description: formData.description.trim(),
        skills: skillsArray,
      });

      if (response.success) {
        setMessage("Job created successfully!");
        setFormData(initialFormData);

        setTimeout(() => {
          navigate("/recruiter/jobs");
        }, 800);
      } else {
        setError(
          response.message || "Job creation failed."
        );
      }
    } catch (err) {
      console.error(
        "Create Job Error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Unable to create job. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClassName =
    "mt-2 min-h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

  const labelClassName =
    "block text-sm font-semibold text-slate-200";

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-3xl">

        {/* BACK */}

        <button
          type="button"
          onClick={() => navigate("/recruiter/jobs")}
          className="mb-5 inline-flex min-h-10 items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-900 hover:text-white"
        >
          <FiArrowLeft />
          Back to My Jobs
        </button>

        {/* HEADER */}

        <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg sm:p-7">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
              <FiBriefcase className="text-xl text-blue-400" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                Recruiter
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Create New Job
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-400 sm:text-base">
                Add details about the job vacancy and
                publish it for candidates.
              </p>
            </div>
          </div>
        </div>

        {/* FORM CARD */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg sm:p-7">

          {/* SUCCESS */}

          {message && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300">
              <FiCheckCircle className="mt-0.5 shrink-0 text-lg" />

              <p className="wrap-break-word">
                {message}
              </p>
            </div>
          )}

          {/* ERROR */}

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
              <FiAlertCircle className="mt-0.5 shrink-0 text-lg" />

              <p className="wrap-break-word">
                {error}
              </p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* JOB TITLE */}

            <div>
              <label
                htmlFor="title"
                className={labelClassName}
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
                placeholder="e.g. React Native Developer"
                required
                className={inputClassName}
              />
            </div>

            {/* COMPANY + LOCATION */}

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="company"
                  className={labelClassName}
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
                  required
                  className={inputClassName}
                />
              </div>

              <div>
                <label
                  htmlFor="location"
                  className={labelClassName}
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
                  placeholder="e.g. Faridabad"
                  required
                  className={inputClassName}
                />
              </div>
            </div>

            {/* SALARY */}

            <div>
              <label
                htmlFor="salary"
                className={labelClassName}
              >
                <span className="inline-flex items-center gap-2">
                  <FiDollarSign className="text-emerald-400" />
                  Annual Salary
                </span>
              </label>

              <input
                id="salary"
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g. 600000"
                min="1"
                required
                className={inputClassName}
              />

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Enter annual salary as a number.
              </p>
            </div>

            {/* SKILLS */}

            <div>
              <label
                htmlFor="skills"
                className={labelClassName}
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
                placeholder="e.g. React Native, JavaScript, Redux"
                required
                className={inputClassName}
              />

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Separate skills with commas.
              </p>

              {/* SKILL PREVIEW */}

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
                className={labelClassName}
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
                placeholder="Write job description"
                rows={7}
                required
                className={`${inputClassName} min-h-40 resize-y`}
              />

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Clearly describe the role, responsibilities
                and expectations for candidates.
              </p>
            </div>

            {/* SUBMIT */}

            <div className="border-t border-slate-800 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FiPlus className="text-lg" />

                {loading
                  ? "Creating Job..."
                  : "Create Job"}
              </button>

              <p className="mt-3 text-center text-xs text-slate-500">
                Make sure all job details are correct before
                publishing.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateJob;