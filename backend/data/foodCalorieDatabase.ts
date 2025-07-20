// Vietnamese food nutrition database
export interface VietnameseFoodNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export const vietnameseFoodNutrition: Record<string, VietnameseFoodNutrition> = {
  'banh_beo': { calories: 150, protein: 3, carbs: 30, fat: 2 },
  'banh_bot_loc': { calories: 180, protein: 4, carbs: 35, fat: 3 },
  'banh_can': { calories: 120, protein: 8, carbs: 15, fat: 4 },
  'banh_canh': { calories: 250, protein: 12, carbs: 45, fat: 5 },
  'banh_chung': { calories: 320, protein: 8, carbs: 50, fat: 12 },
  'banh_cuon': { calories: 200, protein: 10, carbs: 35, fat: 4 },
  'banh_duc': { calories: 100, protein: 2, carbs: 22, fat: 1 },
  'banh_gio': { calories: 180, protein: 8, carbs: 25, fat: 6 },
  'banh_khot': { calories: 160, protein: 6, carbs: 20, fat: 7 },
  'banh_mi': { calories: 400, protein: 15, carbs: 50, fat: 15 },
  'banh_pia': { calories: 300, protein: 5, carbs: 55, fat: 8 },
  'banh_tet': { calories: 310, protein: 7, carbs: 48, fat: 11 },
  'banh_trang_nuong': { calories: 200, protein: 4, carbs: 40, fat: 3 },
  'banh_xeo': { calories: 350, protein: 12, carbs: 30, fat: 20 },
  'bun_bo_hue': { calories: 450, protein: 25, carbs: 55, fat: 15 },
  'bun_dau_mam_tom': { calories: 380, protein: 18, carbs: 45, fat: 14 },
  'bun_mam': { calories: 420, protein: 22, carbs: 50, fat: 12 },
  'bun_rieu': { calories: 400, protein: 20, carbs: 48, fat: 12 },
  'bun_thit_nuong': { calories: 450, protein: 25, carbs: 50, fat: 15 },
  'ca_kho_to': { calories: 300, protein: 30, carbs: 8, fat: 15 },
  'canh_chua': { calories: 120, protein: 15, carbs: 8, fat: 3 },
  'cao_lau': { calories: 380, protein: 15, carbs: 55, fat: 10 },
  'chao_long': { calories: 250, protein: 18, carbs: 25, fat: 8 },
  'com_tam': { calories: 500, protein: 20, carbs: 70, fat: 12 },
  'goi_cuon': { calories: 150, protein: 8, carbs: 20, fat: 4 },
  'hu_tieu': { calories: 350, protein: 18, carbs: 50, fat: 8 },
  'mi_quang': { calories: 420, protein: 22, carbs: 55, fat: 12 },
  'nem_chua': { calories: 180, protein: 12, carbs: 8, fat: 10 },
  'pho': { calories: 400, protein: 20, carbs: 50, fat: 10 },
  'xoi_xeo': { calories: 280, protein: 6, carbs: 50, fat: 6 }
};