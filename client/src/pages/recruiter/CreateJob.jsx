import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  const [formData, setFormData] = useState(initialFormData);
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

    if (!Number.isFinite(salaryNumber) || salaryNumber <= 0) {
      setError("Please enter a valid salary number.");
      return;
    }

    if (skillsArray.length === 0) {
      setError("Please enter at least one required skill.");
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
    "mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200";

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-lg bg-white p-8 shadow">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">
            Create New Job
          </h1>

          <p className="mb-8 text-gray-600">
            Add details about the job vacancy.
          </p>

          {message && (
            <div className="mb-6 rounded-lg bg-green-100 p-4 text-green-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="title"
                className="mb-2 block font-semibold text-gray-700"
              >
                Job Title
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

            <div>
              <label
                htmlFor="company"
                className="mb-2 block font-semibold text-gray-700"
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
                className="mb-2 block font-semibold text-gray-700"
              >
                Location
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

            <div>
              <label
                htmlFor="salary"
                className="mb-2 block font-semibold text-gray-700"
              >
                Annual Salary
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

              <p className="mt-1 text-xs text-gray-500">
                Enter annual salary as a number.
              </p>
            </div>

            <div>
              <label
                htmlFor="skills"
                className="mb-2 block font-semibold text-gray-700"
              >
                Required Skills
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

              <p className="mt-1 text-xs text-gray-500">
                Separate skills with commas.
              </p>
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block font-semibold text-gray-700"
              >
                Job Description
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Write job description"
                rows={6}
                required
                className={`${inputClassName} resize-y`}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating Job..." : "Create Job"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateJob;