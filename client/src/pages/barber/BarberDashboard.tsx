import { useEffect, useState,useCallback } from "react";
import { useNavigate } from "react-router-dom";

import {
  CalendarDays,
  CheckCircle,
  User,
  LogOut,
  Scissors,
   Clock3,
  
} from "lucide-react";

import { useAuth } from "../../hooks/useAuth";

import {
  getBarberDashboard,
  getTodayAppointments,
  getCompletedAppointments,
  getBarberProfile,
  updateServiceStatus,
  updatePaymentStatus,
} from "../../lib/barberDashboardApi";
import {
  getLiveQueue,
  getQueueAnalytics,
  nextCustomer,
} from "../../lib/barberQueueApi";
import AvailabilityTab from "../../components/barber/AvailabilityTab";

interface DashboardStats {
  todayAppointments: number;
  completedToday: number;
  todayRevenue: number;
  monthlyAppointments: number;
  monthlyCompleted: number;
}

interface Appointment {
  _id: string;

  startTime: string;

  serviceStatus: string;

  paymentStatus: string;

  customer: {
    name: string;
  };

  services: {
    name: string;
  }[];
}
interface QueueItem {
  _id: string;

  queueNumber: number;

  status: string;

  customer: {
    name: string;
  };
}

interface QueueStats {
  servedToday: number;
  waitingNow: number;
  averageServiceTime: number;
  longestQueue: number;
}

interface BarberProfile {
  name: string;
  email: string;
  phone: string;
  experience: number;
  rating: number;
  isAvailable: boolean;
}
const BarberDashboard = () => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();
const [stats, setStats] =
  useState<DashboardStats>({
    todayAppointments: 0,
    completedToday: 0,
    todayRevenue: 0,
    monthlyAppointments: 0,
    monthlyCompleted: 0,
  });

const [
  todayAppointments,
  setTodayAppointments,
] = useState<Appointment[]>([]);

const [
  completedAppointments,
  setCompletedAppointments,
] = useState<Appointment[]>([]);

const [profile, setProfile] =
  useState<BarberProfile | null>(
    null
  );
  const [queueData, setQueueData] =
  useState<QueueItem[]>([]);

const [queueStats, setQueueStats] =
  useState<QueueStats>({
    servedToday: 0,
    waitingNow: 0,
    averageServiceTime: 0,
    longestQueue: 0,
  });

  const [activeTab, setActiveTab] =
    useState("dashboard");
  
const loadQueue = useCallback(async () => {
  try {
    if (!user) return;

    const queueResponse =
      await getLiveQueue(user._id);

    const analyticsResponse =
      await getQueueAnalytics(user._id);

    setQueueData(queueResponse.data || []);
    setQueueStats(analyticsResponse.data);
  } catch (error) {
    console.error(error);
  }
}, [user]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const handleServiceStatusChange =
  async (
    appointmentId: string,
    serviceStatus: string
  ) => {
    try {
      await updateServiceStatus(
        appointmentId,
        serviceStatus
      );

      setTodayAppointments((prev) =>
        prev.map((appointment) =>
          appointment._id === appointmentId
            ? {
                ...appointment,
                serviceStatus,
              }
            : appointment
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

const handlePaymentStatusChange =
  async (
    appointmentId: string,
    paymentStatus: string
  ) => {
    try {
      await updatePaymentStatus(
        appointmentId,
        paymentStatus
      );

      setTodayAppointments((prev) =>
        prev.map((appointment) =>
          appointment._id === appointmentId
            ? {
                ...appointment,
                paymentStatus,
              }
            : appointment
        )
      );
    } catch (error) {
      console.error(error);
    }
  };
useEffect(() => {
  const loadData = async () => {
    try {
      const dashboard =
        await getBarberDashboard();

      const today =
        await getTodayAppointments();

      const completed =
        await getCompletedAppointments();

      const barberProfile =
        await getBarberProfile();

      setStats(
        dashboard.data.stats
      );

      setTodayAppointments(
        today.data || []
      );

      setCompletedAppointments(
        completed.data || []
      );

      setProfile(
        barberProfile.data
      );

      await loadQueue();
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

}, [loadQueue]);

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
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left ${
                activeTab === "dashboard"
                  ? "bg-[#D4AF37] text-black"
                  : "text-white hover:bg-[#171717]"
              }`}
            >
              <Scissors size={18} />
              Dashboard
            </button>

            <button
              onClick={() =>
                setActiveTab("today")
              }
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left ${
                activeTab === "today"
                  ? "bg-[#D4AF37] text-black"
                  : "text-white hover:bg-[#171717]"
              }`}
            >
              <CalendarDays size={18} />
              Today's Appointments
            </button>

            <button
              onClick={() =>
                setActiveTab("completed")
              }
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left ${
                activeTab === "completed"
                  ? "bg-[#D4AF37] text-black"
                  : "text-white hover:bg-[#171717]"
              }`}
            >
              <CheckCircle size={18} />
              Completed Appointments
            </button>

            <button
              onClick={() =>
                setActiveTab("profile")
              }
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left ${
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
    setActiveTab("queue")
  }
  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left ${
    activeTab === "queue"
      ? "bg-[#D4AF37] text-black"
      : "text-white hover:bg-[#171717]"
  }`}
>
  <Clock3 size={18} />
  Live Queue
</button>
<button
  onClick={() =>
    setActiveTab("availability")
  }
  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 ${
    activeTab === "availability"
      ? "bg-[#D4AF37] text-black"
      : "text-white hover:bg-[#171717]"
  }`}
>
  Availability
</button>

          <button
            onClick={handleLogout}
            
            className="mt-10 flex w-full items-center gap-3 rounded-xl bg-red-500 px-4 py-3 text-white hover:bg-red-600"
          >
            <LogOut size={18} />
            Logout
            
          </button>
          
          
        </aside>
        

        {/* Content */}

        <main className="flex-1 p-10">

          {/* Dashboard */}

          {activeTab === "dashboard" && (
            <>
              <h1 className="text-4xl font-bold text-white">
                Welcome,
                {" "}
                {user?.name}
              </h1>

              <p className="mt-2 text-zinc-400">
                Manage your appointments and profile.
              </p>

<div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-5">

  <div className="rounded-3xl bg-[#111] p-6">
    <h3 className="text-zinc-400">
      Today's Appointments
    </h3>

    <p className="mt-2 text-4xl font-bold text-[#D4AF37]">
      {stats.todayAppointments}
    </p>
  </div>

  <div className="rounded-3xl bg-[#111] p-6">
    <h3 className="text-zinc-400">
      Completed Today
    </h3>

    <p className="mt-2 text-4xl font-bold text-[#D4AF37]">
      {stats.completedToday}
    </p>
  </div>

  <div className="rounded-3xl bg-[#111] p-6">
    <h3 className="text-zinc-400">
      Revenue Today
    </h3>

    <p className="mt-2 text-4xl font-bold text-[#D4AF37]">
      ₹{stats.todayRevenue}
    </p>
  </div>

  <div className="rounded-3xl bg-[#111] p-6">
    <h3 className="text-zinc-400">
      Appointments This Month
    </h3>

    <p className="mt-2 text-4xl font-bold text-[#D4AF37]">
      {stats.monthlyAppointments}
    </p>
  </div>

  <div className="rounded-3xl bg-[#111] p-6">
    <h3 className="text-zinc-400">
      Completed This Month
    </h3>

    <p className="mt-2 text-4xl font-bold text-[#D4AF37]">
      {stats.monthlyCompleted}
    </p>
  </div>

</div>
            </>
          )}

          {/* Today's Appointments */}

{/* Today's Appointments */}

{activeTab === "today" && (
  <>
    <h1 className="text-4xl font-bold text-white">
      Today's Appointments
    </h1>

    <div className="mt-8 space-y-4">

      {todayAppointments.length === 0 ? (
        <div className="rounded-2xl bg-[#111] p-5 text-zinc-400">
          No appointments scheduled for today.
        </div>
      ) : (
        todayAppointments.map((appointment) => (
          <div
            key={appointment._id}
            className="rounded-2xl bg-[#111] p-5"
          >
            <h3 className="text-lg font-semibold text-white">
              {appointment.customer?.name}
            </h3>

            <p className="mt-2 text-zinc-400">
              {appointment.services
                ?.map((service) => service.name)
                .join(", ")}
            </p>

            <p className="mt-2 text-[#D4AF37]">
              {appointment.startTime}
            </p>

            <div className="mt-4 grid gap-4 md:grid-cols-2">

              {/* Service Status */}

              <div>
                <label className="mb-1 block text-sm text-zinc-400">
                  Service Status
                </label>

                <select
                  value={appointment.serviceStatus}
                  onChange={(e) =>
                    handleServiceStatusChange(
                      appointment._id,
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg bg-[#1a1a1a] p-3 text-white"
                >
                  <option value="waiting">
                    Waiting
                  </option>

                  <option value="in_progress">
                    In Progress
                  </option>

                  <option value="completed">
                    Completed
                  </option>

                  <option value="cancelled">
                    Cancelled
                  </option>

                  <option value="no_show">
                    No Show
                  </option>
                </select>
              </div>

              {/* Payment Status */}

              <div>
                <label className="mb-1 block text-sm text-zinc-400">
                  Payment Status
                </label>

                <select
                  value={appointment.paymentStatus}
                  onChange={(e) =>
                    handlePaymentStatusChange(
                      appointment._id,
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg bg-[#1a1a1a] p-3 text-white"
                >
                  <option value="unpaid">
                    Unpaid
                  </option>

                  <option value="paid">
                    Paid
                  </option>

                  <option value="refunded">
                    Refunded
                  </option>
                </select>
              </div>

            </div>
          </div>
        ))
      )}

    </div>
  </>
)}

          {/* Completed */}

{/* Completed Appointments */}

{activeTab === "completed" && (
  <>
    <h1 className="text-4xl font-bold text-white">
      Completed Appointments
    </h1>

    <div className="mt-8 space-y-4">
      {completedAppointments.map(
        (appointment) => (
          <div
            key={appointment._id}
            className="rounded-2xl bg-[#111] p-5"
          >
            <h3 className="text-white">
              {appointment.customer?.name}
            </h3>

            <p className="text-green-400">
              Completed
            </p>
          </div>
        )
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
                  {profile?.name}
                </h2>

                <p className="mt-2 text-zinc-400">
                 {profile?.email}
                </p>
                <p className="mt-2 text-zinc-400">
  {profile?.phone}
</p>

<p className="mt-4 text-[#D4AF37]">
  Experience:
  {" "}
  {profile?.experience}
  {" "}
  Years
</p>

<p className="mt-2 text-zinc-300">
  Rating:
  {" "}
  {profile?.rating}
</p>

                <p className="mt-4 text-[#D4AF37]">
                  Barber Account
                </p>
              </div>
            </>
          )}
          {activeTab === "availability" && <AvailabilityTab />}
          {activeTab === "queue" && (
  <>
    <div className="flex items-center justify-between">
      <h1 className="text-4xl font-bold text-white">
        Live Queue
      </h1>

      <button
        onClick={async () => {
          await nextCustomer(
            user?._id || ""
          );

          await loadQueue();
        }}
        className="rounded-xl bg-[#D4AF37] px-5 py-3 font-semibold text-black"
      >
        Next Customer
      </button>
    </div>

    <div className="mt-8 grid gap-6 md:grid-cols-4">
      <div className="rounded-2xl bg-[#111] p-5">
        <p className="text-zinc-400">
          Waiting
        </p>

        <h2 className="mt-2 text-4xl font-bold text-[#D4AF37]">
          {queueStats.waitingNow}
        </h2>
      </div>

      <div className="rounded-2xl bg-[#111] p-5">
        <p className="text-zinc-400">
          Served Today
        </p>

        <h2 className="mt-2 text-4xl font-bold text-[#D4AF37]">
          {queueStats.servedToday}
        </h2>
      </div>

      <div className="rounded-2xl bg-[#111] p-5">
        <p className="text-zinc-400">
          Avg Service Time
        </p>

        <h2 className="mt-2 text-4xl font-bold text-[#D4AF37]">
          {queueStats.averageServiceTime}
          min
        </h2>
      </div>

      <div className="rounded-2xl bg-[#111] p-5">
        <p className="text-zinc-400">
          Longest Queue
        </p>

        <h2 className="mt-2 text-4xl font-bold text-[#D4AF37]">
          {queueStats.longestQueue}
        </h2>
      </div>
    </div>

    <div className="mt-8 space-y-4">
      {queueData.map((item) => (
        <div
          key={item._id}
          className="rounded-2xl bg-[#111] p-5"
        >
          <h3 className="text-white">
            {item.customer?.name}
          </h3>

          <p className="text-zinc-400">
            Queue #{item.queueNumber}
          </p>

          <p className="text-[#D4AF37]">
            {item.status}
          </p>
        </div>
      ))}
      
    </div>
  </>
)}

        </main>
      </div>
    </section>
  );
};

export default BarberDashboard;