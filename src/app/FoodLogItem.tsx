"use client";
import {
  Pencil,
  PencilSimple,
  Trash,
  TrashSimple,
} from "@phosphor-icons/react/dist/ssr";
import { type DayFoodLog } from "./queries";
import { deleteFoodLog } from "./actions";
import Link from "next/link";
import { FoodLogItemEditor } from "./FoodLogItemEditor";

const DeleteFoodLogButton = ({ id }: { id: string }) => {
  return (
    <button
      onClick={async () => {
        await deleteFoodLog(id);
      }}
      className="inline-block rounded bg-gray-100 p-2 text-red-500"
    >
      <Trash />
    </button>
  );
};

export const FoodLogItem = ({
  log,
  editing,
}: {
  log: DayFoodLog["foods"][0];
  editing: boolean;
}) => {
  return (
    <div className="group flex justify-between p-2" id={`food-${log.id}`}>
      <div className="">
        <h4 className="font-medium">{log.food.product_name}</h4>
        {editing ? (
          <FoodLogItemEditor log={log} />
        ) : (
          <Link
            href={`/?edit=${log.id}`}
            className="flex gap-2 text-sm text-gray-500"
          >
            {log.servings} {log.unit} <PencilSimple />
          </Link>
        )}
      </div>
      <div className="invisible group-focus-within:visible group-hover:visible">
        <DeleteFoodLogButton id={log.id} />
      </div>
    </div>
  );
};
