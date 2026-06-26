import { useEffect, useState } from "react";
import { getAllBarbers } from "../../lib/barberApi";
import type { BarberType } from "../../pages/Booking/BookingPage";

type Props = {
  selectedBarber: BarberType | null;
  setSelectedBarber: React.Dispatch<
    React.SetStateAction<BarberType | null>
  >;
};

const BarberSelector = ({
  selectedBarber,
  setSelectedBarber,
}: Props) => {
  const [barbers, setBarbers] = useState<BarberType[]>([]);

  useEffect(() => {
    const loadBarbers = async () => {
      try {
        const response = await getAllBarbers();
        setBarbers(response.data || []);
      } catch (error) {
        console.error(error);
      }
    };

    loadBarbers();
  }, []);

  return (
    <div className="rounded-3xl border border-[#1c1c1c] bg-[#101010] p-8">
      <h2 className="mb-8 text-2xl font-semibold text-white">
        Choose Your Barber
      </h2>

      <div className="grid gap-6 md:grid-cols-3">
        {barbers.map((barber) => (
          <div
            key={barber._id}
            onClick={() => setSelectedBarber(barber)}
            className={`cursor-pointer rounded-2xl border p-6 transition-all duration-300 ${
              selectedBarber?._id === barber._id
                ? "border-[#D4AF37] bg-[#D4AF37]/10"
                : "border-[#222] bg-[#151515]"
            }`}
          >
            <h3 className="text-xl text-white">
              {barber.name}
            </h3>

            <p className="mt-2 text-[#D4AF37]">
              Experience: {barber.experience ?? 0} Years
            </p>

            <p className="mt-2 text-zinc-400">
              ⭐ {barber.rating ?? 0}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarberSelector;