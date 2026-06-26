import barber1 from "../../assests/barbers/barber1.png";
import barber2 from "../../assests/barbers/barber2.png";
import barber3 from "../../assests/barbers/barber3.png";

const barbers = [
  {
    name: "Rahul Sharma",
    role: "Senior Barber",
    experience: "8 Years Experience",
    image: barber1,
  },
  {
    name: "Aman Verma",
    role: "Hair Stylist",
    experience: "6 Years Experience",
    image: barber2,
  },
  {
    name: "Vikas Patil",
    role: "Beard Specialist",
    experience: "5 Years Experience",
    image: barber3,
  },
];

const BarbersSection = () => {
  return (
    <section
  id="barbers"
  className="bg-[#080808] py-24"
>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <p className="uppercase tracking-[0.3em] text-[#D4AF37]">
            Our Team
          </p>

          <h2 className="mt-4 text-5xl font-semibold text-white">
            Meet Our Expert Barbers
          </h2>

          <p className="mt-4 text-zinc-400">
            Skilled professionals committed to giving you the perfect look.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {barbers.map((barber) => (
            <div
              key={barber.name}
              className="group overflow-hidden rounded-3xl border border-[#1b1b1b] bg-[#101010] transition hover:-translate-y-2 hover:border-[#D4AF37]"
            >
              <div className="overflow-hidden">
                <img
                  src={barber.image}
                  alt={barber.name}
                  className="h-[420px] w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-7">
                <h3 className="text-3xl font-semibold text-white">
                  {barber.name}
                </h3>

                <p className="mt-2 text-[#D4AF37]">
                  {barber.role}
                </p>

                <p className="mt-3 text-zinc-400">
                  {barber.experience}
                </p>

                <button className="mt-8 w-full rounded-xl border border-[#D4AF37] py-3 text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BarbersSection;