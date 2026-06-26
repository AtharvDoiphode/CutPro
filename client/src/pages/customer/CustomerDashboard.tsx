import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LayoutDashboard,
  CalendarDays,
  History,
  User,
  LogOut,
  Plus,
} from "lucide-react";

import { useAuth } from "../../hooks/useAuth";

import {
  getDashboard,
  getUpcomingAppointments,
  getPastAppointments,
} from "../../lib/customerApi";
import { getQueueStatus } from "../../lib/queueApi";
import {
  checkInQueue,
} from "../../lib/queueApi";
import ReviewModal from "../../components/ReviewModal";

import {
  submitReview,
} from "../../lib/reviewApi";

const CustomerDashboard = () => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] =
    useState("dashboard");


type Service = {
  _id: string;
  name: string;
  price: number;
  duration: number;
};

type Barber = {
  _id: string;
  name: string;
};

type Appointment = {
  _id: string;
  appointmentDate: string;
  startTime: string;
  barber: Barber;
  services: Service[];
};

type DashboardStats = {
  stats: {
    totalAppointments: number;
    pendingAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
  };
};
type QueueStatus = {
  queueNumber: number;
  currentServing: number | null;
  position: number;
  estimatedWait: number;
  status: string;
};

const [dashboardData, setDashboardData] =
  useState<DashboardStats | null>(null);

const [upcomingAppointments, setUpcomingAppointments] =
  useState<Appointment[]>([]);

const [pastAppointments, setPastAppointments] =
  useState<Appointment[]>([]);

  const [queueStatus, setQueueStatus] =
  useState<QueueStatus | null>(null);

  const [checkedInAppointmentId, setCheckedInAppointmentId] =
  useState<string | null>(null);
  const [reviewModalOpen, setReviewModalOpen] =
  useState(false);

const [selectedAppointmentId, setSelectedAppointmentId] =
  useState<string | null>(null);

const [reviewedAppointments, setReviewedAppointments] =
  useState<string[]>([]);


const loadQueueStatus = async (
  appointmentId: string
) => {
  try {
    const response =
      await getQueueStatus(
        appointmentId
      );

    setQueueStatus(
      response.data
    );
  } catch (error) {
    console.error(error);
  }
};

useEffect(() => {
  const loadData = async () => {
    try {
      const dashboard =
        await getDashboard();

      const upcoming =
        await getUpcomingAppointments();

      const history =
        await getPastAppointments();

      setDashboardData(
        dashboard.data
      );

      setUpcomingAppointments(
        upcoming.data || []
      );

      setPastAppointments(
        history.data || []
      );

      if (
        upcoming.data &&
        upcoming.data.length > 0
      ) {
        await loadQueueStatus(
          upcoming.data[0]._id
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  loadData();

  const interval =
    setInterval(() => {
      loadData();
    }, 10000);

  return () =>
    clearInterval(interval);

}, []);
const handleCheckIn = async (
  appointmentId: string
) => {
  try {
    await checkInQueue(appointmentId);

setCheckedInAppointmentId(
  appointmentId
);

await loadQueueStatus(
  appointmentId
);

alert(
  "Checked In Successfully"
);

    window.location.reload(); 
  } catch (error) {
  console.error(error);

  if (axios.isAxiosError(error)) {
    alert(
      error.response?.data?.message ||
      "Check In Failed"
    );
  } else {
    alert("Check In Failed");
  }
}
};
const handleReviewSubmit = async (
  rating: number,
  comment: string
) => {
  if (!selectedAppointmentId) return;

  try {
    await submitReview(
      selectedAppointmentId,
      rating,
      comment
    );

    alert(
      "Review submitted successfully!"
    );

    setReviewedAppointments(
      (prev) => [
        ...prev,
        selectedAppointmentId,
      ]
    );

    setReviewModalOpen(false);

  } catch (error) {
    console.error(error);

    alert(
      "Failed to submit review."
    );
  }
};
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <section className="min-h-screen bg-[#070707]">
      <div className="flex min-h-screen">

        {/* Sidebar */}

        <aside className="w-72 border-r border-[#1f1f1f] bg-[#0d0d0d] p-6">
          <h1 className="mb-10 text-3xl font-bold text-[#D4AF37]">
            CUTPRO
          </h1>

          <div className="space-y-3">

            <button
              onClick={() =>
                setActiveTab("dashboard")
              }
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 ${
                activeTab === "dashboard"
                  ? "bg-[#D4AF37] text-black"
                  : "text-white hover:bg-[#171717]"
              }`}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </button>

            <button
              onClick={() =>
                setActiveTab("appointments")
              }
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 ${
                activeTab === "appointments"
                  ? "bg-[#D4AF37] text-black"
                  : "text-white hover:bg-[#171717]"
              }`}
            >
              <CalendarDays size={18} />
              My Appointments
            </button>

            <button
              onClick={() =>
                setActiveTab("history")
              }
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 ${
                activeTab === "history"
                  ? "bg-[#D4AF37] text-black"
                  : "text-white hover:bg-[#171717]"
              }`}
            >
              <History size={18} />
              Booking History
            </button>

            <button
              onClick={() =>
                setActiveTab("profile")
              }
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 ${
                activeTab === "profile"
                  ? "bg-[#D4AF37] text-black"
                  : "text-white hover:bg-[#171717]"
              }`}
            >
              <User size={18} />
              Profile
            </button>
          </div>

          <button
            onClick={() =>
              navigate("/booking")
            }
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-3 font-semibold text-black"
          >
            <Plus size={18} />
            Book Appointment
          </button>

          <button
            onClick={handleLogout}
            className="mt-4 flex w-full items-center gap-3 rounded-xl bg-red-500 px-4 py-3 text-white hover:bg-red-600"
          >
            <LogOut size={18} />
            Logout
          </button>
        </aside>

        {/* Main Content */}

        <main className="flex-1 p-10">

          {/* Dashboard */}

          {activeTab === "dashboard" && (
            <>
              <h1 className="text-4xl font-bold text-white">
                Welcome, {user?.name}
              </h1>

              <p className="mt-2 text-zinc-400">
                Manage your appointments and profile.
              </p>

              <div className="mt-10 grid gap-6 md:grid-cols-4">

                <div className="rounded-3xl bg-[#111] p-6">
                  <h3 className="text-zinc-400">
                    Total Appointments
                  </h3>

                  <p className="mt-3 text-4xl font-bold text-[#D4AF37]">
                    {dashboardData?.stats?.totalAppointments || 0}
                  </p>
                </div>

                <div className="rounded-3xl bg-[#111] p-6">
                  <h3 className="text-zinc-400">
                    Upcoming
                  </h3>

                  <p className="mt-3 text-4xl font-bold text-[#D4AF37]">
                    {dashboardData?.stats?.pendingAppointments || 0}
                  </p>
                </div>

                <div className="rounded-3xl bg-[#111] p-6">
                  <h3 className="text-zinc-400">
                    Completed
                  </h3>

                  <p className="mt-3 text-4xl font-bold text-[#D4AF37]">
                    {dashboardData?.stats?.completedAppointments || 0}
                  </p>
                </div>

                <div className="rounded-3xl bg-[#111] p-6">
                  <h3 className="text-zinc-400">
                    Cancelled
                  </h3>

                  <p className="mt-3 text-4xl font-bold text-[#D4AF37]">
                    {dashboardData?.stats?.cancelledAppointments || 0}
                  </p>
                </div>

              </div>
              {queueStatus && (
  <div className="mt-10 rounded-3xl bg-[#111] p-8">

    <h2 className="mb-6 text-2xl font-bold text-white">
      My Queue Status
    </h2>

    <div className="grid gap-6 md:grid-cols-4">

      <div>
        <p className="text-zinc-400">
          Queue Number
        </p>

        <p className="text-3xl font-bold text-[#D4AF37]">
          #{queueStatus.queueNumber}
        </p>
      </div>

      <div>
  <p className="text-zinc-400">
    Currently Serving
  </p>

  <p className="text-3xl font-bold text-[#D4AF37]">
    {queueStatus.currentServing ??
      "None"}
  </p>
</div>

      <div>
        <p className="text-zinc-400">
          Estimated Wait
        </p>

        <p className="text-3xl font-bold text-[#D4AF37]">
          {queueStatus.estimatedWait}
          min
        </p>
      </div>

      <div>
        <p className="text-zinc-400">
          Status
        </p>

        <p
  className={`text-3xl font-bold ${
    queueStatus.status ===
    "serving"
      ? "text-green-400"
      : queueStatus.status ===
        "waiting"
      ? "text-yellow-400"
      : "text-red-400"
  }`}
>
  {queueStatus.status}
</p>
      </div>

    </div>
  </div>
)}
            </>
          )}

          {/* Upcoming Appointments */}

          {activeTab === "appointments" && (
            <>
              <h1 className="text-4xl font-bold text-white">
                Upcoming Appointments
              </h1>

              <div className="mt-8 space-y-4">

                {upcomingAppointments.length === 0 ? (
                  <div className="rounded-3xl bg-[#111] p-6 text-white">
                    No upcoming appointments
                  </div>
                ) : (
                  upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment._id}
                      className="rounded-3xl bg-[#111] p-6"
                    >
                      <h3 className="text-white">
                        {appointment.services?.map((s) => s.name)
                          .join(", ")}
                      </h3>

                      <p className="mt-2 text-zinc-400">
                        {new Date(
                          appointment.appointmentDate
                        ).toLocaleDateString()}
                      </p>

                      <p className="text-zinc-400">
                        {appointment.startTime}
                      </p>

                      <p className="text-[#D4AF37]">
                        Barber:
                        {" "}
                        {appointment.barber?.name}
                      </p>
                     {queueStatus ||
checkedInAppointmentId ===
  appointment._id ? (
  <button
    disabled
    className="mt-4 rounded-xl bg-green-600 px-5 py-2 font-semibold text-white"
  >
    Checked In ✓
  </button>
) : (
  <button
    onClick={() =>
      handleCheckIn(
        appointment._id
      )
    }
    className="mt-4 rounded-xl bg-[#D4AF37] px-5 py-2 font-semibold text-black"
  >
    Check In
  </button>
)}
                    </div>
                  ))
                )}

              </div>
            </>
          )}

          {/* History */}

          {activeTab === "history" && (
            <>
              <h1 className="text-4xl font-bold text-white">
                Booking History
              </h1>

              <div className="mt-8 space-y-4">

                {pastAppointments.length === 0 ? (
                  <div className="rounded-3xl bg-[#111] p-6 text-white">
                    No completed appointments
                  </div>
                ) : (
                  pastAppointments.map((appointment) => (
                    <div
                      key={appointment._id}
                      className="rounded-3xl bg-[#111] p-6"
                    >
                      <h3 className="text-white">
                        {appointment.services?.map((s) => s.name)
                          .join(", ")}
                      </h3>

                      <p className="text-zinc-400">
                        {new Date(
                          appointment.appointmentDate
                        ).toLocaleDateString()}
                      </p>

                      <p className="text-green-400">
  Completed
</p>

{reviewedAppointments.includes(
  appointment._id
) ? (
  <button
    disabled
    className="mt-4 rounded-xl bg-green-600 px-5 py-2 font-semibold text-white"
  >
    Reviewed ✓
  </button>
) : (
  <button
    onClick={() => {
      setSelectedAppointmentId(
        appointment._id
      );
      setReviewModalOpen(true);
    }}
    className="mt-4 rounded-xl bg-[#D4AF37] px-5 py-2 font-semibold text-black"
  >
    ⭐ Rate Experience
  </button>
)}
                    </div>
                  ))
                )}

              </div>
            </>
          )}

          {/* Profile */}

          {activeTab === "profile" && (
            <>
              <h1 className="text-4xl font-bold text-white">
                My Profile
              </h1>

              <div className="mt-8 rounded-3xl bg-[#111] p-8">
                <h2 className="text-2xl font-bold text-white">
                  {user?.name}
                </h2>

                <p className="mt-2 text-zinc-400">
                  {user?.email}
                </p>

                <p className="mt-2 text-zinc-400">
                  {user?.phone}
                </p>

                <p className="mt-4 text-[#D4AF37]">
                  Customer Account
                </p>
              </div>
            </>
          )}
          <ReviewModal
  isOpen={reviewModalOpen}
  onClose={() =>
    setReviewModalOpen(false)
  }
  onSubmit={
    handleReviewSubmit
  }
/>

        </main>
      </div>
    </section>
  );
};

export default CustomerDashboard;