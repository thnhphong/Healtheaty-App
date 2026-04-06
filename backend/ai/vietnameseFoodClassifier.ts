import axios from 'axios';
import { settings } from '../config/settings';
import { PredictionResult } from '../types/food.types';

export class VietnameseFoodClassifier {
  private readonly AI_SERVICE_URL = settings.AI_SERVICE_URL;

  async classify(imageUri: string): Promise<PredictionResult[]> {
    try {
      console.log('🍜 Forwarding image to AI classification service...');
      
      const response = await axios.post(`${this.AI_SERVICE_URL}/predict`, {
        image: imageUri,
        top_k: 5
      }, { timeout: 30000 });

      if (response.status === 200) {
        return response.data.all_results || response.data.top_predictions;
      }
      
      throw new Error(`AI_SERVICE_ERROR_${response.status}`);
    } catch (error: any) {
      console.error('❌ AI classification failed:', error.message);
      // Fallback: This allows the backend to work even if the heavy AI is down
      return [{
        rank: 1,
        class_id: 'unknown',
        class_name: 'Vietnamese Food Item',
        confidence: 0.0,
        percentage: 0
      }];
    }
  }
}
