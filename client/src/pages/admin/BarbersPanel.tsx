import { useEffect, useState } from "react";
import { getAllBarbers } from "../../lib/adminApi";

interface Barber {
  _id: string;
  name: string;
  email: string;
  phone: string;
  experience: number;
  rating: number;
  isAvailable: boolean;
  specialization: string[];
}

const BarbersPanel = () => {
  const [barbers, setBarbers] =
    useState<Barber[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadBarbers =
      async () => {
        try {
          const response =
            await getAllBarbers();

          setBarbers(
            response.data || []
          );
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

    loadBarbers();
  }, []);

  if (loading) {
    return (
      <div className="text-white">
        Loading Barbers...
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-8 text-5xl font-bold text-white">
        Barbers
      </h1>

      <div className="space-y-4">
        {barbers.map((barber) => (
          <div
            key={barber._id}
            className="rounded-3xl bg-[#111] p-6"
          >
            <h3 className="text-xl font-bold text-white">
              {barber.name}
            </h3>

            <p className="text-zinc-400">
              {barber.email}
            </p>

            <p className="text-zinc-400">
              {barber.phone}
            </p>

            <p className="mt-2 text-[#D4AF37]">
              Experience:
              {" "}
              {barber.experience}
              {" "}
              years
            </p>

            <p className="text-zinc-300">
              Rating:
              {" "}
              {barber.rating}
            </p>

            <p
              className={`mt-2 ${
                barber.isAvailable
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {barber.isAvailable
                ? "Available"
                : "Unavailable"}
            </p>

            <p className="mt-2 text-zinc-500">
              {barber.specialization?.join(
                ", "
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarbersPanel;