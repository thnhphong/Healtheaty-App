import axios from 'axios';
import { settings } from '../config/settings';
import { FoodNutrition } from '../types/food.types';

export class NutritionService {
  private readonly vietnameseFoodNutrition: Record<string, FoodNutrition> = {
    'banh_beo': { calories: 180, protein: 8, carbs: 30, fat: 3 },
    'banh_bot_loc': { calories: 220, protein: 6, carbs: 45, fat: 2 },
    'banh_can': { calories: 250, protein: 10, carbs: 35, fat: 7 },
    'banh_canh': { calories: 350, protein: 15, carbs: 50, fat: 10 },
    'banh_chung': { calories: 400, protein: 12, carbs: 60, fat: 10 },
    'banh_cuon': { calories: 300, protein: 10, carbs: 55, fat: 5 },
    'banh_duc': { calories: 150, protein: 4, carbs: 30, fat: 1 },
    'banh_gio': { calories: 280, protein: 8, carbs: 40, fat: 10 },
    'banh_khot': { calories: 320, protein: 12, carbs: 40, fat: 15 },
    'banh_mi': { calories: 350, protein: 10, carbs: 50, fat: 12 },
    'banh_pia': { calories: 450, protein: 5, carbs: 70, fat: 18 },
    'banh_tet': { calories: 400, protein: 12, carbs: 60, fat: 10 },
    'banh_trang_nuong': { calories: 200, protein: 5, carbs: 30, fat: 7 },
    'banh_xeo': { calories: 350, protein: 12, carbs: 45, fat: 15 },
    'bun_bo_hue': { calories: 500, protein: 25, carbs: 60, fat: 18 },
    'bun_dau_mam_tom': { calories: 600, protein: 30, carbs: 70, fat: 20 },
    'bun_mam': { calories: 450, protein: 20, carbs: 60, fat: 15 },
    'bun_rieu': { calories: 400, protein: 18, carbs: 55, fat: 12 },
    'bun_thit_nuong': { calories: 550, protein: 22, carbs: 65, fat: 20 },
    'ca_kho_to': { calories: 300, protein: 25, carbs: 5, fat: 20 },
    'canh_chua': { calories: 150, protein: 15, carbs: 10, fat: 5 },
    'cao_lau': { calories: 450, protein: 20, carbs: 60, fat: 12 },
    'chao_long': { calories: 350, protein: 18, carbs: 40, fat: 15 },
    'com_tam': { calories: 650, protein: 35, carbs: 80, fat: 22 },
    'goi_cuon': { calories: 150, protein: 12, carbs: 20, fat: 3 },
    'hu_tieu': { calories: 400, protein: 18, carbs: 55, fat: 10 },
    'mi_quang': { calories: 450, protein: 20, carbs: 60, fat: 12 },
    'nem_chua': { calories: 100, protein: 15, carbs: 2, fat: 4 },
    'pho': { calories: 450, protein: 25, carbs: 65, fat: 10 },
    'xoi_xeo': { calories: 500, protein: 10, carbs: 80, fat: 15 },
  };

  getNutritionByFoodId(foodId: string): FoodNutrition {
    return this.vietnameseFoodNutrition[foodId] || {
      calories: 200, protein: 10, carbs: 30, fat: 5
    };
  }

  async fetchFromOpenFoodFacts(barcode: string): Promise<any | null> {
    try {
      const url = `${settings.OPEN_FOOD_FACTS_API}/product/${barcode}.json`;
      const response = await axios.get(url, { timeout: 5000 });
      if (response.status === 200 && response.data?.status === 1) {
        return response.data.product;
      }
      return null;
    } catch (error) {
      console.error('fetchFromOpenFoodFacts Error:', error);
      return null;
    }
  }
}
