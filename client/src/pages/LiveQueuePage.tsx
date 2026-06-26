import { useEffect, useState } from "react";
import { Users, Timer } from "lucide-react";

import { getPublicQueue } from "../lib/queueApi";

interface QueueItem {
  queueNumber: number;
  customer: string;
  status: string;
}

interface BarberQueue {
  barberId: string;
  barberName: string;
  queues: QueueItem[];
}

const LiveQueuePage = () => {
  const [queues, setQueues] =
    useState<BarberQueue[]>([]);

  const [
    selectedBarber,
    setSelectedBarber,
  ] = useState("");

useEffect(() => {
  const loadQueue = async () => {
    try {
      const response =
        await getPublicQueue();

      const data =
        response.data || [];

      setQueues(data);

      setSelectedBarber(
        (prev) =>
          prev ||
          data[0]?.barberId ||
          ""
      );
    } catch (error) {
      console.error(error);
    }
  };

  loadQueue();

  const interval =
    setInterval(() => {
      loadQueue();
    }, 10000);

  return () =>
    clearInterval(interval);

}, []);
  const currentBarber =
    queues.find(
      (barber) =>
        barber.barberId ===
        selectedBarber
    );

  const servingCustomer =
    currentBarber?.queues.find(
      (queue) =>
        queue.status ===
        "serving"
    );

  const waitingCustomers =
    currentBarber?.queues.filter(
      (queue) =>
        queue.status ===
        "waiting"
    ) || [];

  return (
    <section className="min-h-screen bg-[#090909] py-16">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-12 text-center">
          <p className="uppercase tracking-[0.3em] text-[#D4AF37]">
            Live Queue
          </p>

          <h1 className="mt-4 text-5xl font-bold text-white">
            Queue Status
          </h1>

          <p className="mt-4 text-zinc-400">
            Monitor live queue updates
            before reaching the salon.
          </p>

          <div className="mt-8">
            <select
              value={selectedBarber}
              onChange={(e) =>
                setSelectedBarber(
                  e.target.value
                )
              }
              className="rounded-xl bg-[#151515] px-5 py-3 text-white"
            >
              {queues.map((barber) => (
                <option
                  key={barber.barberId}
                  value={barber.barberId}
                >
                  {barber.barberName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">

          {/* Queue */}

          <div className="rounded-3xl border border-[#1b1b1b] bg-[#101010] p-8">

            <h2 className="mb-6 text-3xl font-semibold text-white">
              Current Queue
            </h2>

            {servingCustomer && (
              <div className="mb-6 rounded-xl border border-[#D4AF37] bg-[#151515] p-5">
                <h3 className="text-lg font-bold text-[#D4AF37]">
                  Currently Serving
                </h3>

                <p className="mt-2 text-white">
                  Queue #
                  {
                    servingCustomer.queueNumber
                  }
                </p>

                <p className="text-zinc-400">
                  {
                    servingCustomer.customer
                  }
                </p>
              </div>
            )}

            <div className="space-y-4">

              {waitingCustomers.length >
              0 ? (
                waitingCustomers.map(
                  (customer) => (
                    <div
                      key={
                        customer.queueNumber
                      }
                      className="flex items-center justify-between rounded-xl border border-[#222] bg-[#151515] p-5"
                    >
                      <div>
                        <h4 className="text-lg font-semibold text-white">
                          Queue #
                          {
                            customer.queueNumber
                          }
                        </h4>

                        <p className="text-zinc-400">
                          {
                            customer.customer
                          }
                        </p>
                      </div>

                      <span className="rounded-full bg-[#D4AF37]/10 px-4 py-2 text-[#D4AF37]">
                        Waiting
                      </span>
                    </div>
                  )
                )
              ) : (
                <div className="rounded-xl border border-[#222] bg-[#151515] p-5 text-center text-zinc-400">
                  No customers waiting
                </div>
              )}

            </div>
          </div>

          {/* Insights */}

          <div className="rounded-3xl border border-[#1b1b1b] bg-[#101010] p-8">

            <div className="mb-8 flex items-center gap-3">
              <Users
                className="text-[#D4AF37]"
                size={30}
              />

              <h2 className="text-3xl font-semibold text-white">
                Queue Insights
              </h2>
            </div>

            <div className="space-y-6">

              <div className="flex items-center justify-between rounded-xl bg-[#151515] p-6">
                <span className="text-zinc-400">
                  Customers Waiting
                </span>

                <span className="text-4xl font-bold text-[#D4AF37]">
                  {
                    waitingCustomers.length
                  }
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-[#151515] p-6">
                <span className="text-zinc-400">
                  Estimated Wait
                </span>

                <span className="text-4xl font-bold text-[#D4AF37]">
                  {
                    waitingCustomers.length *
                    15
                  }
                  min
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-[#151515] p-6">
                <span className="text-zinc-400">
                  Currently Serving
                </span>

                <span className="flex items-center gap-2 text-[#D4AF37]">
                  <Timer size={20} />

                  {servingCustomer
                    ? `Queue #${servingCustomer.queueNumber}`
                    : "None"}
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default LiveQueuePage;