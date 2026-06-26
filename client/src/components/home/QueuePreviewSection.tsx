import { Users, Timer } from "lucide-react";
import { useEffect, useState } from "react";

import { getPublicQueue } from "../../lib/queueApi";
import { useNavigate } from "react-router-dom";
interface QueueItem {
  queueNumber: number;
  customer: string;
  status: string;
  duration: number;
  isServing: boolean;
}

interface BarberQueue {
  barberId: string;
  barberName: string;
  queues: QueueItem[];
}

const QueuePreviewSection = () => {
  const [queues, setQueues] =
    useState<BarberQueue[]>([]);

  const [
    selectedBarber,
    setSelectedBarber,
  ] = useState("");
  const navigate = useNavigate();
useEffect(() => {
  const loadQueue = async () => {
    try {
      const response =
        await getPublicQueue();

      const data =
        response.data || [];

      setQueues(data);

      if (
        data.length > 0 &&
        !selectedBarber
      ) {
        setSelectedBarber(
          data[0].barberId
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  loadQueue();

  const interval =
    setInterval(loadQueue, 10000);

  return () =>
    clearInterval(interval);
}, [selectedBarber]);
const currentBarber =
  queues.find(
    (barber) =>
      barber.barberId ===
      selectedBarber
  );

const servingCustomer =
  currentBarber?.queues.find(
    (queue) => queue.isServing
  );

const waitingCustomers =
  currentBarber?.queues.filter(
    (queue) =>
      queue.status === "waiting"
  ) || [];

const servingTime =
  servingCustomer?.duration || 0;

const waitingTime =
  waitingCustomers.reduce(
    (total, customer) =>
      total + customer.duration,
    0
  );

const estimatedWait =
  servingTime + waitingTime;
  return (
    <section className="bg-[#090909] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <p className="uppercase tracking-[0.3em] text-[#D4AF37]">
            Live Queue
          </p>

          <h2 className="mt-4 text-5xl font-semibold text-white">
            Skip The Waiting Line
          </h2>

          <p className="mt-5 text-zinc-400">
            Monitor your queue position in real-time before reaching the salon.
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            {servingCustomer && (
  <div className="mb-5 rounded-xl border border-[#D4AF37] bg-[#151515] p-5">
    <h4 className="text-xl font-bold text-[#D4AF37]">
      Currently Serving
    </h4>

    <p className="text-white">
      Queue #{servingCustomer.queueNumber}
    </p>

    <p className="text-zinc-400">
      {servingCustomer.customer}
    </p>
  </div>
)}

{waitingCustomers.length > 0 ? (
  waitingCustomers.map((customer) => (
    <div
      key={customer.queueNumber}
      className="flex items-center justify-between rounded-xl border border-[#222] bg-[#151515] p-5"
    >
      <div>
        <h4 className="text-xl font-semibold text-white">
          Queue #{customer.queueNumber}
        </h4>

        <p className="text-zinc-400">
          {customer.customer}
        </p>
      </div>

      <span className="rounded-full bg-[#D4AF37]/10 px-4 py-2 text-[#D4AF37]">
        Waiting
      </span>
    </div>
  ))
) : (
  <div className="rounded-xl border border-[#222] bg-[#151515] p-5 text-center text-zinc-400">
    No customers in queue
  </div>
)}
          </div>

          {/* Right Card */}

          <div className="flex flex-col justify-center rounded-3xl border border-[#1b1b1b] bg-[#101010] p-10">
            <div className="mb-10 flex items-center gap-4">
              <Users className="text-[#D4AF37]" size={34} />

              <h3 className="text-3xl font-semibold text-white">
                Queue Insights
              </h3>
            </div>

            <div className="space-y-8">
              <div className="flex items-center justify-between rounded-xl bg-[#151515] p-6">
                <span className="text-zinc-400">
                  Customers Waiting
                </span>

                <span className="text-4xl font-bold text-[#D4AF37]">
                  {waitingCustomers.length}
                </span>
              </div>

            <div className="flex items-center justify-between rounded-xl bg-[#151515] p-6">
  <span className="text-zinc-400">
    Estimated Wait Time
  </span>

  <span className="text-4xl font-bold text-[#D4AF37]">
    {estimatedWait} min
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

            <button
  onClick={() => navigate("/queue")}
  className="mt-10 rounded-xl bg-[#D4AF37] py-4 font-semibold text-black transition hover:bg-[#e9c04b]"
>
  View Full Queue
</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QueuePreviewSection;