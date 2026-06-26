import { useEffect, useState } from "react";

import {
  getDashboardOverview,
  getTopServices,
  getTopBarbers,
} from "../../lib/adminApi";

interface Overview {
  totalRevenue: number;
  totalReviews: number;
  averageRating: number;
  queueWaiting: number;
}

interface TopService {
  service: {
    name: string;
  };
  bookings: number;
}

interface TopBarber {
  barber: {
    name: string;
  };
  appointments: number;
}

const AnalyticsPanel = () => {
  const [overview, setOverview] =
    useState<Overview | null>(null);

  const [topServices, setTopServices] =
    useState<TopService[]>([]);

  const [topBarbers, setTopBarbers] =
    useState<TopBarber[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadAnalytics =
      async () => {
        try {
          const overviewRes =
            await getDashboardOverview();

          const servicesRes =
            await getTopServices();

          const barbersRes =
            await getTopBarbers();

          setOverview(
            overviewRes.data
          );

          setTopServices(
            servicesRes.data || []
          );

          setTopBarbers(
            barbersRes.data || []
          );
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="text-white">
        Loading Analytics...
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-8 text-5xl font-bold text-white">
        Analytics
      </h1>

      <div className="grid gap-6 md:grid-cols-4">

        <div className="rounded-3xl bg-[#111] p-6">
          <h3 className="text-zinc-400">
            Revenue
          </h3>

          <p className="mt-3 text-4xl font-bold text-[#D4AF37]">
            ₹{overview?.totalRevenue || 0}
          </p>
        </div>

        <div className="rounded-3xl bg-[#111] p-6">
          <h3 className="text-zinc-400">
            Reviews
          </h3>

          <p className="mt-3 text-4xl font-bold text-[#D4AF37]">
            {overview?.totalReviews || 0}
          </p>
        </div>

        <div className="rounded-3xl bg-[#111] p-6">
          <h3 className="text-zinc-400">
            Rating
          </h3>

          <p className="mt-3 text-4xl font-bold text-[#D4AF37]">
            {overview?.averageRating || 0}
          </p>
        </div>

        <div className="rounded-3xl bg-[#111] p-6">
          <h3 className="text-zinc-400">
            Queue Waiting
          </h3>

          <p className="mt-3 text-4xl font-bold text-[#D4AF37]">
            {overview?.queueWaiting || 0}
          </p>
        </div>

      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">

        <div className="rounded-3xl bg-[#111] p-6">
          <h2 className="mb-4 text-2xl font-bold text-white">
            Top Services
          </h2>

          {topServices.map((service, index) => (
            <div
              key={index}
              className="mb-3 text-zinc-300"
            >
              {service.service?.name}
              {" "}
              ({service.bookings})
            </div>
          ))}
        </div>

        <div className="rounded-3xl bg-[#111] p-6">
          <h2 className="mb-4 text-2xl font-bold text-white">
            Top Barbers
          </h2>

          {topBarbers.map((barber, index) => (
            <div
              key={index}
              className="mb-3 text-zinc-300"
            >
              {barber.barber?.name}
              {" "}
              ({barber.appointments})
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AnalyticsPanel;

