import API from "./authApi";

/* -------------------------------------------------------------------------- */
/*                            Live Queue                                      */
/* -------------------------------------------------------------------------- */

export const getLiveQueue = async (
  barberId: string
) => {
  const response =
    await API.get(
      `/queue/all/${barberId}`
    );

  return response.data;
};

export const getQueueAnalytics =
  async (
    barberId: string
  ) => {
    const response =
      await API.get(
        `/queue/analytics/${barberId}`
      );

    return response.data;
  };

/* -------------------------------------------------------------------------- */
/*                           Public Queue                                     */
/* -------------------------------------------------------------------------- */

export const getPublicQueue =
  async () => {
    const response =
      await API.get(
        "/queue/public"
      );

    return response.data;
  };
  export const getQueueStatus =
  async (
    appointmentId: string
  ) => {
    const response =
      await API.get(
        `/queue/status/${appointmentId}`
      );

    return response.data;
  };
  export const checkInQueue =
  async (
    appointmentId: string
  ) => {
    const response =
      await API.post(
        `/queue/check-in/${appointmentId}`
      );

    return response.data;
  };