import ApiError from "../utils/ApiError.js";

const verifyBarber = (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  if (req.user.role !== "barber") {
    throw new ApiError(
      403,
      "Access denied. Barber only."
    );
  }

  next();
};

export default verifyBarber;