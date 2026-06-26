import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import logo from "../../assests/logo.png";
import { useAuth } from "../../hooks/useAuth";

const Navbar = () => {
  const [scrolled, setScrolled] =
    useState(false);

  const { user, logout } =
    useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(
        window.scrollY > 30
      );
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-black/70 backdrop-blur-xl shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}

        <Link to="/">
          <img
            src={logo}
            alt="CutPro"
            className="h-14 w-auto transition-transform duration-300 hover:scale-105"
          />
        </Link>

        {/* Navigation */}

       <nav className="hidden items-center gap-10 lg:flex">
  <a
    href="/"
    className="text-[15px] font-medium text-white hover:text-[#D4AF37]"
  >
    Home
  </a>

  <a
    href="#services"
    className="text-[15px] font-medium text-white hover:text-[#D4AF37]"
  >
    Services
  </a>

  <a
    href="#barbers"
    className="text-[15px] font-medium text-white hover:text-[#D4AF37]"
  >
    Barbers
  </a>

  <a
    href="#reviews"
    className="text-[15px] font-medium text-white hover:text-[#D4AF37]"
  >
    Reviews
  </a>

  <a
    href="#contact"
    className="text-[15px] font-medium text-white hover:text-[#D4AF37]"
  >
    Contact
  </a>
</nav>

        {/* Right Side */}

        <div className="flex items-center gap-3">
  {!user ? (
    <>
      <Link
        to="/login"
        className="rounded-lg border border-white/15 bg-black/20 px-6 py-3 text-white backdrop-blur-sm transition hover:border-[#D4AF37]"
      >
        Login
      </Link>

      <Link
        to="/booking"
        className="rounded-lg bg-[#D4AF37] px-7 py-3 font-semibold text-black transition hover:bg-[#f5c95d]"
      >
        Book Now
      </Link>
    </>
  ) : (
    <>
      {/* Customer Only */}

      {user.role === "customer" && (
        <Link
          to="/booking"
          className="rounded-lg bg-[#D4AF37] px-7 py-3 font-semibold text-black transition hover:bg-[#f5c95d]"
        >
          Book Now
        </Link>
      )}

      <Link
        to={
          user.role === "admin"
            ? "/admin/dashboard"
            : user.role === "barber"
            ? "/barber/dashboard"
            : "/customer/dashboard"
        }
        className="rounded-lg border border-[#D4AF37] px-6 py-3 text-[#D4AF37]"
      >
        Dashboard
      </Link>

      <button
        onClick={logout}
        className="rounded-lg bg-red-500 px-6 py-3 font-medium text-white transition hover:bg-red-600"
      >
        Logout
      </button>
    </>
  )}
</div>
      </div>
    </header>
  );
};


export default Navbar;