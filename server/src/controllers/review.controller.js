import Review from "../models/Review.js";
import User from "../models/User.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

/* -------------------------------------------------------------------------- */
/*                            Submit Review                                   */
/* -------------------------------------------------------------------------- */

export const createReview = asyncHandler(async (req, res) => {
  const { barberId, name, rating, comment } = req.body;

  if (!barberId || !name || !rating || !comment) {
    throw new ApiError(400, "All fields are required");
  }

  if (rating < 1 || rating > 5) {
    throw new ApiError(
      400,
      "Rating must be between 1 and 5"
    );
  }

  if (name.trim().length < 2 || name.trim().length > 50) {
    throw new ApiError(
      400,
      "Name must be between 2 and 50 characters"
    );
  }

  if (
    comment.trim().length < 10 ||
    comment.trim().length > 500
  ) {
    throw new ApiError(
      400,
      "Comment must be between 10 and 500 characters"
    );
  }

  const barber = await User.findById(barberId);

  if (!barber || barber.role !== "barber") {
    throw new ApiError(404, "Barber not found");
  }

  const review = await Review.create({
    barber: barberId,
    name: name.trim(),
    rating,
    comment: comment.trim(),
  });

  // Recalculate barber rating
  const reviews = await Review.find({
    barber: barberId,
    isApproved: true,
  });

  const totalReviews = reviews.length;

  const averageRating =
    reviews.reduce(
      (sum, item) => sum + item.rating,
      0
    ) / totalReviews;

  barber.rating = Number(
    averageRating.toFixed(1)
  );

  barber.totalReviews = totalReviews;

  await barber.save();

  return res.status(201).json(
    new ApiResponse(
      201,
      review,
      "Review submitted successfully"
    )
  );
});
/* -------------------------------------------------------------------------- */
/*                      Get Reviews By Barber                                 */
/* -------------------------------------------------------------------------- */

export const getBarberReviews = asyncHandler(async (req, res) => {
  const { barberId } = req.params;

  const reviews = await Review.find({
    barber: barberId,
    isApproved: true,
  })
    .sort({
      createdAt: -1,
    })
    .select("-__v");

  return res.status(200).json(
    new ApiResponse(
      200,
      reviews,
      "Reviews fetched successfully"
    )
  );
});
/* -------------------------------------------------------------------------- */
/*                       Review Statistics                                    */
/* -------------------------------------------------------------------------- */

export const getReviewStats = asyncHandler(async (req, res) => {
  const { barberId } = req.params;

  const reviews = await Review.find({
    barber: barberId,
    isApproved: true,
  });

  const totalReviews = reviews.length;

  if (totalReviews === 0) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          averageRating: 0,
          totalReviews: 0,
          fiveStar: 0,
          fourStar: 0,
          threeStar: 0,
          twoStar: 0,
          oneStar: 0,
        },
        "Review statistics fetched successfully"
      )
    );
  }

  const averageRating =
    reviews.reduce((sum, item) => sum + item.rating, 0) /
    totalReviews;

  const stats = {
    averageRating: Number(averageRating.toFixed(1)),
    totalReviews,
    fiveStar: reviews.filter((r) => r.rating === 5).length,
    fourStar: reviews.filter((r) => r.rating === 4).length,
    threeStar: reviews.filter((r) => r.rating === 3).length,
    twoStar: reviews.filter((r) => r.rating === 2).length,
    oneStar: reviews.filter((r) => r.rating === 1).length,
  };

  return res.status(200).json(
    new ApiResponse(
      200,
      stats,
      "Review statistics fetched successfully"
    )
  );
});
/* -------------------------------------------------------------------------- */
/*                         Approve Review                                     */
/* -------------------------------------------------------------------------- */

export const approveReview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const review = await Review.findById(id);

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  review.isApproved = true;

  await review.save();

  // Update barber rating
  const reviews = await Review.find({
    barber: review.barber,
    isApproved: true,
  });

  const totalReviews = reviews.length;

  const averageRating =
    reviews.reduce((sum, item) => sum + item.rating, 0) /
    totalReviews;

  await User.findByIdAndUpdate(review.barber, {
    rating: Number(averageRating.toFixed(1)),
    totalReviews,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      review,
      "Review approved successfully"
    )
  );
});
