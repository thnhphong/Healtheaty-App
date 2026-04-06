export interface FoodNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar?: number;
  fiber?: number;
  salt?: number;
}

export interface PredictionResult {
  rank: number;
  class_id: string;
  class_name: string;
  confidence: number;
  percentage: number;
  nutrition?: FoodNutrition;
}

export interface ScanResponse {
  success: boolean;
  best_prediction?: PredictionResult;
  top_predictions: PredictionResult[];
  model_info?: {
    total_classes: number;
    model_type: string;
  };
  error?: string;
  message?: string;
}
