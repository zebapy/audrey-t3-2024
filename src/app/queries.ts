import { type Prisma } from "@prisma/client";
import { db } from "~/server/db";

export type SearchParams = {
  term?: string;
};

export function searchFood(query: SearchParams) {
  return db.openfoodfacts.findMany({
    where: {
      product_name: {
        contains: query.term?.trim(),
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      generic_name: true,
      product_name: true,
      proteins_100g: true,
      carbohydrates_100g: true,
      energy_kcal_100g: true,
      fat_100g: true,
    },
    take: 10,
  });
}

export type FoodResult = Prisma.PromiseReturnType<typeof searchFood>[number];

export const getFoodLogs = async () => {
  // FIXME: get by user in session ID
  return db.foodLog.findMany({
    select: {
      id: true,
      foodId: true,
      servings: true,
      unit: true,
      createdAt: true,
      food: {
        select: {
          product_name: true,
          generic_name: true,
          proteins_100g: true,
          carbohydrates_100g: true,
          energy_kcal_100g: true,
          fat_100g: true,
          image_small_url: true,
        },
      },
    },
  });
};

export type FoodLog = Prisma.PromiseReturnType<typeof getFoodLogs>[number];
