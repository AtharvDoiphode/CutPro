import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
} from "lucide-react";

import { motion } from "framer-motion";
import toast from "react-hot-toast";

import logo from "../../assests/logo.png";
import { loginUser } from "../../lib/authApi";

import { useAuth } from "../../hooks/useAuth";

const LoginForm = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await loginUser(
        email,
        password
      );

      login(
        data.data.user,
        data.data.accessToken
      );

      toast.success(
        "Login Successful"
      );

      const role =
  data.data.user.role;

if (role === "admin") {
  navigate("/admin/dashboard");
} else if (
  role === "barber"
) {
  navigate("/barber/dashboard");
} else {
  navigate("/");
}
    } catch (error) {
      console.error(error);

      toast.error(
        "Invalid Email or Password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 40,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
      }}
      className="w-full max-w-md rounded-3xl border border-[#222] bg-[#111111] p-8 shadow-2xl"
    >
      {/* Logo */}

      <div className="mb-6 flex justify-center">
        <img
          src={logo}
          alt="CutPro"
          className="h-14"
        />
      </div>

      {/* Heading */}

      <h1 className="text-center text-3xl font-bold text-white">
        Welcome Back
      </h1>

      <p className="mt-2 text-center text-zinc-400">
        Login to continue your
        grooming journey.
      </p>

      {/* Form */}

      <form
        onSubmit={handleLogin}
        className="mt-8"
      >
        {/* Email */}

        <div className="mb-5">
          <label className="mb-2 block text-sm text-zinc-400">
            Email
          </label>

          <div className="relative">
            <Mail
              size={18}
              className="absolute left-4 top-4 text-zinc-500"
            />

            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              className="h-12 w-full rounded-xl border border-[#2b2b2b] bg-[#191919] pl-11 pr-4 text-white outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>

        {/* Password */}

        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            Password
          </label>

          <div className="relative">
            <Lock
              size={18}
              className="absolute left-4 top-4 text-zinc-500"
            />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              required
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className="h-12 w-full rounded-xl border border-[#2b2b2b] bg-[#191919] pl-11 pr-12 text-white outline-none focus:border-[#D4AF37]"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              className="absolute right-4 top-3.5 text-zinc-500"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>

        {/* Login Button */}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 h-12 w-full rounded-xl bg-[#D4AF37] font-semibold text-black transition hover:bg-[#e8c24e] disabled:opacity-60"
        >
          {loading
            ? "Logging In..."
            : "Login"}
        </button>
      </form>

      {/* Register */}

      <p className="mt-8 text-center text-sm text-zinc-400">
        Don't have an account?

        <Link
          to="/register"
          className="ml-2 text-[#D4AF37] hover:underline"
        >
          Register
        </Link>
      </p>

      {/* Footer */}

      <p className="mt-6 text-center text-xs leading-6 text-zinc-500">
        By continuing, you agree to our
        Terms & Privacy Policy.
      </p>
    </motion.div>
  );
};

export default LoginForm;