import hero from "../../assests/herosection.png";
import FeaturesSection  from "../../components/home/FeaturesSection";
import ServicesSection from "../../components/home/ServicesSection";
import BarbersSection from "../../components/home/BarbersSection";
import QueuePreviewSection from "../../components/home/QueuePreviewSection";
import ReviewsSection from "../../components/home/ReviewsSection";
import ContactSection from "../../components/home/ContactSection";

const HomePage = () => {
  return (
    <>
      {/* Hero Section */}

      <section className="relative h-[700px] overflow-hidden">
        {/* Background Image */}

        <img
          src={hero}
          alt="Hero"
          className="absolute inset-0 h-full w-full object-cover"
        />
{/* Left-only Dark Overlay */}

<div
  className="
    absolute inset-0
    bg-gradient-to-r
    from-black
    via-black/80
    via-[35%]
    to-transparent
  "
/>

{/* Slight Global Tint */}

<div className="absolute inset-0 bg-black/15" />

        {/* Content */}

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-5 tracking-[0.35em] uppercase text-[#D4AF37]">
              Premium Barbershop
            </p>

            <h1 className="text-6xl font-semibold leading-none text-white md:text-8xl">
              Style That
              <br />

              <span className="text-[#D4AF37]">
                Defines You
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-9 text-zinc-300">
              Experience premium grooming with expert
              barbers, real-time queue tracking,
              effortless booking, and seamless online
              payments—all in one place.
            </p>

            <div className="mt-10 flex flex-wrap gap-5">
              <button className="rounded-lg bg-[#D4AF37] px-8 py-4 font-semibold text-black transition hover:bg-[#f5c95d]">
                Book Appointment
              </button>

              <button className="rounded-lg border border-white/20 bg-black/30 px-8 py-4 text-white backdrop-blur-sm transition hover:border-[#D4AF37]">
                Explore Services
              </button>
            </div>

            {/* Feature Strip */}

            <div className="mt-14 flex flex-wrap gap-10 border-t border-white/10 pt-8">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Expert Barbers
                </h3>

                <p className="text-sm text-zinc-400">
                  Trained Professionals
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">
                  Live Queue
                </h3>

                <p className="text-sm text-zinc-400">
                  Real-Time Tracking
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">
                  Online Payments
                </h3>

                <p className="text-sm text-zinc-400">
                  Razorpay & Cash
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}

      <section className="border-y border-[#1a1a1a] bg-[#090909] py-10">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
          <div>
            <h2 className="text-5xl font-semibold text-[#D4AF37]">
              5000+
            </h2>

            <p className="mt-2 text-zinc-400">
              Happy Customers
            </p>
          </div>

          <div>
            <h2 className="text-5xl font-semibold text-[#D4AF37]">
              15+
            </h2>

            <p className="mt-2 text-zinc-400">
              Expert Barbers
            </p>
          </div>

          <div>
            <h2 className="text-5xl font-semibold text-[#D4AF37]">
              4.9★
            </h2>

            <p className="mt-2 text-zinc-400">
              Customer Rating
            </p>
          </div>

          <div>
            <h2 className="text-5xl font-semibold text-[#D4AF37]">
              10+
            </h2>

            <p className="mt-2 text-zinc-400">
              Premium Services
            </p>
          </div>
        </div>
      </section>
      {/* Features Section */}

      <FeaturesSection />
        {/* Services Section */}
        <ServicesSection />
        {/* Barbers Section */}
        <BarbersSection />
        {/* Queue Preview Section */}
        <QueuePreviewSection />
        {/* Reviews Section */}
        <ReviewsSection />
        {/* Contact Section */}
        <ContactSection />

    </>

  );
};

export default HomePage;