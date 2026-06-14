import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      process.env.MONGODB_URI
    );

    console.log("✅ MongoDB Connected Successfully");
    console.log(
      `📂 Database Host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB Error :", error);
    process.exit(1);
  }
};

export default connectDB;