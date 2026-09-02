import axios from "./axios";

const getMyResume = async () => {
  const response = await axios.get("/resumes/my");

  return response.data;
};

const deleteMyResume = async () => {
  const response = await axios.delete("/resumes/my");

  return response.data;
};

const matchResumeWithJob = async (jobId) => {
  const response = await axios.get(
    `/resumes/match/${jobId}`
  );

  return response.data;
};

export {
  getMyResume,
  deleteMyResume,
  matchResumeWithJob,
};