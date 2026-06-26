import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true,
});

export const registerUser = async (userData: {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
}) => {
  const response = await API.post(
    "/auth/register",
    userData
  );

  return response.data;
};

export const loginUser = async (
  email: string,
  password: string
) => {
  const response = await API.post(
    "/auth/login",
    {
      email,
      password,
    }
  );

  return response.data;
};

export default API;