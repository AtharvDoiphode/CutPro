import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

/* -------------------------------------------------------------------------- */
/*                   Generate Access & Refresh Tokens Helper                   */
/* -------------------------------------------------------------------------- */

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh tokens"
    );
  }
};

/* -------------------------------------------------------------------------- */
/*                               Register User                                */
/* -------------------------------------------------------------------------- */

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  if (!name || !email || !phone || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { phone }],
  });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const user = await User.create({
    name,
    email,
    phone,
    password,
    role,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res.status(201).json(
    new ApiResponse(
      201,
      createdUser,
      "User registered successfully"
    )
  );
});

/* -------------------------------------------------------------------------- */
/*                                 Login User                                 */
/* -------------------------------------------------------------------------- */

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and Password are required");
  }

  // Find user
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  // Verify password
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid Credentials");
  }

  // Generate Tokens
  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(user._id);

  // Get user without sensitive fields
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: false, // true in production (HTTPS)
    sameSite: "lax",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      ...options,
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      ...options,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "Login successful"
      )
    );
});

/* -------------------------------------------------------------------------- */
/*                              Get Current User                              */
/* -------------------------------------------------------------------------- */

export const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      req.user,
      "Current user fetched successfully"
    )
  );
});

/* -------------------------------------------------------------------------- */
/*                                 Logout User                                */
/* -------------------------------------------------------------------------- */

export const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
      new ApiResponse(
        200,
        {},
        "User logged out successfully"
      )
    );
});

/* -------------------------------------------------------------------------- */
/*                           Refresh Access Token                             */
/* -------------------------------------------------------------------------- */

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  // Verify Refresh Token
  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.JWT_REFRESH_SECRET
  );

  // Find User
  const user = await User.findById(decodedToken.id);

  if (!user) {
    throw new ApiError(401, "Invalid Refresh Token");
  }

  // Check Refresh Token
  if (incomingRefreshToken !== user.refreshToken) {
    throw new ApiError(
      401,
      "Refresh Token is expired or invalid"
    );
  }

  // Generate New Tokens
  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(user._id);

  const options = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      ...options,
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      ...options,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json(
      new ApiResponse(
        200,
        {
          accessToken,
          refreshToken,
        },
        "Access token refreshed successfully"
      )
    );
});