import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { getServerAuthSession } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { getFoodLogs } from "./queries";

const DayOverview = ({
  eaten,
  goal = 2000,
}: {
  eaten: number;
  goal?: number;
}) => {
  const left = goal - eaten;

  const progress = eaten / goal;
  const isOver = progress > 1;

  return (
    <div className="rounded bg-white p-4">
      <div className="flex justify-between">
        <h3 className="text-sm font-medium">Today - Weds, June 20</h3>
        <small className="text-xs">{goal} calories</small>
      </div>
      <progress
        value={progress}
        className="progress-unfilled:bg-gray-100 progress-filled:bg-green-400 data-[over=true]:progress-filled:bg-red-400 h-2 w-full"
        data-over={isOver}
      />
      <p className="flex justify-between font-medium">
        <span>{eaten} eaten</span>
        {isOver ? <span>{Math.abs(left)} over</span> : <span>{left} left</span>}
      </p>
      <div className="flex justify-between text-xs text-gray-500">
        <ul className="flex gap-2">
          <li>40g protein</li>
          <li>20g fat</li>
          <li>20g carbs</li>
        </ul>
        <span>300 burned</span>
      </div>
    </div>
  );
};

const DayItems = () => {
  return (
    <ol>
      <li>Chicken</li>
    </ol>
  );
};

const DayLog = ({ eaten }: { eaten: number }) => {
  return (
    <div>
      <DayOverview eaten={eaten} />
      <DayItems />
    </div>
  );
};

const FoodLog = async () => {
  const logs = await getFoodLogs();

  return (
    <div className="container">
      <ol className="grid grid-cols-3 gap-4">
        <li>
          <DayLog eaten={100} />
        </li>
        <li>
          <DayLog eaten={1000} />
        </li>
        <li>
          <DayLog eaten={2300} />
        </li>
      </ol>
    </div>
  );
};

export default async function Home() {
  const session = await getServerAuthSession();
  return (
    <HydrateClient>
      <div>
        <FoodLog />
      </div>
    </HydrateClient>
  );
}
