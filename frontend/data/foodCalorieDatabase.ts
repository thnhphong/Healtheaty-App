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
  "pho": {
    calories: 350,
    servingSize: "1 bowl (500g)",
    category: "Vietnamese Cuisine",
    nutrients: { protein: 20, carbs: 45, fat: 8, fiber: 3 }
  },
  "banh mi": {
    calories: 450,
    servingSize: "1 sandwich (200g)",
    category: "Vietnamese Cuisine",
    nutrients: { protein: 18, carbs: 55, fat: 15, fiber: 4 }
  },
  "bun bo hue": {
    calories: 420,
    servingSize: "1 bowl (500g)",
    category: "Vietnamese Cuisine",
    nutrients: { protein: 25, carbs: 50, fat: 12, fiber: 3 }
  },
  "com tam": {
    calories: 550,
    servingSize: "1 plate (350g)",
    category: "Vietnamese Cuisine",
    nutrients: { protein: 30, carbs: 60, fat: 18, fiber: 2 }
  },
  "goi cuon": {
    calories: 120,
    servingSize: "2 rolls (100g)",
    category: "Vietnamese Cuisine",
    nutrients: { protein: 8, carbs: 15, fat: 3, fiber: 2 }
  },
  "banh xeo": {
    calories: 380,
    servingSize: "1 pancake (200g)",
    category: "Vietnamese Cuisine",
    nutrients: { protein: 12, carbs: 45, fat: 16, fiber: 3 }
  },
  "bun cha": {
    calories: 480,
    servingSize: "1 serving (400g)",
    category: "Vietnamese Cuisine",
    nutrients: { protein: 28, carbs: 52, fat: 15, fiber: 4 }
  },
  "ca kho to": {
    calories: 320,
    servingSize: "1 serving (200g)",
    category: "Vietnamese Cuisine",
    nutrients: { protein: 35, carbs: 12, fat: 15, fiber: 1 }
  },
  "nem nuong": {
    calories: 280,
    servingSize: "4 pieces (150g)",
    category: "Vietnamese Cuisine",
    nutrients: { protein: 22, carbs: 18, fat: 12, fiber: 1 }
  },
  
  // Fruits
  "apple": {
    calories: 95,
    servingSize: "1 medium (182g)",
    category: "Fruits",
    nutrients: { protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4 }
  },
  "banana": {
    calories: 105,
    servingSize: "1 medium (118g)",
    category: "Fruits",
    nutrients: { protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1 }
  },
  "orange": {
    calories: 62,
    servingSize: "1 medium (154g)",
    category: "Fruits",
    nutrients: { protein: 1.2, carbs: 15.4, fat: 0.2, fiber: 3.1 }
  },
  "mango": {
    calories: 201,
    servingSize: "1 cup sliced (165g)",
    category: "Fruits",
    nutrients: { protein: 1.4, carbs: 50, fat: 0.6, fiber: 2.6 }
  },
  "watermelon": {
    calories: 46,
    servingSize: "1 cup diced (152g)",
    category: "Fruits",
    nutrients: { protein: 0.9, carbs: 11.5, fat: 0.2, fiber: 0.6 }
  },
  "dragon fruit": {
    calories: 60,
    servingSize: "1 fruit (200g)",
    category: "Fruits",
    nutrients: { protein: 1.2, carbs: 13, fat: 0.4, fiber: 3 }
  },
  "durian": {
    calories: 357,
    servingSize: "1 cup (243g)",
    category: "Fruits",
    nutrients: { protein: 3.6, carbs: 66, fat: 13, fiber: 9.2 }
  },
  "rambutan": {
    calories: 75,
    servingSize: "100g",
    category: "Fruits",
    nutrients: { protein: 0.7, carbs: 16, fat: 0.2, fiber: 0.9 }
  },
  
  // Vegetables
  "broccoli": {
    calories: 55,
    servingSize: "1 cup chopped (156g)",
    category: "Vegetables",
    nutrients: { protein: 3.7, carbs: 11.2, fat: 0.6, fiber: 5.1 }
  },
  "carrot": {
    calories: 41,
    servingSize: "1 cup chopped (128g)",
    category: "Vegetables",
    nutrients: { protein: 0.9, carbs: 9.6, fat: 0.2, fiber: 2.8 }
  },
  "spinach": {
    calories: 23,
    servingSize: "1 cup (100g)",
    category: "Vegetables",
    nutrients: { protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2 }
  },
  "tomato": {
    calories: 18,
    servingSize: "1 medium (123g)",
    category: "Vegetables",
    nutrients: { protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2 }
  },
  "cucumber": {
    calories: 16,
    servingSize: "1 cup sliced (119g)",
    category: "Vegetables",
    nutrients: { protein: 0.8, carbs: 3.6, fat: 0.1, fiber: 0.5 }
  },
  "bell pepper": {
    calories: 31,
    servingSize: "1 medium (119g)",
    category: "Vegetables",
    nutrients: { protein: 1.2, carbs: 7.2, fat: 0.4, fiber: 2.5 }
  },
  
  // Proteins
  "chicken breast": {
    calories: 165,
    servingSize: "100g cooked",
    category: "Proteins",
    nutrients: { protein: 31, carbs: 0, fat: 3.6, fiber: 0 }
  },
  "beef": {
    calories: 250,
    servingSize: "100g cooked",
    category: "Proteins",
    nutrients: { protein: 26, carbs: 0, fat: 15, fiber: 0 }
  },
  "pork": {
    calories: 242,
    servingSize: "100g cooked",
    category: "Proteins",
    nutrients: { protein: 27, carbs: 0, fat: 14, fiber: 0 }
  },
  "salmon": {
    calories: 206,
    servingSize: "100g cooked",
    category: "Proteins",
    nutrients: { protein: 22, carbs: 0, fat: 13, fiber: 0 }
  },
  "shrimp": {
    calories: 99,
    servingSize: "100g cooked",
    category: "Proteins",
    nutrients: { protein: 24, carbs: 0.2, fat: 0.3, fiber: 0 }
  },
  "egg": {
    calories: 78,
    servingSize: "1 large (50g)",
    category: "Proteins",
    nutrients: { protein: 6.3, carbs: 0.6, fat: 5.3, fiber: 0 }
  },
  "tofu": {
    calories: 76,
    servingSize: "100g",
    category: "Proteins",
    nutrients: { protein: 8, carbs: 1.9, fat: 4.8, fiber: 0.3 }
  },
  
  // Grains and Carbs
  "white rice": {
    calories: 206,
    servingSize: "1 cup cooked (158g)",
    category: "Grains",
    nutrients: { protein: 4.3, carbs: 45, fat: 0.4, fiber: 0.6 }
  },
  "brown rice": {
    calories: 216,
    servingSize: "1 cup cooked (195g)",
    category: "Grains",
    nutrients: { protein: 5, carbs: 45, fat: 1.8, fiber: 3.5 }
  },
  "bread": {
    calories: 79,
    servingSize: "1 slice (30g)",
    category: "Grains",
    nutrients: { protein: 2.7, carbs: 14.7, fat: 1, fiber: 0.8 }
  },
  "pasta": {
    calories: 221,
    servingSize: "1 cup cooked (157g)",
    category: "Grains",
    nutrients: { protein: 8.1, carbs: 43, fat: 1.3, fiber: 2.5 }
  },
  "noodles": {
    calories: 220,
    servingSize: "1 cup cooked (160g)",
    category: "Grains",
    nutrients: { protein: 8, carbs: 40, fat: 3.5, fiber: 2 }
  },
  
  // Fast Food
  "pizza": {
    calories: 285,
    servingSize: "1 slice (107g)",
    category: "Fast Food",
    nutrients: { protein: 12, carbs: 36, fat: 10, fiber: 2.5 }
  },
  "hamburger": {
    calories: 354,
    servingSize: "1 burger (110g)",
    category: "Fast Food",
    nutrients: { protein: 20, carbs: 29, fat: 17, fiber: 1.5 }
  },
  "french fries": {
    calories: 365,
    servingSize: "1 medium (117g)",
    category: "Fast Food",
    nutrients: { protein: 4, carbs: 48, fat: 17, fiber: 4.4 }
  },
  "hot dog": {
    calories: 314,
    servingSize: "1 sandwich (98g)",
    category: "Fast Food",
    nutrients: { protein: 11, carbs: 24, fat: 19, fiber: 1 }
  },
  "fried chicken": {
    calories: 320,
    servingSize: "1 piece (140g)",
    category: "Fast Food",
    nutrients: { protein: 28, carbs: 15, fat: 16, fiber: 0.5 }
  },
  
  // Beverages
  "coffee": {
    calories: 2,
    servingSize: "1 cup (240ml)",
    category: "Beverages",
    nutrients: { protein: 0.3, carbs: 0, fat: 0.1, fiber: 0 }
  },
  "tea": {
    calories: 2,
    servingSize: "1 cup (240ml)",
    category: "Beverages",
    nutrients: { protein: 0, carbs: 0.7, fat: 0, fiber: 0 }
  },
  "milk tea": {
    calories: 250,
    servingSize: "1 cup (350ml)",
    category: "Beverages",
    nutrients: { protein: 3, carbs: 45, fat: 6, fiber: 0 }
  },
  "orange juice": {
    calories: 110,
    servingSize: "1 cup (240ml)",
    category: "Beverages",
    nutrients: { protein: 1.7, carbs: 26, fat: 0.5, fiber: 0.5 }
  },
  "coconut water": {
    calories: 45,
    servingSize: "1 cup (240ml)",
    category: "Beverages",
    nutrients: { protein: 1.7, carbs: 8.9, fat: 0.5, fiber: 2.6 }
  },
  "sugarcane juice": {
    calories: 180,
    servingSize: "1 cup (240ml)",
    category: "Beverages",
    nutrients: { protein: 0.2, carbs: 45, fat: 0.1, fiber: 0.2 }
  },
  
  // Desserts
  "ice cream": {
    calories: 137,
    servingSize: "1/2 cup (66g)",
    category: "Desserts",
    nutrients: { protein: 2.3, carbs: 16, fat: 7.3, fiber: 0.5 }
  },
  "chocolate": {
    calories: 155,
    servingSize: "1 oz (28g)",
    category: "Desserts",
    nutrients: { protein: 1.4, carbs: 17, fat: 9, fiber: 1.7 }
  },
  "cake": {
    calories: 424,
    servingSize: "1 slice (125g)",
    category: "Desserts",
    nutrients: { protein: 4.4, carbs: 58, fat: 20, fiber: 1.5 }
  },
  "donut": {
    calories: 195,
    servingSize: "1 medium (45g)",
    category: "Desserts",
    nutrients: { protein: 2.4, carbs: 22, fat: 11, fiber: 0.9 }
  },
  "che": {
    calories: 180,
    servingSize: "1 cup (200g)",
    category: "Desserts",
    nutrients: { protein: 3, carbs: 38, fat: 2.5, fiber: 2 }
  },
  
  // Default for unrecognized foods
  "food": {
    calories: 100,
    servingSize: "100g",
    category: "General"
  },
  "meal": {
    calories: 400,
    servingSize: "1 serving",
    category: "General"
  },
  "snack": {
    calories: 150,
    servingSize: "1 serving",
    category: "General"
  },
  "dish": {
    calories: 350,
    servingSize: "1 plate",
    category: "General"
  }
};