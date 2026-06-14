import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

console.log("RAZORPAY_KEY_ID =", process.env.RAZORPAY_KEY_ID);
console.log(
  "RAZORPAY_KEY_SECRET =",
  process.env.RAZORPAY_KEY_SECRET
);

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });