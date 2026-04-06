import Colors from '../../constants/Colors';
// frontend/screens/HomeScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import { styles } from '../styles/HomeScreenStyles';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../backend/config/firebase';
import { getAuth } from 'firebase/auth';
//circular calorie progrss from components/ui
import CircularCalorieProgress from '../components/ui/CircularCalorieProgress';
//bottom nav
import BottomNavigation from '../components/ui/BottomNavigation';

type RootStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
  UserInfo: undefined;
  Home: undefined;
  Profile: undefined;
  EditProfile: undefined;
  Help: undefined;
  About: undefined;
  Plan: undefined;
  History: undefined;
};

type HomeScreenProps = {
  navigation: NavigationProp<RootStackParamList, 'Home'>;
};

interface UserData {
  fullName?: string;
}

interface UserInfo {
  gender: 'male' | 'female';
  weight: number;
  height: number;
  age: number;
  activityFactor: number;
  bmr: number;
  tdee: number;
  avatarUrl?: string;
}

interface CalorieData {
  bmr: number;
  tdee: number;
  consumed: number;
  remaining: number;
}

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

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [calorieData, setCalorieData] = useState<CalorieData>({
    bmr: 0,
    tdee: 0,
    consumed: 0, 
    remaining: 0
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mealLog, setMealLog] = useState<ScannedProduct[]>([]);
  const [isLoadingMeals, setIsLoadingMeals] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (userInfo) {
      loadMealLog(selectedDate);
    }
  }, [selectedDate, userInfo]);

  // Normalize gender 
  const normalizedGender = (gender: string): 'male' | 'female' | null => {
    if(!gender) return null;
    const g = gender.toLowerCase(); 
    if(g === 'male' || g === 'female') return g;
    return null;
  }

  const formatDateForQuery = (date: Date): string => {
    // Use local date to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // YYYY-MM-DD format in local time
  };

  const loadMealLog = async (date: Date) => {
    try {
      setIsLoadingMeals(true);
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) return;

      const dateStr = formatDateForQuery(date);
      
      // Query both scannedProducts and foodDiary collections
      const scannedProductsRef = collection(db, 'scannedProducts');
      const q = query(
        scannedProductsRef,
        where('userId', '==', user.uid)
      );

      const querySnapshot = await getDocs(q);
      const products: ScannedProduct[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        let productDate = data.dateAdded || data.scannedAt || '';
        
        // Convert UTC timestamp to local date string for comparison
        if (productDate) {
          let localDateStr = '';
          
          // Handle different date formats
          if (productDate.includes('T')) {
            // ISO string format
            const utcDate = new Date(productDate);
            localDateStr = formatDateForQuery(utcDate);
          } else if (productDate.includes('-') && productDate.length === 10) {
            // Already in YYYY-MM-DD format
            localDateStr = productDate;
          } else {
            // Try to parse as timestamp
            const utcDate = new Date(productDate);
            if (!isNaN(utcDate.getTime())) {
              localDateStr = formatDateForQuery(utcDate);
            }
          }

          // Filter by local date
          if (localDateStr === dateStr) {
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
          }
        }
      });

      // Also check foodDiary collection for additional entries
      const diaryRef = doc(db, 'foodDiary', `${user.uid}_${dateStr}`);
      const diaryDoc = await getDoc(diaryRef);
      
      if (diaryDoc.exists()) {
        const diaryData = diaryDoc.data();
        if (diaryData.foods && Array.isArray(diaryData.foods)) {
          diaryData.foods.forEach((food: any, index: number) => {
            // Avoid duplicates by checking if product already exists
            const exists = products.some(p => 
              p.productName === food.productName && 
              p.scannedAt === food.scannedAt
            );
            
            if (!exists) {
              products.push({
                id: `diary_${index}`,
                productName: food.productName || 'Unknown Product',
                brand: food.brand || '',
                calories: food.calories || 0,
                servingSize: food.servingSize || '1 serving',
                imageUrl: food.imageUrl || '',
                dateAdded: food.dateAdded || '',
                scannedAt: food.scannedAt || '',
                isFromPhoto: food.isFromPhoto || false,
                barcode: food.barcode || ''
              });
            }
          });
        }
      }

      // Sort by scanned time (newest first)
      products.sort((a, b) => {
        const timeA = new Date(a.scannedAt || a.dateAdded).getTime();
        const timeB = new Date(b.scannedAt || b.dateAdded).getTime();
        return timeB - timeA;
      });

      setMealLog(products);

      // Calculate total consumed calories for the day
      const totalConsumed = products.reduce((sum, product) => sum + product.calories, 0);
      
      setCalorieData(prev => ({
        ...prev,
        consumed: totalConsumed,
        remaining: Math.max(0, prev.tdee - totalConsumed)
      }));

    } catch (error) {
      console.error('Error loading meal log:', error);
      Alert.alert('Error', 'Failed to load meal log. Please try again.');
    } finally {
      setIsLoadingMeals(false);
    }
  };

  const getNextDay = (dateStr: string): string => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  };
  
  const loadUserData = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
  
      if (!user) {
        Alert.alert('User not logged in', 'Please sign in to continue.');
        return;
      }
  
      const userInfoDocRef = doc(db, 'userInfo', user.uid);
      const userInfoDoc = await getDoc(userInfoDocRef);
  
      if (!userInfoDoc.exists()) {
        Alert.alert('No user info found', 'Please complete your profile information.');
        return;
      }
  
      const userInfoData = userInfoDoc.data() as UserInfo;
  
     
      let userDataFromDoc: UserData = { fullName: 'User' };
      
      const userDocRef = doc(db, 'user', user.uid);
      const userDoc = await getDoc(userDocRef);
      if(userDoc.exists()){
        const userData = userDoc.data();
        userDataFromDoc = {
          fullName: userData.fullName || 'User'
        };
      }
      
      // Set user data first
      setUserData(userDataFromDoc);
        
      const gender = normalizedGender(userInfoData.gender);
  
      if (
        gender &&
        typeof userInfoData.age === 'number' &&
        typeof userInfoData.height === 'number' &&
        typeof userInfoData.weight === 'number' &&
        typeof userInfoData.activityFactor === 'number' &&
        typeof userInfoData.bmr === 'number' &&
        typeof userInfoData.tdee === 'number'
      ) {
        setUserInfo({
          gender,
          age: userInfoData.age,
          height: userInfoData.height,
          weight: userInfoData.weight,
          activityFactor: userInfoData.activityFactor,
          bmr: userInfoData.bmr,
          tdee: userInfoData.tdee,
          avatarUrl: userInfoData.avatarUrl || '', 
        });
  
        const consumed = 0; // This will be updated by loadMealLog
  
        setCalorieData({
          bmr: userInfoData.bmr,
          tdee: userInfoData.tdee,
          consumed: consumed,
          remaining: userInfoData.tdee - consumed,
        });
  
        // Fixed: Remove duplicate setUserData call
      } else {
        Alert.alert('Invalid user data', 'Please complete your profile information.');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load user data. Please try again.');
    }
  };
  
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const getCurrentDate = (): string => {
    const date = new Date();
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${months[currentMonth]} ${currentYear}`;
  };

  const getDaysInMonth = (): (number | null)[] => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    
    const days: (number | null)[] = [];
    
    
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const gotoPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  }

  const gotoNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const isToday = (day: number | null): boolean => {
    if (!day) return false;
    const today = new Date();
    return day === today.getDate() && 
           currentMonth === today.getMonth() && 
           currentYear === today.getFullYear();
  };

  const isSelectedDay = (day: number | null): boolean => {
    if (!day) return false;
    return day === selectedDate.getDate() && 
           currentMonth === selectedDate.getMonth() && 
           currentYear === selectedDate.getFullYear();
  };

  const handleDayPress = (day: number | null) => {
    if (day) {
      const newDate = new Date(currentYear, currentMonth, day);
      setSelectedDate(newDate);
    }
  };

  const renderMealItem = ({ item }: { item: ScannedProduct }) => (
    <View style={styles.mealItem}>
      <View style={styles.mealItemContent}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.mealItemImage} />
        ) : (
          <View style={styles.mealItemImagePlaceholder}>
            <Ionicons name="image" size={24} color=Colors.graySilver />
          </View>
        )}
        <View style={styles.mealItemInfo}>
          <Text style={styles.mealItemName}>{item.productName}</Text>
          {item.brand && <Text style={styles.mealItemBrand}>{item.brand}</Text>}
          <Text style={styles.mealItemServing}>{item.servingSize}</Text>
          
          {/* Show additional info for different types */}
          <View style={styles.mealItemMeta}>
            {item.isFromPhoto && (
              <View style={styles.mealItemTag}>
                <Ionicons name="camera" size={12} color=Colors.success />
                <Text style={[styles.mealItemTagText, { color: Colors.success }]}>Photo</Text>
              </View>
            )}
            {item.barcode && (
              <View style={styles.mealItemTag}>
                <Ionicons name="barcode" size={12} color=Colors.accentBlue />
                <Text style={[styles.mealItemTagText, { color: Colors.accentBlue }]}>Barcode</Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.mealItemCalories}>
          <Text style={styles.mealItemCalorieNumber}>{item.calories}</Text>
          <Text style={styles.mealItemCalorieLabel}>kcal</Text>
        </View>
      </View>
    </View>
  );

  const getSelectedDateString = (): string => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return selectedDate.toLocaleDateString('en-US', options);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Hi {userData?.fullName?.split(' ')[0] || 'User'}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <View style={styles.profileSection}>
            {userInfo?.avatarUrl ? (
              <Image source={{uri: userInfo.avatarUrl}} style={styles.avatar}/>
            ) : (
               <Ionicons name="person-circle" size={50} color=Colors.primary />
            )}
            </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Calorie Card */}
        <View style={styles.calorieCard}>
          <View style={styles.calorieTextContainer}>
          <View style={styles.calorieHeader}>
            <Ionicons name="restaurant" size={24} color=Colors.primary />
            <Text style={styles.calorieTitle}>Daily Intake</Text>
          </View>
          
          <View style={styles.calorieCircle}>
            <Text style={styles.calorieNumber}>{calorieData.remaining}</Text>
            <Text style={styles.calorieLabel}>Calories Left</Text>
          </View>
          </View>

          <CircularCalorieProgress consumed={calorieData.consumed} tdee={calorieData.tdee}/>
        </View>

        {/* Calendar */}
        <View style={styles.calendarContainer}>
          <View style={styles.calendarHeader}>
            <TouchableOpacity onPress={gotoPreviousMonth}>
              <Ionicons name="chevron-back" size={24} color=Colors.textSecondary />
            </TouchableOpacity>
            <Text style={styles.calendarTitle}>{getCurrentDate()}</Text>
            <TouchableOpacity onPress={gotoNextMonth}>
              <Ionicons name="chevron-forward" size={24} color=Colors.textSecondary />
            </TouchableOpacity>
          </View>

          <View style={styles.weekDays}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
              <Text key={index} style={styles.weekDay}>{day}</Text>
            ))}
          </View>

          <View style={styles.calendarGrid}>
            {getDaysInMonth().map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.calendarDay,
                  isToday(day) ? styles.calendarDayToday : null,
                  isSelectedDay(day) ? styles.calendarDaySelected : null
                ]}
                onPress={() => handleDayPress(day)}
              >
                <Text style={[
                  styles.calendarDayText,
                  isToday(day) ? styles.calendarDayTodayText : null,
                  isSelectedDay(day) ? styles.calendarDaySelectedText : null
                ]}>
                  {day || ''}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Meal Log Section */}
        <View style={styles.mealLogContainer}>
          <View style={styles.mealLogHeader}>
            <Ionicons name="time" size={24} color=Colors.primary />
            <Text style={styles.mealLogTitle}>Meal Log</Text>
            {isLoadingMeals && (
              <ActivityIndicator size="small" color=Colors.primary style={{ marginLeft: 10 }} />
            )}
          </View>
          <Text style={styles.mealLogDate}>{getSelectedDateString()}</Text>
          
          {mealLog.length > 0 ? (
            <FlatList
              data={mealLog}
              renderItem={renderMealItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyMealLog}>
              <Ionicons name="restaurant-outline" size={48} color=Colors.graySilver />
              <Text style={styles.emptyMealLogText}>
                {isLoadingMeals ? 'Loading meals...' : 'No meals logged for this day'}
              </Text>
              <Text style={styles.emptyMealLogSubtext}>
                {!isLoadingMeals && 'Scan a product to add to your meal log'}
              </Text>
            </View>
          )}
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{calorieData.bmr}</Text>
            <Image style={styles.icon} source={require('../images/icons/bmr.png')}></Image>
            <Text style={styles.statLabel}>BMR</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{calorieData.tdee}</Text>
            <Image style={styles.icon} source={require('../images/icons/tdee.png')}></Image>
            <Text style={styles.statLabel}>TDEE</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{calorieData.consumed}</Text>
            <Image style={styles.icon} source={require('../images/icons/consumed.png')}></Image>
            <Text style={styles.statLabel}>Consumed</Text>
          </View>
        </View>


      </ScrollView>
       {/* Bottom Navigation */}
       <BottomNavigation navigation={navigation} />
    </SafeAreaView>
  );
};

export default HomeScreen;