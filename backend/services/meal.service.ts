import { MealRepository } from '../repositories/meal.repository';
import { getFirestore } from '../data/database';

export class MealService {
  private mealRepository = new MealRepository();
  private db = getFirestore();

  async getHistory(userId: string) {
    const productsSnapshot = await this.db.collection('scannedProducts')
      .where('userId', '==', userId)
      .orderBy('scannedAt', 'desc')
      .get();
    
    return productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  async deleteMeal(mealId: string) {
    await this.db.collection('scannedProducts').doc(mealId).delete();
    return { success: true };
  }

  async getDailyLog(userId: string, dateStr: string) {
    const diaryRef = this.db.collection('foodDiary').doc(`${userId}_${dateStr}`);
    const doc = await diaryRef.get();
    return doc.exists ? doc.data() : { foods: [], userId, date: dateStr };
  }
}
