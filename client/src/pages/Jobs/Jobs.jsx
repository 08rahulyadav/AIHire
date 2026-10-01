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
    <div className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <main className="mx-auto w-full max-w-7xl px-3 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <p className="mb-2 text-sm font-semibold text-blue-400">
            Find Your Next Opportunity
          </p>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            Explore Jobs
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Find jobs that match your skills and career goals.
          </p>
        </div>

        {/* Search / Filters */}
        <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-sm sm:mb-8 sm:p-5">
          <div className="grid gap-3 md:grid-cols-3 md:gap-4">

            {/* Search */}
            <div className="relative">
              <FiSearch
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search jobs or companies..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
              />
            </div>

            {/* Location */}
            <div className="relative">
              <FiMapPin
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />

              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
              />
            </div>

            {/* Job Type */}
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
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
        <div className="mb-4 flex flex-col gap-2 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold">
            Available Jobs
          </h2>

          <span className="w-fit rounded-full bg-slate-900 px-3 py-1 text-xs text-slate-400 sm:text-sm">
            {filteredJobs.length} jobs found
          </span>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center sm:p-12">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500" />

            <p className="text-sm text-slate-400">
              Loading jobs...
            </p>
          </div>
        )}

        {/* No Jobs */}
        {!loading && filteredJobs.length === 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-10 text-center sm:p-12">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-slate-600">
              <FiBriefcase size={28} />
            </div>

            <h3 className="text-lg font-semibold">
              No jobs found
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Try changing your search or filters.
            </p>
          </div>
        )}

        {/* Job List */}
        {!loading && filteredJobs.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 md:gap-5">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="group flex min-w-0 flex-col rounded-2xl border border-slate-800 bg-slate-900 p-4 transition hover:-translate-y-0.5 hover:border-blue-500/40 hover:bg-slate-900/80 sm:p-6"
              >
                {/* Job Header */}
                <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 sm:h-12 sm:w-12">
                    <FiBriefcase
                      size={21}
                      className="text-blue-400"
                    />
                  </div>

                  <div className="min-w-0">
                    <h3 className="wrap-break-word font-semibold leading-6 text-white">
                      {job.title || "Untitled Job"}
                    </h3>

                    <p className="wrap-break-word mt-1 text-sm text-blue-400">
                      {job.company || "Company"}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-400 sm:mt-5">
                  {job.description ||
                    "No job description available."}
                </p>

                {/* Job Information */}
                <div className="mt-4 flex flex-wrap gap-2 sm:mt-5 sm:gap-3">
                  {job.location && (
                    <span className="flex max-w-full items-center gap-1.5 rounded-lg bg-slate-950 px-3 py-2 text-xs text-slate-400">
                      <FiMapPin className="shrink-0" />
                      <span className="wrap-break-word">
                        {job.location}
                      </span>
                    </span>
                  )}

                  {(job.jobType || job.type) && (
                    <span className="flex max-w-full items-center gap-1.5 rounded-lg bg-slate-950 px-3 py-2 text-xs text-slate-400">
                      <FiClock className="shrink-0" />
                      <span className="wrap-break-word">
                        {job.jobType || job.type}
                      </span>
                    </span>
                  )}

                  {(job.salary || job.salaryRange) && (
                    <span className="flex max-w-full items-center gap-1.5 rounded-lg bg-slate-950 px-3 py-2 text-xs text-slate-400">
                      <FiDollarSign className="shrink-0" />
                      <span className="wrap-break-word">
                        {job.salary || job.salaryRange}
                      </span>
                    </span>
                  )}
                </div>

                {/* Skills */}
                {job.skills?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2 sm:mt-5">
                    {job.skills
                      .slice(0, 5)
                      .map((skill, index) => (
                        <span
                          key={index}
                          className="wrap-break-word rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400"
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
                <div className="mt-5 flex flex-col gap-3 border-t border-slate-800 pt-4 sm:mt-6 sm:flex-row sm:items-center sm:justify-between sm:pt-5">
                  <span className="text-xs leading-5 text-slate-500">
                    View complete job details
                  </span>

                  <Link
                    to={`/candidate/jobs/${job._id}`}
                    className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold transition hover:bg-blue-700 sm:w-auto"
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