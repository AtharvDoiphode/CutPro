import { useEffect, useState } from "react";

import {
  getAvailability,
  updateWorkingDays,
  updateWorkingHours,
} from "../../lib/availabilityApi";

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

const AvailabilityTab = () => {
  const [availability, setAvailability] =
    useState<Availability | null>(null);
useEffect(() => {
  const loadAvailability = async () => {
    try {
      const response =
        await getAvailability();

      setAvailability(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  loadAvailability();
}, []);

  const handleDayChange = (
    day: keyof WorkingDays
  ) => {
    if (!availability) return;

    setAvailability({
      ...availability,
      workingDays: {
        ...availability.workingDays,
        [day]:
          !availability.workingDays[day],
      },
    });
  };

  const saveWorkingDays = async () => {
    if (!availability) return;

    await updateWorkingDays(
      availability.workingDays
    );

    alert("Working days updated.");
  };

  const saveWorkingHours = async () => {
    if (!availability) return;

    await updateWorkingHours(
      availability.startTime,
      availability.endTime,
      availability.slotDuration
    );

    alert("Working hours updated.");
  };

  if (!availability) {
    return (
      <div className="text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-10">

      {/* Working Days */}

      <div className="rounded-3xl bg-[#111] p-8">

        <h2 className="mb-6 text-3xl font-bold text-white">
          Working Days
        </h2>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

          {Object.entries(
            availability.workingDays
          ).map(([day, value]) => (
            <label
              key={day}
              className="flex items-center gap-3 rounded-xl bg-[#1b1b1b] p-4 text-white"
            >
              <input
                type="checkbox"
                checked={value}
                onChange={() =>
                  handleDayChange(
                    day as keyof WorkingDays
                  )
                }
              />

              <span className="capitalize">
                {day}
              </span>
            </label>
          ))}

        </div>

        <button
          onClick={saveWorkingDays}
          className="mt-6 rounded-xl bg-[#D4AF37] px-6 py-3 font-semibold text-black"
        >
          Save Working Days
        </button>

      </div>

      {/* Working Hours */}

      <div className="rounded-3xl bg-[#111] p-8">

        <h2 className="mb-6 text-3xl font-bold text-white">
          Working Hours
        </h2>

        <div className="grid gap-6 md:grid-cols-3">

          <div>

            <label className="text-zinc-400">
              Start Time
            </label>

            <input
              type="time"
              value={availability.startTime}
              onChange={(e) =>
                setAvailability({
                  ...availability,
                  startTime:
                    e.target.value,
                })
              }
              className="mt-2 w-full rounded-xl bg-[#1b1b1b] p-3 text-white"
            />

          </div>

          <div>

            <label className="text-zinc-400">
              End Time
            </label>

            <input
              type="time"
              value={availability.endTime}
              onChange={(e) =>
                setAvailability({
                  ...availability,
                  endTime:
                    e.target.value,
                })
              }
              className="mt-2 w-full rounded-xl bg-[#1b1b1b] p-3 text-white"
            />

          </div>

          <div>

            <label className="text-zinc-400">
              Slot Duration
            </label>

            <input
              type="number"
              value={
                availability.slotDuration
              }
              onChange={(e) =>
                setAvailability({
                  ...availability,
                  slotDuration:
                    Number(
                      e.target.value
                    ),
                })
              }
              className="mt-2 w-full rounded-xl bg-[#1b1b1b] p-3 text-white"
            />

          </div>

        </div>

        <button
          onClick={saveWorkingHours}
          className="mt-6 rounded-xl bg-[#D4AF37] px-6 py-3 font-semibold text-black"
        >
          Save Working Hours
        </button>

      </div>

    </div>
  );
};

export default AvailabilityTab;