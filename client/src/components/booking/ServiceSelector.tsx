import { useEffect, useState } from "react";
import { getAllServices } from "../../lib/serviceApi";
import type { ServiceType } from "../../pages/Booking/BookingPage";

type Props = {
  selectedServices: ServiceType[];
  setSelectedServices: React.Dispatch<
    React.SetStateAction<ServiceType[]>
  >;
};

const ServiceSelector = ({
  selectedServices,
  setSelectedServices,
}: Props) => {
  const [services, setServices] = useState<ServiceType[]>([]);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await getAllServices();

        setServices(response.data || []);
      } catch (error) {
        console.error(
          "Error fetching services:",
          error
        );
      }
    };

    loadServices();
  }, []);

  const toggleService = (
    service: ServiceType
  ) => {
    const exists = selectedServices.some(
      (s) => s._id === service._id
    );

    if (exists) {
      setSelectedServices(
        selectedServices.filter(
          (s) => s._id !== service._id
        )
      );
    } else {
      setSelectedServices([
        ...selectedServices,
        service,
      ]);
    }
  };

  return (
    <div className="rounded-3xl border border-[#1c1c1c] bg-[#101010] p-8">
      <h2 className="mb-6 text-2xl font-semibold text-white">
        Select Services
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        {services.map((service) => (
          <button
            key={service._id}
            type="button"
            onClick={() =>
              toggleService(service)
            }
            className={`rounded-xl border p-4 text-left transition ${
              selectedServices.some(
                (s) => s._id === service._id
              )
                ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]"
                : "border-[#222] bg-[#151515] text-white hover:border-[#D4AF37]"
            }`}
          >
            <h3 className="font-semibold">
              {service.name}
            </h3>

            <p className="mt-2">
              ₹{service.price}
            </p>

            <p className="mt-1 text-sm text-zinc-400">
              {service.duration} mins
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ServiceSelector;