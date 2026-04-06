import { NutritionService } from '../services/nutrition.service';

export class QRProductLookup {
  private nutritionService = new NutritionService();

  async lookup(barcode: string) {
    console.log(`🔍 Looking up product for barcode: ${barcode}`);
    const product = await this.nutritionService.fetchFromOpenFoodFacts(barcode);
    
    if (!product) return null;

    // Map OpenFoodFacts product to our internal Food model
    return {
      id: barcode,
      name: product.product_name || 'Unknown Product',
      brand: product.brands || '',
      calories: product.nutriments?.['energy-kcal_100g'] || 0,
      imageUrl: product.image_url || '',
      nutrients: {
        fat: product.nutriments?.fat_100g || 0,
        carbs: product.nutriments?.carbohydrates_100g || 0,
        protein: product.nutriments?.proteins_100g || 0,
      }
    };
  }
}
