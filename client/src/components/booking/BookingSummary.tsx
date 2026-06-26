import { useState } from "react";

import type {
  BarberType,
  ServiceType,
} from "../../pages/Booking/BookingPage";

import { createAppointment } from "../../lib/appointmentApi";
import { useAuth } from "../../hooks/useAuth";

type Props = {
  selectedServices: ServiceType[];

  selectedBarber: BarberType | null;

  selectedDate: string;

  selectedSlot: string;

  paymentMethod: string;
};

const BookingSummary = ({
  selectedServices,
  selectedBarber,
  selectedDate,
  selectedSlot,
  paymentMethod,
}: Props) => {
  const { user } = useAuth();

  const [loading, setLoading] =
    useState(false);

  const total = selectedServices.reduce(
    (sum, service) => sum + service.price,
    0
  );

  const finalTotal =
    paymentMethod === "online"
      ? Math.round(total * 0.9)
      : total;

  const isComplete =
    selectedServices.length > 0 &&
    selectedBarber &&
    selectedDate &&
    selectedSlot;

  const handleBooking = async () => {
    try {
      if (!user) {
        alert("Please login first");
        return;
      }

      if (!selectedBarber) {
        alert("Select a barber");
        return;
      }

      setLoading(true);

      await createAppointment({
        customer: user._id,

        barber: selectedBarber._id,

        services: selectedServices.map(
          (service) => service._id
        ),

        appointmentDate: selectedDate,

        startTime: selectedSlot,

        paymentMethod,
      });

      alert(
        "Appointment booked successfully 🎉"
      );
    } catch (error: unknown) {
      console.error(error);

      if (typeof error === "object" && error !== null) {
        interface ErrorWithResponse {
          response?: {
            data?: {
              message?: string;
            };
          };
        }
        const err = error as ErrorWithResponse;
        alert(err.response?.data?.message || "Booking failed");
      } else {
        alert("Booking failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sticky top-28 h-fit rounded-3xl border border-[#1c1c1c] bg-[#101010] p-8">
      <h2 className="mb-8 text-3xl font-bold text-white">
        Booking Summary
      </h2>

      <div className="space-y-6">
        {/* Services */}

        <div>
          <p className="text-zinc-500">
            Services
          </p>

          {selectedServices.length > 0 ? (
            selectedServices.map(
              (service) => (
                <p
                  key={service._id}
                  className="text-white"
                >
                  {service.name}
                </p>
              )
            )
          ) : (
            <p className="text-white">
              Not Selected
            </p>
          )}
        </div>

        {/* Barber */}

        <div>
          <p className="text-zinc-500">
            Barber
          </p>

          <p className="text-white">
            {selectedBarber?.name ||
              "Not Selected"}
          </p>
        </div>

        {/* Date */}

        <div>
          <p className="text-zinc-500">
            Date
          </p>

          <p className="text-white">
            {selectedDate ||
              "Not Selected"}
          </p>
        </div>

        {/* Slot */}

        <div>
          <p className="text-zinc-500">
            Time Slot
          </p>

          <p className="text-white">
            {selectedSlot ||
              "Not Selected"}
          </p>
        </div>

        {/* Payment */}

        <div>
          <p className="text-zinc-500">
            Payment Method
          </p>

          <p className="text-white capitalize">
            {paymentMethod}
          </p>
        </div>

        {/* Total */}

        <div className="border-t border-[#222] pt-6">
          <div className="flex justify-between">
            <span className="text-white">
              Total
            </span>

            <span className="font-semibold text-[#D4AF37]">
              ₹{finalTotal}
            </span>
          </div>
        </div>

        {/* Button */}

        <button
          onClick={handleBooking}
          disabled={!isComplete || loading}
          className={`mt-6 w-full rounded-xl py-4 font-semibold transition ${
            isComplete
              ? "bg-[#D4AF37] text-black hover:bg-[#e6bc42]"
              : "cursor-not-allowed bg-zinc-700 text-zinc-400"
          }`}
        >
          {loading
            ? "Booking..."
            : "Confirm Booking"}
        </button>

        {!isComplete && (
          <p className="text-center text-sm text-zinc-500">
            Complete all booking details.
          </p>
        )}
      </div>
    </div>
  );
};

export default BookingSummary;