import API from "./authApi";

export const getBarberDashboard =
  async () => {
    const response =
      await API.get(
        "/barber/dashboard"
      );

    return response.data;
  };

export const getTodayAppointments =
  async () => {
    const response =
      await API.get(
        "/barber/today-appointments"
      );

    return response.data;
  };

export const getCompletedAppointments =
  async () => {
    const response =
      await API.get(
        "/barber/completed-appointments"
      );

    return response.data;
  };

export const getBarberProfile =
  async () => {
    const response =
      await API.get(
        "/barber/profile"
      );

    return response.data;
  };

export const updateBarberProfile =
  async (data: unknown) => {
    const response =
      await API.patch(
        "/barber/profile",
        data
      );

    return response.data;
  };
  /* -------------------------------------------------------------------------- */
/*                      Update Service Status                                 */
/* -------------------------------------------------------------------------- */

export const updateServiceStatus =
  async (
    appointmentId: string,
    serviceStatus: string
  ) => {
    const response =
      await API.patch(
        `/barber/appointments/${appointmentId}/service-status`,
        {
          serviceStatus,
        }
      );

    return response.data;
  };

/* -------------------------------------------------------------------------- */
/*                      Update Payment Status                                 */
/* -------------------------------------------------------------------------- */

export const updatePaymentStatus =
  async (
    appointmentId: string,
    paymentStatus: string
  ) => {
    const response =
      await API.patch(
        `/barber/appointments/${appointmentId}/payment-status`,
        {
          paymentStatus,
        }
      );

    return response.data;
  };