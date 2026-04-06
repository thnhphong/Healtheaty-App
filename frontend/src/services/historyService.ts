import { db } from './firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { ScannedProduct } from '../types/product';

export class HistoryService {
  async getUserMealHistory(): Promise<ScannedProduct[]> {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return [];

    const scannedProductsRef = collection(db, 'scannedProducts');
    const q = query(scannedProductsRef, where('userId', '==', user.uid));
    const querySnapshot = await getDocs(q);
    
    const products: ScannedProduct[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      products.push({
        id: doc.id,
        productName: data.productName || 'Unknown Product',
        brand: data.brand || '',
        calories: data.calories || 0,
        servingSize: data.servingSize || '1 serving',
        imageUrl: data.imageUrl || '',
        dateAdded: data.dateAdded || '',
        scannedAt: data.scannedAt || '',
        isFromPhoto: data.isFromPhoto || false,
        barcode: data.barcode || ''
      });
    });

    return products;
  }

  async deleteMealItem(itemId: string): Promise<void> {
    await deleteDoc(doc(db, 'scannedProducts', itemId));
  }
}

export const historyService = new HistoryService();
