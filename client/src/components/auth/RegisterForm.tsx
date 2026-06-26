import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

import { motion } from "framer-motion";
import toast from "react-hot-toast";

import logo from "../../assests/logo.png";

import { registerUser } from "../../lib/authApi";

const RegisterForm = () => {
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword,
    setShowConfirmPassword] =
    useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleRegister = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      form.password !==
      form.confirmPassword
    ) {
      toast.error(
        "Passwords do not match"
      );

      return;
    }

    try {
      setLoading(true);

      await registerUser({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: form.role,
      });

      toast.success(
        "Account Created Successfully"
      );

      navigate("/login");
    } catch (error) {
      console.error(error);

      toast.error(
        "Registration Failed"
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
        Create Account
      </h1>

      <p className="mt-2 text-center text-zinc-400">
        Join CutPro today.
      </p>

      {/* Form */}

      <form
        onSubmit={handleRegister}
        className="mt-8 space-y-5"
      >
        {/* Name */}

        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            Full Name
          </label>

          <div className="relative">
            <User
              size={18}
              className="absolute left-4 top-4 text-zinc-500"
            />

            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="h-12 w-full rounded-xl border border-[#2b2b2b] bg-[#191919] pl-11 pr-4 text-white outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>

        {/* Phone */}

        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            Phone
          </label>

          <div className="relative">
            <Phone
              size={18}
              className="absolute left-4 top-4 text-zinc-500"
            />

            <input
              type="text"
              name="phone"
              required
              value={form.phone}
              onChange={handleChange}
              placeholder="9876543210"
              className="h-12 w-full rounded-xl border border-[#2b2b2b] bg-[#191919] pl-11 pr-4 text-white outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>

        {/* Email */}

        <div>
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
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="name@example.com"
              className="h-12 w-full rounded-xl border border-[#2b2b2b] bg-[#191919] pl-11 pr-4 text-white outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>

        {/* Role */}

        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            Register As
          </label>

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="h-12 w-full rounded-xl border border-[#2b2b2b] bg-[#191919] px-4 text-white outline-none focus:border-[#D4AF37]"
          >
            <option value="customer">
              Customer
            </option>

            <option value="barber">
              Barber
            </option>

            <option value="admin">
              Admin
            </option>
          </select>
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
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
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

        {/* Confirm Password */}

        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            Confirm Password
          </label>

          <div className="relative">
            <Lock
              size={18}
              className="absolute left-4 top-4 text-zinc-500"
            />

            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              name="confirmPassword"
              required
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="h-12 w-full rounded-xl border border-[#2b2b2b] bg-[#191919] pl-11 pr-12 text-white outline-none focus:border-[#D4AF37]"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
              className="absolute right-4 top-3.5 text-zinc-500"
            >
              {showConfirmPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>

        {/* Submit */}

        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-xl bg-[#D4AF37] font-semibold text-black transition hover:bg-[#e8c24e]"
        >
          {loading
            ? "Creating Account..."
            : "Create Account"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-zinc-400">
        Already have an account?

        <Link
          to="/login"
          className="ml-2 text-[#D4AF37] hover:underline"
        >
          Login
        </Link>
      </p>
    </motion.div>
  );
};

export default RegisterForm;