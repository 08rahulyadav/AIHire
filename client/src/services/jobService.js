import axios from "./axios";

// Get all jobs
const getJobs = async () => {
  const response = await axios.get("/jobs");
  return response.data;
};

// Get single job
const getJobById = async (jobId) => {
  const response = await axios.get(`/jobs/${jobId}`);
  return response.data;
};

export {
  getJobs,
  getJobById,
};