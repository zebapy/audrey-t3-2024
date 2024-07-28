import { type Prisma } from "@prisma/client";
import { db } from "~/server/db";

export type SearchParams = {
  term?: string;
  code?: string;
};

export function searchFood(query: SearchParams) {
  const term = query.term?.trim();
  const code = query.code?.trim();

  const where: Prisma.openfoodfactsWhereInput = {};

  if (term) {
    where.product_name = {
      contains: term,
      mode: "insensitive",
    };
  }

  if (code) {
    where.code = parseInt(code);
  }

  return db.openfoodfacts.findMany({
    where,
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
