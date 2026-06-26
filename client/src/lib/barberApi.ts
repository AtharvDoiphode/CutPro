import API from "./authApi";

export const getAllBarbers = async () => {
  const response = await API.get("/barbers");

  return response.data;
};