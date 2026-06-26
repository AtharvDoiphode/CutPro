import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  CalendarDays,
  Users,
  UserCog,
  Scissors,
  BarChart3,
  LogOut,
  MessageSquare,
  Clock3,
} from "lucide-react";
import {
  getLiveQueue,
  getQueueAnalytics,
} from "../../lib/queueApi";
import { useAuth } from "../../hooks/useAuth";
import MessagesPanel from "../../pages/admin/MessagesPanel";
import BarbersPanel from "./BarbersPanel";
import CustomersPanel from "./CustomersPanel";
import ServicesPanel from "./ServicesPanel";
import AnalyticsPanel from "./AnalyticsPanel";
import LiveQueuePanel from "./LiveQueuePanel";

import {
  getAllAppointments,
  updateAppointmentStatus,
  getDashboardOverview,
  
} from "../../lib/adminApi";

interface DashboardStats {
  totalCustomers: number;
  totalBarbers: number;
  totalAppointments: number;
  totalRevenue: number;
}

interface Service {
  _id: string;
  name: string;
}

interface Appointment {
  _id: string;
  appointmentDate: string;
  startTime: string;
  status: string;

  customer: {
    name: string;
  };

barber: {
  _id: string;
  name: string;
};

  services: Service[];
}
interface QueueStats {
  servedToday: number;
  waitingNow: number;
  averageServiceTime: number;
  longestQueue: number;
}
interface QueueItem {
  _id: string;

  queueNumber: number;

  status: string;

  customer?: {
    _id: string;
    name: string;
  };

  appointment?: {
    _id: string;
    startTime: string;
  };
}

const AdminDashboard = () => {
//  const [overview, setOverview] =
//     useState(null);

//   const [topServices, setTopServices] =
//     useState([]);

//   const [topBarbers, setTopBarbers] =
//     useState([]);
  const [unreadCount, setUnreadCount] = useState(1);
const [queueData, setQueueData] =
  useState<QueueItem[]>([]);

const [queueStats, setQueueStats] =
  useState<QueueStats>({
    servedToday: 0,
    waitingNow: 0,
    averageServiceTime: 0,
    longestQueue: 0,
  });
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] =
    useState("dashboard");

  const [appointments, setAppointments] =
    useState<Appointment[]>([]);
  const [stats, setStats] =
  useState<DashboardStats>({
    totalCustomers: 0,
    totalBarbers: 0,
    totalAppointments: 0,
    totalRevenue: 0,
  });
const loadDashboardStats = async () => {
  try {
    const response =
      await getDashboardOverview();

    setStats(response.data);
  } catch (error) {
    console.error(error);
  }
};
const loadQueueData = async (
  barberId: string
) => {
  try {
    const queueResponse =
      await getLiveQueue(barberId);

    const analyticsResponse =
      await getQueueAnalytics(barberId);

    setQueueData(
  (queueResponse.data || []) as QueueItem[]
);

    setQueueStats(
      analyticsResponse.data
    );
  } catch (error) {
    console.error(error);
  }
};
const loadAppointments = useCallback(
  async () => {
    try {
      const response =
        await getAllAppointments();

      const data =
        response.data || [];

      setAppointments(data);

      if (
        data.length > 0 &&
        data[0].barber?._id
      ) {
        loadQueueData(
          data[0].barber._id
        );
      }
    } catch (error) {
      console.error(error);
    }
  },
  []
);


useEffect(() => {
  const initialize = async () => {
    await loadDashboardStats();
    await loadAppointments();
  };

  initialize();

  const interval =
    setInterval(() => {
      initialize();
    }, 10000);

  return () =>
    clearInterval(interval);

}, [loadAppointments]);
  const handleStatusChange = async (
    appointmentId: string,
    status: string
  ) => {
    try {
      await updateAppointmentStatus(
        appointmentId,
        status
      );

      await loadAppointments();
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
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
            CUTPRO ADMIN
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
              Appointments
            </button>

            <button
              onClick={() =>
                setActiveTab("customers")
              }
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 ${
                activeTab === "customers"
                  ? "bg-[#D4AF37] text-black"
                  : "text-white hover:bg-[#171717]"
              }`}
            >
              <Users size={18} />
              Customers
            </button>

            <button
              onClick={() =>
                setActiveTab("barbers")
              }
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 ${
                activeTab === "barbers"
                  ? "bg-[#D4AF37] text-black"
                  : "text-white hover:bg-[#171717]"
              }`}
            >
              <UserCog size={18} />
              Barbers
            </button>

            <button
              onClick={() =>
                setActiveTab("services")
              }
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 ${
                activeTab === "services"
                  ? "bg-[#D4AF37] text-black"
                  : "text-white hover:bg-[#171717]"
              }`}
            >
              <Scissors size={18} />
              Services
            </button>

            <button
              onClick={() =>
                setActiveTab("analytics")
              }
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 ${
                activeTab === "analytics"
                  ? "bg-[#D4AF37] text-black"
                  : "text-white hover:bg-[#171717]"
              }`}
            >
              <BarChart3 size={18} />
              Analytics
            </button>
            <button
  onClick={() =>
    setActiveTab("queue")
  }
  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 ${
    activeTab === "queue"
      ? "bg-[#D4AF37] text-black"
      : "text-white hover:bg-[#171717]"
  }`}
>
  <Clock3 size={18} />
  Live Queue
</button>
            
            <button
  onClick={() => {
    setActiveTab("messages");
    setUnreadCount(0);
  }}
  
  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 ${
    activeTab === "messages"
      ? "bg-[#D4AF37] text-black"
      : "text-white hover:bg-[#171717]"
  }`}
>
  <MessageSquare size={18} />
  Messages

  {unreadCount > 0 && (
    <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white">
      {unreadCount}
    </span>
  )}
</button>

          </div>

          <button
            onClick={handleLogout}
            className="mt-10 flex w-full items-center gap-3 rounded-xl bg-red-500 px-4 py-3 text-white hover:bg-red-600"
          >
            <LogOut size={18} />
            Logout
          </button>
        </aside>

        {/* Main */}

        <main className="flex-1 p-10">

          {/* Dashboard */}

          {activeTab === "dashboard" && (
  <>
    <h1 className="text-4xl font-bold text-white">
      Welcome, {user?.name}
    </h1>

    <div className="mt-10 grid gap-6 md:grid-cols-4">

      <div className="rounded-3xl bg-[#111] p-6">
        <h3 className="text-zinc-400">
          Total Customers
        </h3>

        <p className="mt-3 text-4xl font-bold text-[#D4AF37]">
          {stats.totalCustomers}
        </p>
      </div>

      <div className="rounded-3xl bg-[#111] p-6">
        <h3 className="text-zinc-400">
          Total Barbers
        </h3>

        <p className="mt-3 text-4xl font-bold text-[#D4AF37]">
          {stats.totalBarbers}
        </p>
      </div>

      <div className="rounded-3xl bg-[#111] p-6">
        <h3 className="text-zinc-400">
          Total Appointments
        </h3>

        <p className="mt-3 text-4xl font-bold text-[#D4AF37]">
          {stats.totalAppointments}
        </p>
      </div>

      <div className="rounded-3xl bg-[#111] p-6">
        <h3 className="text-zinc-400">
          Revenue
        </h3>

        <p className="mt-3 text-4xl font-bold text-[#D4AF37]">
          ₹{stats.totalRevenue}
        </p>
      </div>

    </div>
  </>
)}

          {/* Appointments */}

          {activeTab === "appointments" && (
            <>
              <h1 className="text-4xl font-bold text-white">
                Appointments
              </h1>

              <div className="mt-8 space-y-4">

                {appointments.map(
                  (appointment) => (
                    <div
                      key={appointment._id}
                      className="rounded-3xl bg-[#111] p-6"
                    >
                      <div className="flex items-center justify-between">

                        <div>
                          <h3 className="text-xl font-semibold text-white">
                            {
                              appointment.customer
                                ?.name
                            }
                          </h3>

                          <p className="text-zinc-400">
                            Barber:
                            {" "}
                            {
                              appointment.barber
                                ?.name
                            }
                          </p>

                          <p className="text-zinc-400">
                            Services:
                            {" "}
                            {appointment.services
                              ?.map(
                                (service) =>
                                  service.name
                              )
                              .join(", ")}
                          </p>

                          <p className="text-zinc-400">
                            {
                              appointment.startTime
                            }
                          </p>

                          <p className="text-zinc-400">
                            {new Date(
                              appointment.appointmentDate
                            ).toLocaleDateString()}
                          </p>
                        </div>

                        <div>

                          <select
                            value={
                              appointment.status
                            }
                            onChange={(e) =>
                              handleStatusChange(
                                appointment._id,
                                e.target.value
                              )
                            }
                            className="rounded-lg bg-[#1c1c1c] px-4 py-2 text-white"
                          >
                            <option value="pending">
                              Pending
                            </option>

                            <option value="confirmed">
                              Confirmed
                            </option>

                            <option value="completed">
                              Completed
                            </option>

                            <option value="cancelled">
                              Cancelled
                            </option>
                          </select>

                        </div>

                      </div>
                    </div>
                  )
                )}

              </div>
            </>
          )}
          

{activeTab === "customers" && (
  <CustomersPanel />
)}

{activeTab === "barbers" && (
  <BarbersPanel />
)}

{activeTab === "services" && (
  <ServicesPanel />
)}

{activeTab === "analytics" && (
  <AnalyticsPanel />
)}
{activeTab === "queue" && (
  <LiveQueuePanel
    queueData={queueData}
    queueStats={queueStats}
  />
)}
          {activeTab === "messages" && (
  <>
    <h1 className="text-4xl font-bold text-white">
      Contact Messages
    </h1>

    <div className="mt-8">
      <MessagesPanel />
    </div>
  </>
)}

        </main>
      </div>

      
    </section>
  );
};

export default AdminDashboard;