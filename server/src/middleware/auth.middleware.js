import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
  // Get token from cookie or Authorization header
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  // Verify JWT
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  // Find user
  const user = await User.findById(decodedToken.id).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(401, "Invalid Access Token");
  }

  // Attach user to request
  req.user = user;

  next();
});

export default verifyJWT;