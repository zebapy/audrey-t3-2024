import { type FoodLogWithFood } from "../queries";

export type NutrientsOverview = {
  protein: number;
  fat: number;
  carbs: number;
  kcals: number;
};

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

  console.warn("Unknown unit", log.unit);
  return {
    carbs: 0,
    protein: 0,
    fat: 0,
    kcals: 0,
  };
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
