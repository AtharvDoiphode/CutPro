import { useState } from "react";

import haircut from "../../assests/services/haircut.png";
import beard from "../../assests/services/beardtrimming.png";
import shave from "../../assests/services/shaving.png";
import facial from "../../assests/services/facial.png";
import hairWash from "../../assests/services/hairwash.png";
import hairColour from "../../assests/services/haircolouring.png";
import headMassage from "../../assests/services/headmassage.png";
import kidsHaircut from "../../assests/services/kidshaircut.png";

const services = [
  {
    title: "Hair Cut",
    image: haircut,
    price: "₹350",
    duration: "45 mins",
    desc: "Precision cuts tailored to your face shape and personal style using premium techniques.",
  },
  {
    title: "Beard Trimming",
    image: beard,
    price: "₹150",
    duration: "20 mins",
    desc: "Professional beard shaping and detailing for a clean and sharp look.",
  },
  {
    title: "Clean Shaving",
    image: shave,
    price: "₹250",
    duration: "30 mins",
    desc: "Traditional razor shave with hot towel treatment and premium products.",
  },
  {
    title: "Facial",
    image: facial,
    price: "₹500",
    duration: "60 mins",
    desc: "Deep cleansing facial for healthy, glowing and refreshed skin.",
  },
  {
    title: "Hair Wash",
    image: hairWash,
    price: "₹200",
    duration: "15 mins",
    desc: "Luxury hair wash with premium shampoo and conditioner.",
  },
  {
    title: "Hair Colouring",
    image: hairColour,
    price: "₹1200",
    duration: "90 mins",
    desc: "Professional hair coloring with long-lasting premium products.",
  },
  {
    title: "Head Massage",
    image: headMassage,
    price: "₹300",
    duration: "30 mins",
    desc: "Relaxing oil massage that reduces stress and improves circulation.",
  },
  {
    title: "Kids Hair Cut",
    image: kidsHaircut,
    price: "₹250",
    duration: "30 mins",
    desc: "Comfortable and stylish haircut experience specially designed for kids.",
  },
];

const ServicesSection = () => {
  const [selectedService, setSelectedService] = useState<
    (typeof services)[0] | null
  >(null);

  return (
    <>
      <section
  id="services"
  className="bg-[#090909] py-24"
>
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center">
            <p className="uppercase tracking-[0.3em] text-[#D4AF37]">
              Our Services
            </p>

            <h2 className="mt-4 text-5xl font-semibold text-white">
              Premium Grooming Services
            </h2>

            <p className="mt-4 text-zinc-400">
              Designed for modern gentlemen.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service) => (
              <div
                key={service.title}
                onClick={() => setSelectedService(service)}
                className="cursor-pointer overflow-hidden rounded-3xl border border-[#1d1d1d] bg-[#0f0f0f] transition duration-300 hover:-translate-y-2 hover:border-[#D4AF37]"
              >
                <img
                  src={service.image}
                  alt={service.title}
                  className="h-72 w-full object-cover"
                />

                <div className="p-7">
                  <div className="mb-4 flex justify-between">
                    <h3 className="text-3xl text-white">
                      {service.title}
                    </h3>

                    <span className="font-bold text-[#D4AF37]">
                      {service.price}
                    </span>
                  </div>

                  <p className="text-zinc-400">
                    {service.desc}
                  </p>

                  <button className="mt-7 w-full rounded-xl border border-[#D4AF37] py-3 text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}

      {selectedService && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-5"
          onClick={() => setSelectedService(null)}
        >
          <div
            className="max-w-4xl overflow-hidden rounded-3xl bg-[#121212]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid md:grid-cols-2">
              <img
                src={selectedService.image}
                alt={selectedService.title}
                className="h-full w-full object-cover"
              />

              <div className="p-10">
                <p className="uppercase tracking-[0.3em] text-[#D4AF37]">
                  Premium Service
                </p>

                <h2 className="mt-3 text-5xl font-bold text-white">
                  {selectedService.title}
                </h2>

                <div className="mt-6 flex gap-8">
                  <div>
                    <p className="text-zinc-500">Price</p>
                    <p className="text-3xl font-bold text-[#D4AF37]">
                      {selectedService.price}
                    </p>
                  </div>

                  <div>
                    <p className="text-zinc-500">Duration</p>
                    <p className="text-xl text-white">
                      {selectedService.duration}
                    </p>
                  </div>
                </div>

                <p className="mt-8 leading-8 text-zinc-300">
                  {selectedService.desc}
                </p>

                <div className="mt-10 flex gap-4">
                  <button className="rounded-xl bg-[#D4AF37] px-8 py-4 font-semibold text-black hover:bg-[#f3c652]">
                    Book Appointment
                  </button>

                  <button
                    onClick={() => setSelectedService(null)}
                    className="rounded-xl border border-zinc-700 px-8 py-4 text-white hover:border-[#D4AF37]"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ServicesSection;