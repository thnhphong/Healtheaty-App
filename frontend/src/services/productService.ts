import { db } from './firebase';
import { collection, addDoc, doc, setDoc, arrayUnion } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import * as FileSystem from 'expo-file-system';
import { VietnameseFoodAPIResponse, ScannedProduct, VietnameseFoodPrediction } from '../types/product';
import { vietnameseFoodNutrition } from '../constants/foodCalorieDatabase';

const VIETNAMESE_FOOD_API_URL = 'http://10.11.73.47:8000';

export class ProductService {
  async analyzeVietnameseFood(imageUri: string, isMounted: boolean): Promise<VietnameseFoodAPIResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); 

    try {
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: 'base64' as any, // Using 'base64' string directly to avoid FileSystem.EncodingType issues
      });

      const response = await fetch(`${VIETNAMESE_FOOD_API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, top_k: 5 }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      if (!isMounted) throw new Error('Component unmounted');
      if (!response.ok) throw new Error(`API_ERROR_${response.status}`);

      return await response.json();
    } catch (error: any) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async fetchProductByBarcode(barcode: string): Promise<ScannedProduct | null> {
    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await response.json();
      if (data.status === 1 && data.product) {
        const p = data.product;
        const n = p.nutriments || {};
        const getNum = (v: any) => (typeof v === 'number' ? v : parseFloat(v) || 0);

        return {
          barcode,
          productName: p.product_name || 'Unknown',
          brand: p.brands || '',
          imageUrl: p.image_url || '',
          calories: Math.round(getNum(n['energy-kcal_serving']) || getNum(n['energy-kcal_100g']) || 0),
          servingSize: p.serving_size || '100g',
          nutrients: {
            fat: getNum(n.fat_100g),
            carbs: getNum(n.carbohydrates_100g),
            protein: getNum(n.proteins_100g),
            sugar: getNum(n.sugars_100g),
            fiber: getNum(n.fiber_100g),
            salt: getNum(n.salt_100g),
          }
        };
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  async saveProduct(product: ScannedProduct): Promise<void> {
    const auth = getAuth();
    if (!auth.currentUser) throw new Error('Not authenticated');
    const uid = auth.currentUser.uid;
    const now = new Date();
    const productData = { ...product, userId: uid, scannedAt: now.toISOString() };

    await addDoc(collection(db, 'scannedProducts'), productData);
    const today = now.toISOString().split('T')[0];
    await setDoc(doc(db, 'foodDiary', `${uid}_${today}`), {
      userId: uid,
      date: today,
      foods: arrayUnion(productData),
    }, { merge: true });
  }

  createVietnameseFoodProduct(pred: VietnameseFoodPrediction, all: VietnameseFoodPrediction[], img: string): ScannedProduct {
    const info = (vietnameseFoodNutrition as any)[pred.class_id] || { calories: 200, protein: 10, carbs: 30, fat: 5 };
    return {
      productName: pred.class_name,
      calories: info.calories,
      imageUrl: img,
      isFromPhoto: true,
      isVietnameseFood: true,
      confidence: pred.confidence,
      allPredictions: all,
      servingSize: '1 phần',
      nutrients: { fat: info.fat, carbs: info.carbs, protein: info.protein, sugar: 0, fiber: 0, salt: 0 }
    };
  }
}

export const productService = new ProductService();
