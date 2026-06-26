import API from "./authApi";

/* -------------------------------------------------------------------------- */
/*                           Create Appointment                               */
/* -------------------------------------------------------------------------- */

export const createAppointment = async (
  appointmentData: {
    customer: string;
    barber: string;
    services: string[];
    appointmentDate: string;
    startTime: string;
    paymentMethod: string;
    notes?: string;
  }
) => {
  const response = await API.post(
    "/appointments",
    appointmentData
  );

  return response.data;
};

/* -------------------------------------------------------------------------- */
/*                        Customer Appointments                               */
/* -------------------------------------------------------------------------- */

export const getMyAppointments = async (
  customerId: string
) => {
  const response = await API.get(
    `/appointments/customer/${customerId}`
  );

  return response.data;
};

/* -------------------------------------------------------------------------- */
/*                         Barber Appointments                                */
/* -------------------------------------------------------------------------- */

export const getBarberAppointments =
  async (barberId: string) => {
    const response = await API.get(
      `/appointments/barber/${barberId}`
    );

    return response.data;
  };

/* -------------------------------------------------------------------------- */
/*                          Admin Appointments                                */
/* -------------------------------------------------------------------------- */

export const getAllAppointments =
  async () => {
    const response =
      await API.get("/appointments");

    return response.data;
  };

/* -------------------------------------------------------------------------- */
/*                         Cancel Appointment                                 */
/* -------------------------------------------------------------------------- */

export const cancelAppointment =
  async (appointmentId: string) => {
    const response = await API.patch(
      `/appointments/${appointmentId}/cancel`
    );

    return response.data;
  };

/* -------------------------------------------------------------------------- */
/*                       Complete Appointment                                 */
/* -------------------------------------------------------------------------- */

export const completeAppointment =
  async (appointmentId: string) => {
    const response = await API.patch(
      `/appointments/${appointmentId}/complete`
    );

    return response.data;
  };
  /* -------------------------------------------------------------------------- */
/*                       Get Booked Slots                                     */
/* -------------------------------------------------------------------------- */

export const getBookedSlots = async (
  barberId: string,
  date: string
) => {
  const response = await API.get(
    `/appointments/booked-slots/${barberId}`,
    {
      params: {
        date,
      },
    }
  );

  return response.data;
};

export const getAvailableSlots = async (
  barberId: string,
  date: string,
  services: string[]
) => {
  const response = await API.get("/appointments/available-slots", {
    params: {
      barberId,
      date,
      services: services.join(","),
    },
  });

  return response.data;
};