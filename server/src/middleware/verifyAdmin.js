import ApiError from "../utils/ApiError.js";

const verifyAdmin = (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  if (req.user.role !== "admin") {
    throw new ApiError(
      403,
      "Access denied. Admin only."
    );
  }

  next();
};

export default verifyAdmin;