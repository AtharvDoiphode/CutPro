import type { ReactNode } from "react";
import logo from "../../assests/logo.png";
import hero from "../../assests/herosection.png";

type Props = {
  children: ReactNode;
};

const AuthLayout = ({ children }: Props) => {
  return (
    <section className="min-h-screen bg-[#050505]">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* LEFT SIDE */}

        <div className="relative hidden lg:block overflow-hidden">
          <img
            src={hero}
            alt="CutPro"
            className="h-full w-full object-cover"
          />

          {/* Overlay */}

          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/30" />

          {/* Content */}

          <div className="absolute inset-0 flex flex-col justify-between p-14">
            <div>
              <img
                src={logo}
                alt="CutPro"
                className="h-14"
              />
            </div>

            <div className="max-w-xl">
              <p className="mb-4 uppercase tracking-[0.35em] text-[#D4AF37]">
                Premium Barbershop
              </p>

              <h1 className="text-6xl font-bold leading-tight text-white">
                Style That
                <br />

                <span className="text-[#D4AF37]">
                  Defines You
                </span>
              </h1>

              <p className="mt-8 text-lg leading-8 text-zinc-300">
                Experience effortless booking,
                real-time queue tracking and
                premium grooming with CutPro.
              </p>
            </div>

            <div className="flex gap-10">
              <div>
                <h2 className="text-4xl font-bold text-[#D4AF37]">
                  5000+
                </h2>

                <p className="text-zinc-400">
                  Happy Customers
                </p>
              </div>

              <div>
                <h2 className="text-4xl font-bold text-[#D4AF37]">
                  4.9★
                </h2>

                <p className="text-zinc-400">
                  Average Rating
                </p>
              </div>

              <div>
                <h2 className="text-4xl font-bold text-[#D4AF37]">
                  15+
                </h2>

                <p className="text-zinc-400">
                  Expert Barbers
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div className="flex items-center justify-center bg-[#080808] px-6 py-10">
          {children}
        </div>
      </div>
    </section>
  );
};

export default AuthLayout;