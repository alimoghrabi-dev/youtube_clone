import { formatNumber } from "@/lib/utils";

interface ChannelAnalyticsProps {
  userId: string;
  currentSubs: number;
}

const ChannelAnalytics = ({ userId, currentSubs }: ChannelAnalyticsProps) => {
  return (
    <div className="flex h-32 flex-col items-center justify-start gap-y-4 rounded-sm border border-neutral-600 bg-neutral-700/30 px-6 py-3">
      <h3 className="text-base font-semibold text-gray-100">
        Channel Analytics
      </h3>
      <div>
        <span className="flex flex-col items-start justify-start gap-y-1">
          <p className="text-sm font-medium text-gray-200">
            Current Subscribers
          </p>
          <p className="text-2xl font-medium text-neutral-100">
            {formatNumber(currentSubs)}
          </p>
        </span>
      </div>
    </div>
  );
};

export default ChannelAnalytics;
