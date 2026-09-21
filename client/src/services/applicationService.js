import axios from "./axios";

// ==========================================
// CANDIDATE
// ==========================================

// Apply for job
const applyForJob = async (
  jobId,
  resumeId,
  coverLetter = ""
) => {
  const response = await axios.post(
    `/applications/${jobId}`,
    {
      jobId,
      resumeId,
      coverLetter,
    }
  );

  return response.data;
};

// Get my applications
const getMyApplications = async () => {
  const response = await axios.get(
    "/applications/my"
  );

  return response.data;
};

// Candidate stats
const getMyApplicationStats = async () => {
  const response = await axios.get(
    "/applications/candidate/stats"
  );

  return response.data;
};

// Candidate recent applications
const getRecentApplications = async () => {
  const response = await axios.get(
    "/applications/candidate/recent"
  );

  return response.data;
};

// ==========================================
// RECRUITER
// ==========================================

// Get recruiter applications
const getRecruiterApplications = async () => {
  const response = await axios.get(
    "/applications/recruiter/all"
  );

  return response.data;
};

// Recruiter stats
const getRecruiterApplicationStats = async () => {
  const response = await axios.get(
    "/applications/recruiter/stats"
  );

  return response.data;
};

// Recruiter recent applications
const getRecentRecruiterApplications = async () => {
  const response = await axios.get(
    "/applications/recruiter/recent"
  );

  return response.data;
};

// Update application status
const updateApplicationStatus = async (
  applicationId,
  status
) => {
  const response = await axios.patch(
    `/applications/recruiter/${applicationId}/status`,
    {
      status,
    }
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