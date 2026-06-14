import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  refreshAccessToken,
} from "../controllers/auth.controller.js";

import verifyJWT from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", verifyJWT, logoutUser);

router.post("/refresh-token", refreshAccessToken);

router.get("/current-user", verifyJWT, getCurrentUser);

export default router;