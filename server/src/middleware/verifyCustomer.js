import ApiError from "../utils/ApiError.js";

const verifyCustomer = (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  if (req.user.role !== "customer") {
    throw new ApiError(
      403,
      "Access denied. Customer only."
    );
  }

  next();
};

export default verifyCustomer;