import API from "./authApi";

export const getDashboard = async () => {
  const response = await API.get(
    "/customer/dashboard"
  );

  return response.data;
};

export const getUpcomingAppointments =
  async () => {
    const response = await API.get(
      "/customer/upcoming-appointments"
    );

    return response.data;
  };

export const getPastAppointments =
  async () => {
    const response = await API.get(
      "/customer/past-appointments"
    );

    return response.data;
  };

export const getCancelledAppointments =
  async () => {
    const response = await API.get(
      "/customer/cancelled-appointments"
    );

    return response.data;
  };