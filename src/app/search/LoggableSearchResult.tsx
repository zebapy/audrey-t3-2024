"use client";
import { useFormState } from "react-dom";
import { addFoodLog } from "../actions";
import { type FoodResult } from "../queries";
import { useState } from "react";
import { redirect } from "next/navigation";

export const LoggableSearchResult = ({ food }: { food: FoodResult }) => {
  const [open, setOpen] = useState(false);

  const addFoodLogEntry = async () => {
    await addFoodLog({
      foodId: food.id,
      servings: 100,
      unit: "GRAM",
    });
  };

  return (
    <div>
      <button
        className="rounded border p-2 text-left hover:bg-gray-100"
        type="submit"
        onClick={addFoodLogEntry}
      >
        <h3>{food.product_name}</h3>

        <ul className="flex gap-1 text-xs">
          <li className="text-cyan-500">{food.proteins_100g}p</li>
          <li className="text-amber-500">{food.carbohydrates_100g}cb</li>
          <li className="text-red-500">{food.fat_100g}f</li>
          <li className="text-gray-500">{food.energy_kcal_100g}kcal</li>
        </ul>
      </button>
    </div>
  );
};
