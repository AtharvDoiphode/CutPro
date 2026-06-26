interface QueueItem {
  _id: string;

  customer?: {
    name: string;
  };

  queueNumber: number;

  status: string;
}

interface QueueStats {
  waitingNow: number;
  servedToday: number;
  averageServiceTime: number;
  longestQueue: number;
}

interface LiveQueuePanelProps {
  queueData: QueueItem[];
  queueStats: QueueStats;
}

const LiveQueuePanel = ({
  queueData,
  queueStats,
}: LiveQueuePanelProps) => {
  return (
    <div>
      <h1 className="text-4xl font-bold text-white">
        Live Queue
      </h1>

      <div className="mt-8 grid gap-6 md:grid-cols-4">

        <div className="rounded-3xl bg-[#111] p-6">
          <h3 className="text-zinc-400">
            Waiting
          </h3>

          <p className="mt-3 text-4xl font-bold text-[#D4AF37]">
            {queueStats.waitingNow}
          </p>
        </div>

        <div className="rounded-3xl bg-[#111] p-6">
          <h3 className="text-zinc-400">
            Served Today
          </h3>

          <p className="mt-3 text-4xl font-bold text-[#D4AF37]">
            {queueStats.servedToday}
          </p>
        </div>

        <div className="rounded-3xl bg-[#111] p-6">
          <h3 className="text-zinc-400">
            Avg Service Time
          </h3>

          <p className="mt-3 text-4xl font-bold text-[#D4AF37]">
            {queueStats.averageServiceTime} min
          </p>
        </div>

        <div className="rounded-3xl bg-[#111] p-6">
          <h3 className="text-zinc-400">
            Longest Queue
          </h3>

          <p className="mt-3 text-4xl font-bold text-[#D4AF37]">
            {queueStats.longestQueue}
          </p>
        </div>

      </div>

      <div className="mt-8 space-y-4">

        {queueData.length === 0 ? (
          <div className="rounded-3xl bg-[#111] p-6 text-zinc-400">
            No customers in queue
          </div>
        ) : (
          queueData.map((queue) => (
            <div
              key={queue._id}
              className="rounded-3xl bg-[#111] p-5"
            >
              <h3 className="text-white">
                {queue.customer?.name}
              </h3>

              <p className="text-zinc-400">
                Queue #{queue.queueNumber}
              </p>

              <p className="text-[#D4AF37]">
                {queue.status}
              </p>
            </div>
          ))
        )}

      </div>
    </div>
  );
};

export default LiveQueuePanel;