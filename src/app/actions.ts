"use server";

import { type $Enums } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { db } from "~/server/db";

export const addFoodLog = async (input: {
  foodId: string;
  servings: number;
  unit: $Enums.ServingUnit;
}) => {
  console.log("add food", input);

  await db.foodLog.create({
    data: {
      foodId: input.foodId,
      servings: input.servings,
      unit: input.unit,
      userId: "1721a159-92d3-4e02-bf59-d3dc5efdc944",
    },
  });

  revalidatePath("/");
};
