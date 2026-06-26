import API from "./authApi";

/* ==========================
   APPOINTMENTS
========================== */

export const getAllAppointments = async () => {
  const response = await API.get(
    "/appointments"
  );

  return response.data;
};

export const updateAppointmentStatus =
  async (
    appointmentId: string,
    status: string
  ) => {
    const response = await API.patch(
      `/appointments/${appointmentId}/status`,
      { status }
    );

    return response.data;
  };

/* ==========================
   CUSTOMERS
========================== */

export const getAllCustomers =
  async () => {
    const response = await API.get(
      "/dashboard/customers"
    );

    return response.data;
  };

/* ==========================
   BARBERS
========================== */

export const getAllBarbers =
  async () => {
    const response = await API.get(
      "/dashboard/barbers"
    );

    return response.data;
  };

/* ==========================
   DASHBOARD
========================== */

export const getDashboardOverview =
  async () => {
    const response = await API.get(
      "/dashboard/overview"
    );

    return response.data;
  };

export const getTopServices =
  async () => {
    const response = await API.get(
      "/dashboard/top-services"
    );

    return response.data;
  };

export const getTopBarbers =
  async () => {
    const response = await API.get(
      "/dashboard/top-barbers"
    );

    return response.data;
  };

export const getRevenueStats =
  async () => {
    const response = await API.get(
      "/dashboard/revenue"
    );

    return response.data;
  };

export const getDashboardStats =
  async () => {
    const response = await API.get(
      "/dashboard/stats"
    );

    return response.data;
  };