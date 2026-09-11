import axios from "./axios";

const getMyResume = async () => {
  const response = await axios.get("/resumes/my");

  return response.data;
};

const deleteMyResume = async (resumeId) => {
  const response = await axios.delete(`/resumes/${resumeId}`);

  return response.data;
};

const matchResumeWithJob = async (jobId, resumeId) => {
  const response = await axios.get(`/resumes/match/${jobId}`, {
    params: {
      resumeId,
    },
  });

  return response.data;
};

export {
  getMyResume,
  deleteMyResume,
  matchResumeWithJob,
};