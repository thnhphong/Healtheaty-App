import * as admin from 'firebase-admin';
import { getFirestore } from '../data/database';

export class FoodRepository {
  private db = getFirestore();

  async getNutritionInfo(foodId: string) {
    const doc = await this.db.collection('nutritionData').doc(foodId).get();
    return doc.exists ? doc.data() : null;
  }

  async getAllFoods() {
    const snapshot = await this.db.collection('nutritionData').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}
