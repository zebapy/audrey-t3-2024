import { type Prisma, FoodLog } from "@prisma/client";
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

type NutrientsOverview = {
  protein: number;
  fat: number;
  carbs: number;
  kcals: number;
};

const getFoodLogs = async ({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}) => {
  return db.foodLog.findMany({
    select: {
      id: true,
      foodId: true,
      servings: true,
      unit: true,
      createdAt: true,
      group: true,
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
    where: {
      createdAt: {
        gte: startDate,
        lt: endDate,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

export type FoodLogWithFood = Prisma.PromiseReturnType<
  typeof getFoodLogs
>[number];

/**
 * Given a food log and its food, calculate the nutrients
 * based on the servings and the food's nutrients per 100g.
 */
export const calculateNutrients = (log: FoodLogWithFood): NutrientsOverview => {
  if (log.unit === "GRAM") {
    const servingUnit = log.servings / 100;
    return {
      carbs: Math.ceil((log.food.carbohydrates_100g ?? 0) * servingUnit),
      protein: Math.ceil((log.food.proteins_100g ?? 0) * servingUnit),
      fat: Math.ceil((log.food.fat_100g ?? 0) * servingUnit),
      kcals: Math.ceil((log.food.energy_kcal_100g ?? 0) * servingUnit),
    };
  }

  throw new Error("only grams are supported");
};

export const sumNutrientsForFoods = (
  foods: FoodLogWithFood[],
): NutrientsOverview => {
  return foods.reduce(
    (acc, food) => {
      const nutrients = calculateNutrients(food);
      acc.carbs += nutrients.carbs;
      acc.protein += nutrients.protein;
      acc.fat += nutrients.fat;
      acc.kcals += nutrients.kcals;
      return acc;
    },
    {
      carbs: 0,
      protein: 0,
      fat: 0,
      kcals: 0,
    },
  );
};

export type DayFoodLog = {
  date: Date;
  // nutrients: NutrientsOverview;
  // eaten: number;
  // goal: number;
  // burned: number;
  foods: FoodLogWithFood[];
};

export const getFoodLogsByDays = async ({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}): Promise<DayFoodLog[]> => {
  const allLogs = await getFoodLogs({ startDate, endDate });

  // FIXME: get by user in session ID
  // group by day via createdAt date
  const logsByDay = allLogs.reduce(
    (acc, log) => {
      const date = log.createdAt.toDateString();
      acc[date] ??= [];
      acc[date].push(log);
      return acc;
    },
    {} as Record<string, FoodLogWithFood[]>,
  );

  return Object.entries(logsByDay).map(([date, foods]) => {
    return {
      date: new Date(date),
      foods,
    };
  });
};
