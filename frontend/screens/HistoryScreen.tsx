// frontend/screens/HistoryScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import { collection, query, where, getDocs, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../backend/config/firebase';
import { getAuth } from 'firebase/auth';
import { LineChart } from 'react-native-chart-kit';
import BottomNavigation from '../components/ui/BottomNavigation';
import { styles } from '../styles/HistoryScreenStyles';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import { setDoc, arrayUnion } from 'firebase/firestore';


type RootStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
  UserInfo: undefined;
  Home: undefined;
  Profile: undefined;
  EditProfile: undefined;
  Plan: undefined;
  History: undefined;
};

type HistoryScreenProps = {
  navigation: NavigationProp<RootStackParamList, 'History'>;
};

interface ScannedProduct {
  id: string;
  productName: string;
  brand: string;
  calories: number;
  servingSize: string;
  imageUrl: string;
  dateAdded: string;
  scannedAt: string;
  isFromPhoto?: boolean;
  barcode?: string;
}

interface DailyStats {
  date: string;
  totalCalories: number;
  mealCount: number;
  avgCaloriesPerMeal: number;
}

interface NutritionTrend {
  date: string;
  calories: number;
}

type FilterType = 'all' | '7days' | '30days' | 'custom';
type ViewType = 'list' | 'analytics' | 'insights';

const HistoryScreen: React.FC<HistoryScreenProps> = ({ navigation }) => {
  const [mealHistory, setMealHistory] = useState<ScannedProduct[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<ScannedProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [viewType, setViewType] = useState<ViewType>('list');
  const [isLoading, setIsLoading] = useState(false);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [nutritionTrends, setNutritionTrends] = useState<NutritionTrend[]>([]);
  const [totalMeals, setTotalMeals] = useState(0);
  const [avgDailyCalories, setAvgDailyCalories] = useState(0);
  const [mostConsumedProduct, setMostConsumedProduct] = useState<string>('');

  const route = useRoute() as { params?: { refresh?: number } };

  useFocusEffect(
    useCallback(() => {
      loadMealHistory();
    },  [route.params?.refresh])
  );
  useEffect(() => {
    loadMealHistory();
  }, []);

  useEffect(() => {
    filterAndSearchHistory();
  }, [mealHistory, searchQuery, filterType]);

  useEffect(() => {
    if (mealHistory.length > 0) {
      generateAnalytics();
    }
  }, [mealHistory]);

  const loadMealHistory = async () => {
    try {
      setIsLoading(true);
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) return;

      const scannedProductsRef = collection(db, 'scannedProducts');
      const q = query(
        scannedProductsRef,
        where('userId', '==', user.uid)
      );

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

      setMealHistory(products);
      setTotalMeals(products.length);
    } catch (error) {
      console.error('Error loading meal history:', error);
      Alert.alert('Error', 'Failed to load meal history');
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSearchHistory = () => {
    let filtered = [...mealHistory];

    // Apply date filter
    if (filterType !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filterType) {
        case '7days':
          filterDate.setDate(now.getDate() - 7);
          break;
        case '30days':
          filterDate.setDate(now.getDate() - 30);
          break;
      }

      filtered = filtered.filter(item => {
        const itemDate = new Date(item.scannedAt || item.dateAdded);
        return itemDate >= filterDate;
      });
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredHistory(filtered);
  };

  const generateAnalytics = () => {
    // Generate daily stats
    const dailyData: { [key: string]: { calories: number; count: number } } = {};
    const productCount: { [key: string]: number } = {};

    mealHistory.forEach(item => {
      const date = new Date(item.scannedAt || item.dateAdded).toDateString();
      
      if (!dailyData[date]) {
        dailyData[date] = { calories: 0, count: 0 };
      }
      
      dailyData[date].calories += item.calories;
      dailyData[date].count += 1;

      // Count products
      productCount[item.productName] = (productCount[item.productName] || 0) + 1;
    });

    // Convert to daily stats array
    const stats: DailyStats[] = Object.entries(dailyData).map(([date, data]) => ({
      date,
      totalCalories: data.calories,
      mealCount: data.count,
      avgCaloriesPerMeal: Math.round(data.calories / data.count)
    }));

    setDailyStats(stats.slice(0, 7)); // Last 7 days

    // Generate nutrition trends for chart
    const trends: NutritionTrend[] = stats.slice(0, 7).reverse().map(stat => ({
      date: new Date(stat.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      calories: stat.totalCalories
    }));

    setNutritionTrends(trends);

    // Calculate average daily calories
    const totalCalories = stats.reduce((sum, stat) => sum + stat.totalCalories, 0);
    setAvgDailyCalories(Math.round(totalCalories / Math.max(stats.length, 1)));

    // Find most consumed product
    const mostConsumed = Object.entries(productCount).reduce((max, [product, count]) => 
      count > max.count ? { product, count } : max
    , { product: '', count: 0 });

    setMostConsumedProduct(mostConsumed.product);
  };

  const deleteMealItem = async (itemId: string) => {
    Alert.alert(
      'Delete Meal',
      'Are you sure you want to delete this meal from your history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'scannedProducts', itemId));
              setMealHistory(prev => prev.filter(item => item.id !== itemId));
              Alert.alert('Success', 'Meal deleted successfully');
            } catch (error) {
              console.error('Error deleting meal:', error);
              Alert.alert('Error', 'Failed to delete meal');
            }
          }
        }
      ]
    );
  };

  const reAddMealItem = async (item: ScannedProduct) => {
    Alert.alert(
      'Re-add Meal',
      `Add "${item.productName}" to today's meal log?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add',
          onPress: async () => {
            try{
              const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
              Alert.alert('Error', 'User not authenticated');
              return;
            }

            // Get today's date in YYYY-MM-DD format
            const today = new Date().toISOString().split('T')[0];
            const diaryRef = doc(db, 'foodDiary', `${user.uid}_${today}`);

            // Prepare the item data for Firebase
            const mealItem = {
              ...item,
              userId: user.uid,
              dateAdded: new Date().toISOString(),
              scannedAt: new Date().toISOString(),
            };
            await setDoc(
              diaryRef,
              {
                userId: user.uid,
                date: today,
                foods: arrayUnion(mealItem),
                updatedAt: new Date().toISOString(),
              },
              { merge: true },  // Merge to avoid overwriting existing data
            );
              setMealHistory(prev => [mealItem, ...prev]);
              Alert.alert('Success', 'Meal added to today\'s log');
            }catch (error) {
              console.error('Error re-adding meal:', error);
              Alert.alert('Error', 'Failed to add meal to log. Please try again.');
            }
          }
        }
      ]
    );
  };

  const renderMealItem = ({ item }: { item: ScannedProduct }) => (
    <View style={styles.mealItem}>
      <View style={styles.mealItemContent}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.mealItemImage} />
        ) : (
          <View style={styles.mealItemImagePlaceholder}>
            <Ionicons name="image" size={24} color="#ccc" />
          </View>
        )}
        
        <View style={styles.mealItemInfo}>
          <Text style={styles.mealItemName}>{item.productName}</Text>
          {item.brand && <Text style={styles.mealItemBrand}>{item.brand}</Text>}
          <Text style={styles.mealItemServing}>{item.servingSize}</Text>
          <Text style={styles.mealItemDate}>
            {new Date(item.scannedAt || item.dateAdded).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>

        <View style={styles.mealItemActions}>
          <View style={styles.mealItemCalories}>
            <Text style={styles.mealItemCalorieNumber}>{item.calories}</Text>
            <Text style={styles.mealItemCalorieLabel}>kcal</Text>
          </View>
          
          <View style={styles.mealItemButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => reAddMealItem(item)}
            >
              <Ionicons name="add-circle" size={20} color="#4CAF50" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => deleteMealItem(item.id)}
            >
              <Ionicons name="trash" size={20} color="#f44336" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  const renderAnalytics = () => (
    <View style={styles.analyticsContainer}>
      {/* Stats Cards */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalMeals}</Text>
          <Text style={styles.statLabel}>Total Meals</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{avgDailyCalories}</Text>
          <Text style={styles.statLabel}>Avg Daily Calories</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{dailyStats.length}</Text>
          <Text style={styles.statLabel}>Days Logged</Text>
        </View>
      </View>

      {/* Calorie Trend Chart */}
      {nutritionTrends.length > 0 && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>7-Day Calorie Trend</Text>
          <LineChart
            data={{
              labels: nutritionTrends.map(t => t.date),
              datasets: [{
                data: nutritionTrends.map(t => t.calories),
                strokeWidth: 2,
                color: (opacity = 1) => `rgba(255, 107, 53, ${opacity})`
              }]
            }}
            width={Dimensions.get('window').width - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: { borderRadius: 16 }
            }}
            bezier
            style={styles.chart}
          />
        </View>
      )}

      {/* Most Consumed Product */}
      {mostConsumedProduct && (
        <View style={styles.insightCard}>
          <Text style={styles.insightTitle}>Most Consumed Product</Text>
          <Text style={styles.insightValue}>{mostConsumedProduct}</Text>
        </View>
      )}
    </View>
  );

  const renderFilterButtons = () => (
    <View style={styles.filterContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[
          { key: 'all', label: 'All Time' },
          { key: '7days', label: 'Last 7 Days' },
          { key: '30days', label: 'Last 30 Days' }
        ].map(filter => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterButton,
              filterType === filter.key && styles.filterButtonActive
            ]}
            onPress={() => setFilterType(filter.key as FilterType)}
          >
            <Text style={[
              styles.filterButtonText,
              filterType === filter.key && styles.filterButtonTextActive
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderViewToggle = () => (
    <View style={styles.viewToggle}>
      {[
        { key: 'list', icon: 'list' },
        { key: 'analytics', icon: 'bar-chart' },
        { key: 'insights', icon: 'bulb' }
      ].map(view => (
        <TouchableOpacity
          key={view.key}
          style={[
            styles.viewToggleButton,
            viewType === view.key && styles.viewToggleButtonActive
          ]}
          onPress={() => setViewType(view.key as ViewType)}
        >
          <Ionicons
            name={view.icon as any}
            size={20}
            color={viewType === view.key ? '#FF6B35' : '#666'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meal History</Text>
        {renderViewToggle()}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search meals..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Buttons */}
      {renderFilterButtons()}

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF6B35" />
            <Text style={styles.loadingText}>Loading meal history...</Text>
          </View>
        ) : viewType === 'analytics' ? (
          renderAnalytics()
        ) : (
          <View style={styles.mealListContainer}>
            {filteredHistory.length > 0 ? (
              <FlatList
                data={filteredHistory}
                renderItem={renderMealItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="restaurant-outline" size={64} color="#ccc" />
                <Text style={styles.emptyStateText}>No meals found</Text>
                <Text style={styles.emptyStateSubtext}>
                  {searchQuery ? 'Try adjusting your search' : 'Start scanning products to build your history'}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation navigation={navigation} />
    </SafeAreaView>
  );
};

export default HistoryScreen;