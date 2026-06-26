import { useState } from "react";

import ServiceSelector from "../../components/booking/ServiceSelector";
import BarberSelector from "../../components/booking/BarberSelector";
import DateSelector from "../../components/booking/DateSelector";
import SlotSelector from "../../components/booking/SlotSelector";
import BookingSummary from "../../components/booking/BookingSummary";
import { useEffect } from "react";

import {
  getBarberAvailability,
} from "../../lib/availabilityApi";

import {
  getAvailableSlots,
} from "../../lib/appointmentApi";
export interface ServiceType {
  _id: string;
  name: string;
  price: number;
  duration: number;
}

export interface BarberType {
  _id: string;
  name: string;
  experience?: number;
  rating?: number;
}
type WorkingDays = {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
};

type Availability = {
  workingDays: WorkingDays;
  startTime: string;
  endTime: string;
  slotDuration: number;
};
const BookingPage = () => {
  const [selectedServices, setSelectedServices] =
    useState<ServiceType[]>([]);

  const [selectedBarber, setSelectedBarber] =
    useState<BarberType | null>(null);
  


const [availability, setAvailability] =
  useState<Availability | null>(null);

const [availableSlots, setAvailableSlots] =
  useState<string[]>([]);
  const [selectedDate, setSelectedDate] =
    useState("");

  const [selectedSlot, setSelectedSlot] =
    useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("cash");

useEffect(() => {
  const loadAvailability = async () => {
    if (!selectedBarber) {
      setAvailability(null);
      return;
    }

    try {
      const response =
        await getBarberAvailability(
          selectedBarber._id
        );

      console.log(response);

      setAvailability(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  loadAvailability();
}, [selectedBarber]);
useEffect(() => {
  const loadAvailableSlots = async () => {
    // If requirements aren't met, just clear slots and stop
    if (
      !selectedBarber ||
      !selectedDate ||
      selectedServices.length === 0
    ) {
      setAvailableSlots([]);
      return;
    }

    try {
      const response = await getAvailableSlots(
        selectedBarber._id,
        selectedDate,
        selectedServices.map(
          (service) => service._id
        )
      );

      // If using ApiResponse
      setAvailableSlots(response.data);

      // If this doesn't work, use:
      // setAvailableSlots(response.data.data);

    } catch (error) {
      console.error(error);
      setAvailableSlots([]);
    }
  };

  loadAvailableSlots();
}, [
  selectedBarber,
  selectedDate,
  selectedServices,
]);
  return (
    <section className="min-h-screen bg-[#070707] py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12">
          <p className="uppercase tracking-[0.3em] text-[#D4AF37]">
            Appointment
          </p>

          <h1 className="mt-4 text-5xl font-bold text-white">
            Book Your Appointment
          </h1>

          <p className="mt-4 text-zinc-400">
            Choose your services, preferred barber,
            date and time slot.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-8">
            <ServiceSelector
              selectedServices={selectedServices}
              setSelectedServices={setSelectedServices}
            />

            <BarberSelector
              selectedBarber={selectedBarber}
              setSelectedBarber={setSelectedBarber}
            />
<DateSelector
selectedDate={selectedDate}
setSelectedDate={setSelectedDate}
availability={availability}
/>

<SlotSelector
  selectedSlot={selectedSlot}
  setSelectedSlot={setSelectedSlot}
  availableSlots={availableSlots}
/>
            {/* Payment Method */}

            <div className="rounded-3xl border border-[#1c1c1c] bg-[#101010] p-8">
              <h2 className="mb-6 text-2xl font-semibold text-white">
                Payment Method
              </h2>

              <div className="space-y-4">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#222] p-4 hover:border-[#D4AF37]">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "cash"}
                    onChange={() =>
                      setPaymentMethod("cash")
                    }
                  />

                  <div>
                    <p className="font-medium text-white">
                      Cash At Salon
                    </p>

                    <p className="text-sm text-zinc-500">
                      Pay after service.
                    </p>
                  </div>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#222] p-4 hover:border-[#D4AF37]">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "online"}
                    onChange={() =>
                      setPaymentMethod("online")
                    }
                  />

                  <div>
                    <p className="font-medium text-white">
                      Online Payment
                    </p>

                    <p className="text-sm text-zinc-500">
                      Razorpay secure checkout.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <BookingSummary
            selectedServices={selectedServices}
            selectedBarber={selectedBarber}
            selectedDate={selectedDate}
            selectedSlot={selectedSlot}
            paymentMethod={paymentMethod}
          />
        </div>
      </div>
    </section>
  );
};

export default BookingPage;