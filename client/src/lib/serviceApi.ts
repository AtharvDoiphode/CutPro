import API from "./authApi";

export const getAllServices = async () => {
  const response = await API.get("/services");

  return response.data;
};