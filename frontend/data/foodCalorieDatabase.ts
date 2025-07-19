// frontend/data/foodCalorieDatabase.ts

interface FoodItem {
  calories: number;
  servingSize: string;
  category: string;
  nutrients?: {
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
  };
}

export const foodCalorieDatabase: Record<string, FoodItem> = {
  // Vietnamese Foods
  "Banh loc": {
    calories: 200,
    servingSize: "4 pieces (120g)",
    category: "Vietnamese Cuisine",
    nutrients: { protein: 8, carbs: 35, fat: 3, fiber: 2 }
  },
  "banh xeo": {
    calories: 380,
    servingSize: "1 pancake (200g)",
    category: "Vietnamese Cuisine",
    nutrients: { protein: 12, carbs: 45, fat: 16, fiber: 3 }
  },
  "chao long": {
    calories: 280,
    servingSize: "1 bowl (400g)",
    category: "Vietnamese Cuisine",
    nutrients: { protein: 18, carbs: 25, fat: 12, fiber: 1 }
  },
  "Chuoi": {
    calories: 105,
    servingSize: "1 medium (118g)",
    category: "Vietnamese Cuisine",
    nutrients: { protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1 }
  },
  "Com tam": {
    calories: 550,
    servingSize: "1 plate (350g)",
    category: "Vietnamese Cuisine",
    nutrients: { protein: 30, carbs: 60, fat: 18, fiber: 2 }
  },
  "Kiwi": {
    calories: 61,
    servingSize: "1 medium (76g)",
    category: "Fruits",
    nutrients: { protein: 1.1, carbs: 15, fat: 0.5, fiber: 3 }
  },
  "Pho": {
    calories: 350,
    servingSize: "1 bowl (500g)",
    category: "Vietnamese Cuisine",
    nutrients: { protein: 20, carbs: 45, fat: 8, fiber: 3 }
  },
  "Quyt": {
    calories: 47,
    servingSize: "1 medium (84g)",
    category: "Fruits",
    nutrients: { protein: 0.9, carbs: 11.7, fat: 0.1, fiber: 2.3 }
  },
  "Trai bo": {
    calories: 234,
    servingSize: "1 medium (150g)",
    category: "Fruits",
    nutrients: { protein: 2.9, carbs: 12, fat: 21, fiber: 10 }
  }
};