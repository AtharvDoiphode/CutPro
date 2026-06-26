import API from "./authApi";

export const getLiveQueue = async (
  barberId: string
) => {
  const response = await API.get(
    `/queue/all/${barberId}`
  );

  return response.data;
};

export const getQueueAnalytics =
  async (barberId: string) => {
    const response = await API.get(
      `/queue/analytics/${barberId}`
    );

    return response.data;
  };

export const nextCustomer = async (
  barberId: string
) => {
  const response = await API.post(
    `/queue/next/${barberId}`
  );

  return response.data;
};