import { useState } from "react";
import toast from "react-hot-toast";

import {
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import { sendContactMessage } from "../../lib/contactApi";

const ContactSection = () => {
  const [loading, setLoading] =
    useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      await sendContactMessage(
        form
      );

      toast.success(
        "Message Sent Successfully"
      );

      setForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed To Send Message"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="bg-[#050505] py-24"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <p className="uppercase tracking-[0.3em] text-[#D4AF37]">
            Contact Us
          </p>

          <h2 className="mt-4 text-5xl font-semibold text-white">
            Let's Talk
          </h2>

          <p className="mt-4 text-zinc-400">
            Questions, bookings,
            partnerships or feedback.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* LEFT */}

          <div className="space-y-6">
            <div className="rounded-3xl border border-[#222] bg-[#101010] p-8">
              <Mail
                className="mb-4 text-[#D4AF37]"
                size={30}
              />

              <h3 className="text-2xl font-semibold text-white">
                Email
              </h3>

              <p className="mt-2 text-zinc-400">
                support@cutpro.com
              </p>
            </div>

            <div className="rounded-3xl border border-[#222] bg-[#101010] p-8">
              <Phone
                className="mb-4 text-[#D4AF37]"
                size={30}
              />

              <h3 className="text-2xl font-semibold text-white">
                Phone
              </h3>

              <p className="mt-2 text-zinc-400">
                +91 9876543210
              </p>
            </div>

            <div className="rounded-3xl border border-[#222] bg-[#101010] p-8">
              <MapPin
                className="mb-4 text-[#D4AF37]"
                size={30}
              />

              <h3 className="text-2xl font-semibold text-white">
                Location
              </h3>

              <p className="mt-2 text-zinc-400">
                Pune, Maharashtra
              </p>
            </div>
          </div>

          {/* RIGHT */}

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-[#222] bg-[#101010] p-8"
          >
            <h3 className="mb-8 text-3xl font-semibold text-white">
              Send Message
            </h3>

            <div className="space-y-5">
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full rounded-xl border border-[#2a2a2a] bg-[#181818] px-5 py-4 text-white outline-none focus:border-[#D4AF37]"
              />

              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full rounded-xl border border-[#2a2a2a] bg-[#181818] px-5 py-4 text-white outline-none focus:border-[#D4AF37]"
              />

              <input
                type="text"
                name="phone"
                required
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full rounded-xl border border-[#2a2a2a] bg-[#181818] px-5 py-4 text-white outline-none focus:border-[#D4AF37]"
              />

              <textarea
                rows={5}
                name="message"
                required
                value={form.message}
                onChange={handleChange}
                placeholder="Your Message..."
                className="w-full rounded-xl border border-[#2a2a2a] bg-[#181818] px-5 py-4 text-white outline-none focus:border-[#D4AF37]"
              />

              <button
                disabled={loading}
                type="submit"
                className="w-full rounded-xl bg-[#D4AF37] py-4 font-semibold text-black hover:bg-[#e9c04b]"
              >
                {loading
                  ? "Sending..."
                  : "Send Message"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;