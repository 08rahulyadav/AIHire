import axios from "./axios";

const getJobRecommendations = async () => {
  const response = await axios.get("/recommendations");

  return response.data;
};

export { getJobRecommendations };