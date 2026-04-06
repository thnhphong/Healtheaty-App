export interface VietnameseFoodPrediction {
  rank: number;
  class_id: string;
  class_name: string;
  confidence: number;
  percentage: number;
}

export interface VietnameseFoodAPIResponse {
  success: boolean;
  best_prediction: {
    food_name: string;
    confidence: number;
    percentage: number;
  };
  top_predictions: VietnameseFoodPrediction[];
  model_info: {
    total_classes: number;
    model_type: string;
    tensorflow_version: string;
  };
  error?: string;
  message?: string;
}

export interface ScannedProduct {
  id?: string;
  userId?: string;
  barcode?: string;
  productName: string;
  brand?: string;
  caloriesPer100g?: number;
  caloriesPerServing?: number;
  calories: number;
  nutrients?: {
    fat: number;
    carbs: number;
    protein: number;
    sugar: number;
    fiber: number;
    salt: number;
  };
  nutrientsPerServing?: {
    fat: number;
    carbs: number;
    protein: number;
    sugar: number;
    fiber: number;
    salt: number;
  };
  imageUrl: string;
  ingredients?: string;
  servingSize: string;
  nutriScore?: string;
  isFromPhoto?: boolean;
  confidence?: number;
  isVietnameseFood?: boolean;
  allPredictions?: VietnameseFoodPrediction[];
  dateAdded?: string;
  scannedAt?: string;
}
