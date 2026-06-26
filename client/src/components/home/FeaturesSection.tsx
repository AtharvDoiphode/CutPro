import {
  Scissors,
  Clock3,
  CreditCard,
  Star,
} from "lucide-react";

const features = [
  {
    icon: Scissors,
    title: "Expert Barbers",
    description:
      "Experienced professionals delivering precision cuts and styling.",
  },
  {
    icon: Clock3,
    title: "Live Queue Tracking",
    description:
      "Monitor your position in real time and avoid unnecessary waiting.",
  },
  {
    icon: CreditCard,
    title: "Flexible Payments",
    description:
      "Pay securely online with Razorpay or choose cash at the salon.",
  },
  {
    icon: Star,
    title: "Premium Experience",
    description:
      "Modern ambience, top-quality products, and exceptional service.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="bg-[#080808] py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <p className="tracking-[0.3em] uppercase text-[#D4AF37]">
            Why Choose Us
          </p>

          <h2 className="mt-4 text-5xl font-semibold text-white">
            Experience Grooming
            <span className="text-[#D4AF37]">
              {" "}
              Redefined
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-zinc-400">
            CutPro combines expert barbers, technology,
            and convenience to deliver an unmatched
            grooming experience.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-[#222] bg-[#101010] p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[#D4AF37]"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#D4AF37]/10">
                  <Icon
                    size={28}
                    className="text-[#D4AF37]"
                  />
                </div>

                <h3 className="mb-3 text-2xl font-semibold text-white">
                  {feature.title}
                </h3>

                <p className="leading-7 text-zinc-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;