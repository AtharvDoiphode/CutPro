import Service from "../models/Service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

/* -------------------------------------------------------------------------- */
/*                             Create Service                                 */
/* -------------------------------------------------------------------------- */

export const createService = asyncHandler(async (req, res) => {
  const { name, description, price, duration, category, image } = req.body;

  if (!name || !price || !duration) {
    throw new ApiError(400, "Name, Price and Duration are required");
  }

  const existingService = await Service.findOne({ name });

  if (existingService) {
    throw new ApiError(409, "Service already exists");
  }

  const service = await Service.create({
    name,
    description,
    price,
    duration,
    category,
    image,
  });

  return res.status(201).json(
    new ApiResponse(201, service, "Service created successfully")
  );
});

/* -------------------------------------------------------------------------- */
/*                           Get All Services                                 */
/* -------------------------------------------------------------------------- */

export const getAllServices = asyncHandler(async (req, res) => {
  const services = await Service.find().sort({
    createdAt: -1,
  });

  return res.status(200).json(
    new ApiResponse(200, services, "Services fetched successfully")
  );
});

/* -------------------------------------------------------------------------- */
/*                           Get Service By ID                                */
/* -------------------------------------------------------------------------- */

export const getServiceById = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  return res.status(200).json(
    new ApiResponse(200, service, "Service fetched successfully")
  );
});

/* -------------------------------------------------------------------------- */
/*                             Update Service                                 */
/* -------------------------------------------------------------------------- */

export const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  return res.status(200).json(
    new ApiResponse(200, service, "Service updated successfully")
  );
});

/* -------------------------------------------------------------------------- */
/*                             Delete Service                                 */
/* -------------------------------------------------------------------------- */

export const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);

  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  return res.status(200).json(
    new ApiResponse(200, {}, "Service deleted successfully")
  );
});