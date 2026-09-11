import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FiSearch,
  FiMapPin,
  FiBriefcase,
  FiDollarSign,
  FiClock,
} from "react-icons/fi";

import { getJobs } from "../../services/jobService";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");

  const [loading, setLoading] = useState(true);

  // Fetch Jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        const response = await getJobs();

        const jobsData = response.jobs || response.data || [];

        setJobs(jobsData);
        setFilteredJobs(jobsData);
      } catch (error) {
        console.error("Fetch jobs error:", error);

        toast.error(
          error.response?.data?.message || "Failed to load jobs"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filter Jobs
  useEffect(() => {
    const searchValue = search.toLowerCase().trim();
    const locationValue = location.toLowerCase().trim();

    const filtered = jobs.filter((job) => {
      const title = job.title?.toLowerCase() || "";
      const company = job.company?.toLowerCase() || "";
      const description = job.description?.toLowerCase() || "";
      const jobLocation = job.location?.toLowerCase() || "";

      const type =
        job.jobType?.toLowerCase() ||
        job.type?.toLowerCase() ||
        "";

      const matchesSearch =
        !searchValue ||
        title.includes(searchValue) ||
        company.includes(searchValue) ||
        description.includes(searchValue);

      const matchesLocation =
        !locationValue || jobLocation.includes(locationValue);

      const matchesJobType =
        !jobType || type === jobType.toLowerCase();

      return matchesSearch && matchesLocation && matchesJobType;
    });

    setFilteredJobs(filtered);
  }, [search, location, jobType, jobs]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-blue-400">
            Find Your Next Opportunity
          </p>

          <h1 className="text-3xl font-bold md:text-4xl">
            Explore Jobs
          </h1>

          <p className="mt-2 text-slate-400">
            Find jobs that match your skills and career goals.
          </p>
        </div>

        {/* Search / Filters */}
        <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Search */}
            <div className="relative">
              <FiSearch
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search jobs or companies..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
              />
            </div>

            {/* Location */}
            <div className="relative">
              <FiMapPin
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />

              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
              />
            </div>

            {/* Job Type */}
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
            >
              <option value="">All Job Types</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="internship">Internship</option>
              <option value="contract">Contract</option>
              <option value="remote">Remote</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Available Jobs</h2>

          <span className="text-sm text-slate-500">
            {filteredJobs.length} jobs found
          </span>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500" />

            <p className="text-sm text-slate-400">
              Loading jobs...
            </p>
          </div>
        )}

        {/* No Jobs */}
        {!loading && filteredJobs.length === 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center">
            <FiBriefcase
              size={40}
              className="mx-auto mb-4 text-slate-600"
            />

            <h3 className="text-lg font-semibold">
              No jobs found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or filters.
            </p>
          </div>
        )}

        {/* Job List */}
        {!loading && filteredJobs.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-blue-500/40 hover:bg-slate-900/80"
              >
                {/* Job Header */}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                    <FiBriefcase
                      size={22}
                      className="text-blue-400"
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">
                      {job.title || "Untitled Job"}
                    </h3>

                    <p className="mt-1 text-sm text-blue-400">
                      {job.company || "Company"}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-400">
                  {job.description || "No job description available."}
                </p>

                {/* Job Information */}
                <div className="mt-5 flex flex-wrap gap-3">
                  {job.location && (
                    <span className="flex items-center gap-1.5 rounded-lg bg-slate-950 px-3 py-2 text-xs text-slate-400">
                      <FiMapPin />
                      {job.location}
                    </span>
                  )}

                  {(job.jobType || job.type) && (
                    <span className="flex items-center gap-1.5 rounded-lg bg-slate-950 px-3 py-2 text-xs text-slate-400">
                      <FiClock />
                      {job.jobType || job.type}
                    </span>
                  )}

                  {(job.salary || job.salaryRange) && (
                    <span className="flex items-center gap-1.5 rounded-lg bg-slate-950 px-3 py-2 text-xs text-slate-400">
                      <FiDollarSign />
                      {job.salary || job.salaryRange}
                    </span>
                  )}
                </div>

                {/* Skills */}
                {job.skills?.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {job.skills.slice(0, 5).map((skill, index) => (
                      <span
                        key={index}
                        className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400"
                      >
                        {skill}
                      </span>
                    ))}

                    {job.skills.length > 5 && (
                      <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-500">
                        +{job.skills.length - 5}
                      </span>
                    )}
                  </div>
                )}

                {/* Bottom */}
                <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-5">
                  <span className="text-xs text-slate-500">
                    View complete job details
                  </span>

                  <Link
                    to={`/candidate/jobs/${job._id}`}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold transition hover:bg-blue-700"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Jobs;