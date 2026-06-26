import { useState } from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

const reviews = [
  {
    name: "Rahul S.",
    rating: 5,
    review:
      "The live queue feature saved me so much time. Amazing haircut and smooth booking process.",
  },
  {
    name: "Amit P.",
    rating: 5,
    review:
      "Professional staff and premium ambience. Highly recommended for busy professionals.",
  },
  {
    name: "Vikas T.",
    rating: 4,
    review:
      "Booking online was effortless and the barber understood exactly what I wanted.",
  },
  {
    name: "Rohan M.",
    rating: 5,
    review:
      "One of the cleanest salons I've visited. Queue tracking is a game changer.",
  },
  {
    name: "Arjun K.",
    rating: 5,
    review:
      "Loved the haircut and beard styling. Definitely my new regular place.",
  },
  {
    name: "Parent of Aditya",
    rating: 5,
    review:
      "My son loved his haircut and the staff made him feel comfortable throughout the visit.",
  },
  {
    name: "Karan J.",
    rating: 4,
    review:
      "Very professional service with almost no waiting time.",
  },
  {
    name: "Parent of Aarav",
    rating: 5,
    review:
      "Kid-friendly environment and patient stylists. Great experience for children.",
  },
  {
    name: "Sahil R.",
    rating: 5,
    review:
      "Premium experience from booking to payment. Everything feels modern.",
  },
  {
    name: "Manish G.",
    rating: 4,
    review:
      "Excellent staff and clean environment. Will definitely visit again.",
  },
  {
    name: "Nikhil D.",
    rating: 5,
    review:
      "Best beard trim I've had in years. Worth every rupee.",
  },
  {
    name: "Parent of Vihaan",
    rating: 5,
    review:
      "Very gentle with kids and the haircut came out exactly as requested.",
  },
];

const topRow = reviews.slice(0, 6);
const bottomRow = reviews.slice(6);

const ReviewsSection = () => {
  const [selectedReview, setSelectedReview] = useState<
    (typeof reviews)[0] | null
  >(null);

  return (
    <section
  id="reviews"
  className="overflow-hidden bg-[#050505] py-24"
>
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}

        <div className="mb-16 text-center">
          <p className="uppercase tracking-[0.3em] text-[#D4AF37]">
            Google Reviews
          </p>

          <h2 className="mt-4 text-5xl font-semibold text-white">
            Loved By Thousands Of Customers
          </h2>

          <p className="mt-4 text-zinc-400">
            Genuine experiences shared by customers and parents who trust CutPro.
          </p>

          <div className="mt-8 flex items-center justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={26}
                fill="#D4AF37"
                color="#D4AF37"
              />
            ))}

            <span className="ml-3 text-4xl font-bold text-[#D4AF37]">
              4.9
            </span>

            <span className="text-zinc-400">
              (5000+ Reviews)
            </span>
          </div>
        </div>
                {/* Top Marquee */}

        <motion.div
          className="flex gap-6"
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            duration: 18,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {[...topRow, ...topRow].map((review, index) => (
            <div
              key={`top-${index}`}
              onClick={() => setSelectedReview(review)}
              className="min-w-[380px] cursor-pointer rounded-3xl border border-[#1d1d1d] bg-[#101010] p-7 transition-all duration-300 hover:-translate-y-2 hover:border-[#D4AF37]"
            >
              {/* Header */}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#D4AF37] text-xl font-bold text-black">
                    {review.name.charAt(0)}
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">
                      {review.name}
                    </h3>

                    <p className="text-sm text-zinc-500">
                      Verified Customer
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-[#1b1b1b] px-3 py-1 text-xs text-zinc-400">
                  Google Review
                </span>
              </div>

              {/* Stars */}

              <div className="mt-5 flex gap-1">
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={17}
                    fill="#D4AF37"
                    color="#D4AF37"
                  />
                ))}
              </div>

              {/* Review */}

              <p className="mt-5 line-clamp-4 leading-7 text-zinc-300">
                {review.review}
              </p>

              <button className="mt-6 text-sm font-medium text-[#D4AF37]">
                Read More →
              </button>
            </div>
          ))}
        </motion.div>

        {/* Gap */}

        <div className="h-8" />

        {/* Bottom Marquee */}

        <motion.div
          className="flex gap-6"
          animate={{
            x: ["-50%", "0%"],
          }}
          transition={{
            duration: 16,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {[...bottomRow, ...bottomRow].map((review, index) => (
            <div
              key={`bottom-${index}`}
              onClick={() => setSelectedReview(review)}
              className="min-w-[380px] cursor-pointer rounded-3xl border border-[#1d1d1d] bg-[#101010] p-7 transition-all duration-300 hover:-translate-y-2 hover:border-[#D4AF37]"
            >
              {/* Header */}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#D4AF37] text-xl font-bold text-black">
                    {review.name.charAt(0)}
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">
                      {review.name}
                    </h3>

                    <p className="text-sm text-zinc-500">
                      Verified Customer
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-[#1b1b1b] px-3 py-1 text-xs text-zinc-400">
                  Google Review
                </span>
              </div>

              {/* Stars */}

              <div className="mt-5 flex gap-1">
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={17}
                    fill="#D4AF37"
                    color="#D4AF37"
                  />
                ))}
              </div>

              {/* Review */}

              <p className="mt-5 line-clamp-4 leading-7 text-zinc-300">
                {review.review}
              </p>

              <button className="mt-6 text-sm font-medium text-[#D4AF37]">
                Read More →
              </button>
            </div>
          ))}
        </motion.div>
                {/* Review Modal */}

        {selectedReview && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
            onClick={() => setSelectedReview(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl rounded-3xl border border-[#2a2a2a] bg-[#101010] p-10"
            >
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#D4AF37] text-2xl font-bold text-black">
                  {selectedReview.name.charAt(0)}
                </div>

                <div>
                  <h2 className="text-3xl font-semibold text-white">
                    {selectedReview.name}
                  </h2>

                  <p className="text-zinc-500">
                    Verified Customer
                  </p>

                  <div className="mt-2 flex gap-1">
                    {[...Array(selectedReview.rating)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        fill="#D4AF37"
                        color="#D4AF37"
                      />
                    ))}
                  </div>
                </div>
              </div>

              <p className="mt-8 text-lg leading-9 text-zinc-300">
                "{selectedReview.review}"
              </p>

              <button
                onClick={() => setSelectedReview(null)}
                className="mt-10 rounded-xl bg-[#D4AF37] px-8 py-3 font-semibold text-black transition hover:bg-[#e9c04b]"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewsSection;