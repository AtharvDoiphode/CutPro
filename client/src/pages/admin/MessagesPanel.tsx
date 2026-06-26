import { useEffect, useState } from "react";
import { getAllMessages } from "../../lib/contactApi";

type Message = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
};

const MessagesPanel = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response =
          await getAllMessages();

        setMessages(
          response.data?.messages || []
        );
      } catch (error) {
        console.error(
          "Error fetching messages:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, []);

  if (loading) {
    return (
      <div className="rounded-3xl bg-[#111] p-8 text-white">
        Loading Messages...
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-white">
        Contact Messages
      </h1>

      <p className="mt-2 text-zinc-400">
        Messages received from website visitors.
      </p>

      <div className="mt-8 space-y-5">
        {messages.length === 0 ? (
          <div className="rounded-3xl bg-[#111] p-8 text-white">
            No messages received yet.
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className="rounded-3xl border border-[#222] bg-[#111] p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {msg.name}
                  </h3>

                  <p className="text-zinc-400">
                    {msg.email}
                  </p>

                  <p className="text-zinc-400">
                    {msg.phone}
                  </p>
                </div>

                <div className="text-sm text-zinc-500">
                  {new Date(
                    msg.createdAt
                  ).toLocaleString()}
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-[#181818] p-4">
                <p className="leading-7 text-zinc-300">
                  {msg.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MessagesPanel;