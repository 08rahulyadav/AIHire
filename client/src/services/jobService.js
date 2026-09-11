import axios from "./axios";

// ==========================================
// GET ALL JOBS - CANDIDATE
// ==========================================

const getJobs = async (params = {}) => {
  const response = await axios.get(
    "/jobs",
    {
      params,
    }
  );

  return response.data;
};

// ==========================================
// GET MY JOBS - RECRUITER
// ==========================================

const getMyJobs = async () => {
  const response = await axios.get(
    "/jobs/my"
  );

  return response.data;
};

// ==========================================
// GET SINGLE JOB
// ==========================================

const getJobById = async (jobId) => {
  const response = await axios.get(
    `/jobs/${jobId}`
  );

  return response.data;
};

// ==========================================
// CREATE JOB - RECRUITER
// ==========================================

const createJob = async (jobData) => {
  const response = await axios.post(
    "/jobs",
    jobData
  );

  return response.data;
};

// ==========================================
// UPDATE JOB - RECRUITER
// ==========================================

const updateJob = async (
  jobId,
  jobData
) => {
  const response = await axios.put(
    `/jobs/${jobId}`,
    jobData
  );

  return response.data;
};

// ==========================================
// DELETE JOB - RECRUITER
// ==========================================

const deleteJob = async (jobId) => {
  const response = await axios.delete(
    `/jobs/${jobId}`
  );

  return response.data;
};

export {
  getJobs,
  getMyJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
};