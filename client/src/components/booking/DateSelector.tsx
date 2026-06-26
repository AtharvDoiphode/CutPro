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
};

type Props = {
  selectedDate: string;
  setSelectedDate: React.Dispatch<
    React.SetStateAction<string>
  >;
  availability: Availability | null;
};

const DateSelector = ({
  selectedDate,
  setSelectedDate,
  availability,
}: Props) => {
  const today = new Date()
    .toISOString()
    .split("T")[0];

  const max = new Date();

  max.setDate(max.getDate() + 30);

  const maxDate = max
    .toISOString()
    .split("T")[0];

  const handleDateChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    const date = new Date(value);

    const day = date
      .toLocaleDateString("en-US", {
        weekday: "long",
      })
      .toLowerCase() as keyof WorkingDays;

    if (
      availability &&
      !availability.workingDays[day]
    ) {
      alert(
        `${day
          .charAt(0)
          .toUpperCase()}${day.slice(
          1
        )} is not a working day for this barber.`
      );

      return;
    }

    setSelectedDate(value);
  };

  return (
    <div className="rounded-3xl border border-[#1c1c1c] bg-[#101010] p-8">

      <h2 className="mb-6 text-2xl font-semibold text-white">
        Select Appointment Date
      </h2>

      <p className="mb-5 text-zinc-400">
        Choose your preferred appointment date.
      </p>

      <input
        type="date"
        value={selectedDate}
        min={today}
        max={maxDate}
        onChange={handleDateChange}
        className="w-full rounded-xl border border-[#2a2a2a] bg-[#151515] px-5 py-4 text-white outline-none focus:border-[#D4AF37]"
      />

      {availability && (
        <div className="mt-4 rounded-xl bg-[#151515] p-4">

          <p className="mb-2 text-sm text-zinc-400">
            Working Days
          </p>

          <div className="flex flex-wrap gap-2">

            {Object.entries(
              availability.workingDays
            ).map(([day, open]) => (
              <span
                key={day}
                className={`rounded-full px-3 py-1 text-sm ${
                  open
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {day.charAt(0).toUpperCase() +
                  day.slice(1)}
              </span>
            ))}

          </div>

        </div>
      )}

      {selectedDate && (
        <div className="mt-5 rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 p-4">

          <p className="text-[#D4AF37]">
            Selected Date
          </p>

          <h3 className="mt-1 text-xl font-semibold text-white">
            {selectedDate}
          </h3>

        </div>
      )}
    </div>
  );
};

export default DateSelector;