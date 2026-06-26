import API from "./authApi";

/* -------------------------------------------------------------------------- */
/*                         Get Availability                                   */
/* -------------------------------------------------------------------------- */

export const getAvailability = async () => {
  const response = await API.get("/availability");
  return response.data;
};

/* -------------------------------------------------------------------------- */
/*                  Get Barber Availability (Public)                          */
/* -------------------------------------------------------------------------- */

export const getBarberAvailability = async (
  barberId: string
) => {
  const response = await API.get(
    `/availability/${barberId}`
  );

  return response.data;
};

/* -------------------------------------------------------------------------- */
/*                     Update Working Days                                    */
/* -------------------------------------------------------------------------- */

export const updateWorkingDays = async (
  workingDays: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  }
) => {
  const response = await API.patch(
    "/availability/working-days",
    {
      workingDays,
    }
  );

  return response.data;
};

/* -------------------------------------------------------------------------- */
/*                    Update Working Hours                                    */
/* -------------------------------------------------------------------------- */

export const updateWorkingHours = async (
  startTime: string,
  endTime: string,
  slotDuration: number
) => {
  const response = await API.patch(
    "/availability/working-hours",
    {
      startTime,
      endTime,
      slotDuration,
    }
  );

  return response.data;
};

/* -------------------------------------------------------------------------- */
/*                           Add Leave                                        */
/* -------------------------------------------------------------------------- */

export const addLeave = async (
  date: string,
  reason: string
) => {
  const response = await API.post(
    "/availability/leave",
    {
      date,
      reason,
    }
  );

  return response.data;
};

/* -------------------------------------------------------------------------- */
/*                        Remove Leave                                        */
/* -------------------------------------------------------------------------- */

export const removeLeave = async (
  leaveId: string
) => {
  const response = await API.delete(
    `/availability/leave/${leaveId}`
  );

  return response.data;
};

/* -------------------------------------------------------------------------- */
/*                     Add Blocked Slot                                       */
/* -------------------------------------------------------------------------- */

export const addBlockedSlot = async (
  date: string,
  startTime: string,
  endTime: string,
  reason: string
) => {
  const response = await API.post(
    "/availability/blocked-slot",
    {
      date,
      startTime,
      endTime,
      reason,
    }
  );

  return response.data;
};

/* -------------------------------------------------------------------------- */
/*                  Remove Blocked Slot                                       */
/* -------------------------------------------------------------------------- */

export const removeBlockedSlot = async (
  slotId: string
) => {
  const response = await API.delete(
    `/availability/blocked-slot/${slotId}`
  );

  return response.data;
};