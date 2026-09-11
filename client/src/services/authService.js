import axios from "./axios";

const registerUser = async (userData) => {
  const response = await axios.post("/auth/register", userData);

  return response.data;
};

const loginUser = async (userData) => {
  const response = await axios.post("/auth/login", userData);

  const { token, user } = response.data;

  if (token) {
    localStorage.setItem("token", token);
  }

  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  return response.data;
};

const getProfile = async () => {
  const response = await axios.get("/auth/profile");

  if (response.data?.user) {
    localStorage.setItem(
      "user",
      JSON.stringify(response.data.user)
    );
  }

  return response.data;
};

const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export {
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
};