import { useEffect, useState } from "react";
import { getAllServices } from "../../lib/serviceApi";

interface Service {
  _id: string;
  name: string;
  price: number;
  duration: number;
}

const ServicesPanel = () => {
  const [services, setServices] =
    useState<Service[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadServices =
      async () => {
        try {
          const response =
            await getAllServices();

          setServices(
            response.data || []
          );
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

    loadServices();
  }, []);

  if (loading) {
    return (
      <div className="text-white">
        Loading Services...
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-8 text-5xl font-bold text-white">
        Services
      </h1>

      <div className="grid gap-4 md:grid-cols-2">
        {services.map((service) => (
          <div
            key={service._id}
            className="rounded-3xl bg-[#111] p-6"
          >
            <h3 className="text-xl font-bold text-white">
              {service.name}
            </h3>

            <p className="mt-3 text-[#D4AF37]">
              ₹{service.price}
            </p>

            <p className="text-zinc-400">
              Duration:
              {" "}
              {service.duration}
              {" "}
              mins
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesPanel;