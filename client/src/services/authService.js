import axios from "./axios";

const registerUser = async (userData) => {
  const response = await axios.post("/auth/register", userData);

  return response.data;
};

const loginUser = async (userData) => {
  const response = await axios.post("/auth/login", userData);

  if (response.data?.token) {
    localStorage.setItem("token", response.data.token);
  }

  return response.data;
};

const getProfile = async () => {
  const response = await axios.get("/auth/profile");

  return response.data;
};

const logoutUser = () => {
  localStorage.removeItem("token");
};

export {
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
};