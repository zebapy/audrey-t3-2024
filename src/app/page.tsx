import { $Enums } from "@prisma/client";
import { getServerAuthSession } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import { DayFoodLog, getFoodLogsByDays } from "./queries";
import Link from "next/link";
import { FoodLogItemEditor } from "./FoodLogItemEditor";
import { sumNutrientsForFoods } from "./utils/calculateNutrients";
import { FoodLogItem } from "./FoodLogItem";

const shortDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

const IntakeProgress = ({ eaten, goal }: { eaten: number; goal: number }) => {
  const progress = eaten / goal;
  const isOver = progress > 1;
  const left = goal - eaten;

  return (
    <div>
      <progress
        value={progress}
        className="h-2 w-full progress-unfilled:bg-gray-100 progress-filled:bg-green-400 data-[over=true]:progress-filled:bg-red-400"
        data-over={isOver}
      />
      <p className="flex justify-between font-medium">
        <span>{eaten} eaten</span>
        {isOver ? <span>{Math.abs(left)} over</span> : <span>{left} left</span>}
      </p>
    </div>
  );
};

const NutrientBar = ({ logs }: { logs: DayFoodLog["foods"] }) => {
  const sums = sumNutrientsForFoods(logs);

  return (
    <ul className="flex gap-2">
      <li>{sums.kcals} kcals</li>
      <li>{sums.protein}g protein</li>
      <li>{sums.carbs} carbs</li>
      <li>{sums.fat}g fat</li>
    </ul>
  );
};

const DayOverview = ({
  date,
  foods,
  goal = 2000,
}: {
  date: Date;
  foods: DayFoodLog["foods"];
  goal?: number;
}) => {
  const isToday = new Date().toDateString() === date.toDateString();

  const sums = sumNutrientsForFoods(foods);
  const eaten = sums.kcals;

  return (
    <div className="rounded bg-white p-4">
      <div className="flex justify-between">
        <h3 className="text-sm font-medium">
          {isToday && "Today - "}
          {shortDate(date)}
        </h3>
        <small className="text-xs">{goal} calories</small>
      </div>
      <IntakeProgress eaten={eaten} goal={goal} />
      <div className="flex justify-between text-xs text-gray-500">
        <NutrientBar logs={foods} />
        <span>300 burned</span>
      </div>
    </div>
  );
};

const GroupedFoodItems = ({
  foods,
  editId,
}: {
  foods: DayFoodLog["foods"];
  editId?: string;
}) => {
  const grouped = foods.reduce(
    (acc, food) => {
      acc[food.group] ??= [];
      acc[food.group].push(food);
      return acc;
    },
    {} as Record<$Enums.LogTimingGroup, DayFoodLog["foods"]>,
  );

  return (
    <ol className="divide-y-4">
      {Object.entries(grouped).map(([group, foodLogs]) => (
        <li key={group}>
          <div className="border-b-2 border-gray-300 bg-white p-2 text-gray-800">
            <h4 className="mb-2 text-sm font-semibold">{group}</h4>
            <div className="text-xs">
              <NutrientBar logs={foodLogs} />
            </div>
          </div>
          <ul className="rounded bg-white">
            {foodLogs.map((log) => (
              <li key={log.id} className="border-b last:border-0">
                <FoodLogItem editing={log.id === editId} log={log} />
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
};

const FoodLog = async ({ editId }: { editId?: string }) => {
  const daysAgo = 3;
  const startDate = new Date(
    new Date().setDate(new Date().getDate() - daysAgo),
  );
  const endDate = new Date();

  const logs = await getFoodLogsByDays({
    startDate,
    endDate: endDate,
  });

  return (
    <div className="container">
      <ol className="grid grid-cols-3 gap-4">
        {logs.map((daylog) => (
          <li key={daylog.date.toString()}>
            <DayOverview date={daylog.date} foods={daylog.foods} />
            <div className="my-4"></div>
            <GroupedFoodItems foods={daylog.foods} editId={editId} />
          </li>
        ))}
      </ol>
    </div>
  );
};

export default async function Home({
  searchParams,
}: {
  searchParams: { edit?: string };
}) {
  // const session = await getServerAuthSession();
  return (
    <HydrateClient>
      <div>
        <FoodLog editId={searchParams.edit} />
      </div>
    </HydrateClient>
  );
}
