type Props = {
  selectedSlot: string;
  setSelectedSlot: React.Dispatch<
    React.SetStateAction<string>
  >;
  availableSlots: string[];
};

const SlotSelector = ({
  selectedSlot,
  setSelectedSlot,
  availableSlots,
}: Props) => {
  return (
    <div className="rounded-3xl border border-[#1c1c1c] bg-[#101010] p-8">
      <h2 className="mb-6 text-2xl font-semibold text-white">
        Select Time Slot
      </h2>

      <p className="mb-6 text-zinc-400">
        Choose your preferred appointment time.
      </p>

      {availableSlots.length === 0 ? (
        <div className="rounded-xl bg-[#151515] p-5 text-zinc-400">
          No available slots for the selected date.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {availableSlots.map((slot) => (
            <button
              key={slot}
              onClick={() => setSelectedSlot(slot)}
              className={`rounded-xl border px-5 py-4 transition-all duration-300 ${
                selectedSlot === slot
                  ? "border-[#D4AF37] bg-[#D4AF37] font-semibold text-black"
                  : "border-[#2a2a2a] bg-[#151515] text-white hover:border-[#D4AF37]"
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      )}

      {selectedSlot && (
        <div className="mt-6 rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 p-4">
          <p className="text-[#D4AF37]">
            Selected Slot
          </p>

          <h3 className="mt-1 text-xl font-semibold text-white">
            {selectedSlot}
          </h3>
        </div>
      )}
    </div>
  );
};

export default SlotSelector;