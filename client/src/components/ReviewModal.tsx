import { useState } from "react";
import { X, Star } from "lucide-react";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    rating: number,
    comment: string
  ) => Promise<void>;
}

const ReviewModal = ({
  isOpen,
  onClose,
  onSubmit,
}: ReviewModalProps) => {
  const [rating, setRating] =
    useState(0);

  const [hoverRating, setHoverRating] =
    useState(0);

  const [comment, setComment] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("Please select a rating.");
      return;
    }

    if (comment.trim().length < 10) {
      alert(
        "Comment should be at least 10 characters."
      );
      return;
    }

    try {
      setLoading(true);

      await onSubmit(
        rating,
        comment
      );

      setRating(0);
      setHoverRating(0);
      setComment("");

      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

      <div className="w-full max-w-lg rounded-3xl bg-[#101010] p-8 shadow-2xl">

        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-3xl font-bold text-white">
            Rate Your Experience
          </h2>

          <button onClick={onClose}>
            <X
              className="text-white"
              size={28}
            />
          </button>

        </div>

        <p className="mb-6 text-zinc-400">
          Tell us how your haircut experience was.
        </p>

        <div className="mb-8 flex justify-center gap-3">

          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() =>
                setRating(star)
              }
              onMouseEnter={() =>
                setHoverRating(star)
              }
              onMouseLeave={() =>
                setHoverRating(0)
              }
            >
              <Star
                size={42}
                className={`${
                  star <=
                  (hoverRating ||
                    rating)
                    ? "fill-[#D4AF37] text-[#D4AF37]"
                    : "text-zinc-500"
                } transition`}
              />
            </button>
          ))}

        </div>

        <textarea
          rows={5}
          value={comment}
          onChange={(e) =>
            setComment(
              e.target.value
            )
          }
          placeholder="Write your feedback..."
          className="w-full rounded-xl border border-[#2b2b2b] bg-[#181818] p-4 text-white outline-none focus:border-[#D4AF37]"
        />

        <div className="mt-8 flex justify-end gap-4">

          <button
            onClick={onClose}
            className="rounded-xl border border-[#2b2b2b] px-6 py-3 text-white"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={handleSubmit}
            className="rounded-xl bg-[#D4AF37] px-8 py-3 font-semibold text-black hover:bg-yellow-400"
          >
            {loading
              ? "Submitting..."
              : "Submit Review"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default ReviewModal;