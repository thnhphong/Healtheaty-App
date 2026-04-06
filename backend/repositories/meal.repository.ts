import { getFirestore } from '../data/database';
import * as admin from 'firebase-admin';

export class MealRepository {
  private db = getFirestore();

  async addToDiary(userId: string, mealData: any, dateStr: string): Promise<boolean> {
    try {
      const diaryRef = this.db.collection('foodDiary').doc(`${userId}_${dateStr}`);
      await diaryRef.set({
        userId,
        date: dateStr,
        foods: admin.firestore.FieldValue.arrayUnion(mealData),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      return true;
    } catch (error) {
      console.error('MealRepository.addToDiary Error:', error);
      return false;
    }
  }

  async saveScannedProduct(productData: any): Promise<string> {
    try {
      const docRef = await this.db.collection('scannedProducts').add(productData);
      return docRef.id;
    } catch (error) {
      console.error('MealRepository.saveScannedProduct Error:', error);
      return '';
    }
  }
}
