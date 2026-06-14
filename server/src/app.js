import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import barberRoutes from "./routes/barber.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import barberDashboardRoutes from "./routes/barberDashboard.routes.js";
import queueRoutes from "./routes/queue.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import errorHandler from "./middleware/error.middleware.js";

const app = express();

/* ===========================
   Middlewares
=========================== */

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(cookieParser());

/* ===========================
   Routes
=========================== */

app.get("/", (req, res) => {
  res.send("CutPro Backend Running 🚀");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/services", serviceRoutes);
app.use("/api/v1/barbers", barberRoutes);
app.use("/api/v1/appointments", appointmentRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/customer", customerRoutes);
app.use(
  "/api/v1/barber",
  barberDashboardRoutes
);
app.use("/api/v1/queue", queueRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/payments", paymentRoutes);
/* ===========================
   Global Error Handler
   (ALWAYS LAST)
=========================== */

app.use(errorHandler);

export default app;