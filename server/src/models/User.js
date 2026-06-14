import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
    },

    role: {
      type: String,
      enum: ["customer", "barber", "admin"],
      default: "customer",
    },

    avatar: {
      type: String,
      default: "",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    experience: {
  type: Number,
  default: 0,
},

specialization: [
  {
    type: String,
    trim: true,
  },
],

services: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
  },
],

workingDays: [
  {
    type: String,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
  },
],

startTime: {
  type: String,
  default: "09:00",
},

endTime: {
  type: String,
  default: "19:00",
},

rating: {
  type: Number,
  default: 0,
},

totalReviews: {
  type: Number,
  default: 0,
},

isAvailable: {
  type: Boolean,
  default: true,
},

isActive: {
  type: Boolean,
  default: true,
},
    refreshToken: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

/* -------------------------------------------------------------------------- */
/*                         Hash Password Before Saving                         */
/* -------------------------------------------------------------------------- */

userSchema.pre("save", async function () {
  // Don't hash again if password wasn't modified
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

/* -------------------------------------------------------------------------- */
/*                         Compare Password During Login                       */
/* -------------------------------------------------------------------------- */

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

/* -------------------------------------------------------------------------- */
/*                          Generate JWT Access Token                          */
/* -------------------------------------------------------------------------- */

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    }
  );
};

const User = mongoose.model("User", userSchema);

export default User;