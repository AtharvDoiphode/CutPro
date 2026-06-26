import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import HomePage from "../pages/Home/HomePage";
import BookingPage from "../pages/Booking/BookingPage";

import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";

import CustomerDashboard from "../pages/customer/CustomerDashboard";
import BarberDashboard from "../pages/barber/BarberDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import LiveQueuePage from "../pages/LiveQueuePage";

import ProtectedRoute from "./ProtectedRoute";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC WEBSITE */}

        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={<HomePage />}
          />
          <Route
  path="/queue"
  element={<LiveQueuePage />}
/>

          <Route
            path="/booking"
            element={<BookingPage />}
          />
        </Route>

        {/* AUTH */}

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        {/* CUSTOMER */}

        <Route
          path="/customer/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["customer"]}
            >
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />

        {/* BARBER */}

        <Route
          path="/barber/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["barber"]}
            >
              <BarberDashboard />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["admin"]}
            >
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* UNKNOWN ROUTE */}

        <Route
          path="*"
          element={<Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
}