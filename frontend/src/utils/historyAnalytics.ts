import { ScannedProduct } from '../types/product';

export interface DailyStats {
  date: string;
  totalCalories: number;
  mealCount: number;
  avgCaloriesPerMeal: number;
}

export interface NutritionTrend {
  date: string;
  calories: number;
}

export const generateHistoryAnalytics = (mealHistory: ScannedProduct[]) => {
  const dailyData: { [key: string]: { calories: number; count: number } } = {};
  const productCount: { [key: string]: number } = {};

  mealHistory.forEach(item => {
    const date = new Date(item.scannedAt || item.dateAdded || '').toDateString();
    
    if (!dailyData[date]) {
      dailyData[date] = { calories: 0, count: 0 };
    }
    
    dailyData[date].calories += item.calories || 0;
    dailyData[date].count += 1;

    if (item.productName) {
        productCount[item.productName] = (productCount[item.productName] || 0) + 1;
    }
  });

  const stats: DailyStats[] = Object.entries(dailyData).map(([date, data]) => ({
    date,
    totalCalories: data.calories,
    mealCount: data.count,
    avgCaloriesPerMeal: Math.round(data.calories / data.count)
  }));

  const sortedStats = stats.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const trends: NutritionTrend[] = sortedStats.slice(0, 7).reverse().map(stat => ({
    date: new Date(stat.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    calories: stat.totalCalories
  }));

  const totalCalories = stats.reduce((sum, stat) => sum + stat.totalCalories, 0);
  const avgDailyCalories = Math.round(totalCalories / Math.max(stats.length, 1));

  const mostConsumed = Object.entries(productCount).reduce((max, [product, count]) => 
    count > max.count ? { product, count } : max
  , { product: '', count: 0 });

  return {
    dailyStats: sortedStats.slice(0, 7),
    nutritionTrends: trends,
    avgDailyCalories,
    mostConsumedProduct: mostConsumed.product
  };
};
