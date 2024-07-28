"use client";

import { useFormState } from "react-dom";
import { updateFoodLog } from "./actions";
import { type DayFoodLog } from "./queries";
import { calculateNutrients } from "./utils/calculateNutrients";
import { PendingSubmitButton } from "./SubmitButton";
import Link from "next/link";
import { useState } from "react";
import { $Enums } from "@prisma/client";

export const FoodLogItemEditor = ({ log }: { log: DayFoodLog["foods"][0] }) => {
  const [unit, setUnit] = useState(log.unit);
  const [servings, setServings] = useState(log.servings);
  const [state, action] = useFormState(updateFoodLog, {
    message: "",
  });

  // const sums = calculateNutrients();

  return (
    <form action={action}>
      <input type="hidden" name="id" value={log.id} />
      <input
        type="number"
        name="servings"
        defaultValue={log.servings}
        onChange={(e) => setServings(parseInt(e.target.value, 10))}
        autoFocus
        required
      />
      <select
        name="unit"
        defaultValue={log.unit}
        onChange={(e) => setUnit(e.target.value as $Enums.ServingUnit)}
        required
      >
        {Object.entries($Enums.ServingUnit).map(([key, value]) => (
          <option key={key} value={value}>
            {key}
          </option>
        ))}
      </select>
      <div>{state.message}</div>
      <div className="flex gap-2 pt-2 [&>*]:flex-1">
        <Link href="/" className="btn-alt">
          Cancel
        </Link>
        <PendingSubmitButton loadingText="Saving...">Save</PendingSubmitButton>
      </div>
    </form>
  );
};
