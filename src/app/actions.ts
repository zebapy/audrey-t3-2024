"use server";

import { $Enums } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "~/server/db";

export const addFoodLog = async (input: {
  foodId: string;
  servings: number;
  unit: $Enums.ServingUnit;
}) => {
  const log = await db.foodLog.create({
    data: {
      foodId: input.foodId,
      servings: input.servings,
      unit: input.unit,
      userId: "1721a159-92d3-4e02-bf59-d3dc5efdc944",
    },
  });

  redirect(`/?edit=${log.id}#${log.id}`);
};

type UpdateFoodLogState = {
  message?: string;
};

const updateFoodLogInput = z.object({
  id: z.string(),
  servings: z.string(),
  unit: z.nativeEnum($Enums.ServingUnit),
});

export const updateFoodLog = async (prev: UpdateFoodLogState, fd: FormData) => {
  const input = updateFoodLogInput.safeParse(Object.fromEntries(fd.entries()));

  if (!input.success) {
    return { message: JSON.stringify(input.error) };
  }

  const data = input.data;

  await db.foodLog.update({
    where: { id: data.id },
    data: {
      servings: parseFloat(data.servings),
      unit: data.unit,
    },
  });

  redirect("/");

  return { message: "Updated" };
};

export const deleteFoodLog = async (id: string) => {
  // FIXME: check if user is allowed to delete this log
  await db.foodLog.delete({ where: { id } });
  revalidatePath("/");
};
