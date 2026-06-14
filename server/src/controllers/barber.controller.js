import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

/* -------------------------------------------------------------------------- */
/*                             Create Barber                                  */
/* -------------------------------------------------------------------------- */

export const createBarber = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    phone,
    password,
    experience,
    specialization,
    services,
    workingDays,
    startTime,
    endTime,
  } = req.body;

  if (!name || !email || !phone || !password) {
    throw new ApiError(400, "Required fields are missing");
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { phone }],
  });

  if (existingUser) {
    throw new ApiError(409, "Barber already exists");
  }

  const barber = await User.create({
    name,
    email,
    phone,
    password,
    role: "barber",
    experience,
    specialization,
    services,
    workingDays,
    startTime,
    endTime,
  });

  const createdBarber = await User.findById(barber._id)
    .select("-password -refreshToken")
    .populate("services");

  return res.status(201).json(
    new ApiResponse(
      201,
      createdBarber,
      "Barber created successfully"
    )
  );
});

/* -------------------------------------------------------------------------- */
/*                           Get All Barbers                                  */
/* -------------------------------------------------------------------------- */

export const getAllBarbers = asyncHandler(async (req, res) => {
  const barbers = await User.find({
    role: "barber",
    isActive: true,
  })
    .select("-password -refreshToken")
    .populate("services")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      barbers,
      "Barbers fetched successfully"
    )
  );
});

/* -------------------------------------------------------------------------- */
/*                           Get Barber By ID                                 */
/* -------------------------------------------------------------------------- */

export const getBarberById = asyncHandler(async (req, res) => {
  const barber = await User.findOne({
    _id: req.params.id,
    role: "barber",
  })
    .select("-password -refreshToken")
    .populate("services");

  if (!barber) {
    throw new ApiError(404, "Barber not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      barber,
      "Barber fetched successfully"
    )
  );
});

/* -------------------------------------------------------------------------- */
/*                             Update Barber                                  */
/* -------------------------------------------------------------------------- */

export const updateBarber = asyncHandler(async (req, res) => {
  const barber = await User.findOneAndUpdate(
    {
      _id: req.params.id,
      role: "barber",
    },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  )
    .select("-password -refreshToken")
    .populate("services");

  if (!barber) {
    throw new ApiError(404, "Barber not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      barber,
      "Barber updated successfully"
    )
  );
});

/* -------------------------------------------------------------------------- */
/*                          Toggle Availability                               */
/* -------------------------------------------------------------------------- */

export const toggleAvailability = asyncHandler(async (req, res) => {
  const barber = await User.findOne({
    _id: req.params.id,
    role: "barber",
  });

  if (!barber) {
    throw new ApiError(404, "Barber not found");
  }

  barber.isAvailable = !barber.isAvailable;

  await barber.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      barber,
      `Barber is now ${
        barber.isAvailable ? "Available" : "Unavailable"
      }`
    )
  );
});

/* -------------------------------------------------------------------------- */
/*                           Soft Delete Barber                               */
/* -------------------------------------------------------------------------- */

export const deleteBarber = asyncHandler(async (req, res) => {
  const barber = await User.findOneAndUpdate(
    {
      _id: req.params.id,
      role: "barber",
    },
    {
      isActive: false,
    },
    {
      new: true,
    }
  );

  if (!barber) {
    throw new ApiError(404, "Barber not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {},
      "Barber deactivated successfully"
    )
  );
});