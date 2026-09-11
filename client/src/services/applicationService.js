import axios from "./axios";

// Candidate
const applyForJob = async (jobId, resumeId, coverLetter = "") => {
  const response = await axios.post("/applications", {
    jobId,
    resumeId,
    coverLetter,
  });

  return response.data;
};

const getMyApplications = async () => {
  const response = await axios.get("/applications/my");
  return response.data;
};

const getMyApplicationStats = async () => {
  const response = await axios.get("/applications/my/stats");
  return response.data;
};

const getRecentApplications = async () => {
  const response = await axios.get("/applications/my/recent");
  return response.data;
};

// Recruiter
const getRecruiterApplications = async () => {
  const response = await axios.get("/applications/recruiter");
  return response.data;
};

const getRecruiterApplicationStats = async () => {
  const response = await axios.get("/applications/recruiter/stats");
  return response.data;
};

const getRecentRecruiterApplications = async () => {
  const response = await axios.get("/applications/recruiter/recent");
  return response.data;
};

const updateApplicationStatus = async (applicationId, status) => {
  const response = await axios.patch(
    `/applications/${applicationId}/status`,
    { status }
  );

  return response.data;
};

export {
  applyForJob,
  getMyApplications,
  getMyApplicationStats,
  getRecentApplications,
  getRecruiterApplications,
  getRecruiterApplicationStats,
  getRecentRecruiterApplications,
  updateApplicationStatus,
};