import API from "./authApi";

/* -------------------------------------------------------------------------- */
/*                            Submit Review                                   */
/* -------------------------------------------------------------------------- */

export const submitReview = async (
  appointmentId: string,
  rating: number,
  comment: string
) => {
  const response = await API.post(
    `/reviews/${appointmentId}`,
    {
      rating,
      comment,
    }
  );

  return response.data;
};

/* -------------------------------------------------------------------------- */
/*                       Get Barber Reviews                                   */
/* -------------------------------------------------------------------------- */

export const getBarberReviews = async (
  barberId: string
) => {
  const response = await API.get(
    `/reviews/barber/${barberId}`
  );

  return response.data;
};

/* -------------------------------------------------------------------------- */
/*                     Get Review Statistics                                  */
/* -------------------------------------------------------------------------- */

export const getReviewStats = async (
  barberId: string
) => {
  const response = await API.get(
    `/reviews/stats/${barberId}`
  );

  return response.data;
};