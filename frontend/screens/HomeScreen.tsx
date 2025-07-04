// frontend/screens/HomeScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import { styles } from '../styles/HomeScreenStyles';
import { doc, getDoc } from 'firebase/firestore';
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
};

// Fixed: Correct prop type definition
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

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [calorieData, setCalorieData] = useState<CalorieData>({
    bmr: 0,
    tdee: 0,
    consumed: 0, 
    remaining: 0
  });

  useEffect(() => {
    loadUserData();
  }, []);

  // Normalize gender 
  const normalizedGender = (gender: string): 'male' | 'female' | null => {
    if(!gender) return null;
    const g = gender.toLocaleLowerCase()
    if(g === 'male' || g === 'female') return g;
    return null;
  }
  
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
  
      const userDocRef = doc(db, 'user', user.uid);
      const userDoc = await getDoc(userDocRef);
      if(userDoc.exists()){
        const userData = userDoc.data()
        setUserData({
          fullName: userData.fullName,
          email: userData.email
        });
      }else{
        setUserData({
          fullName: 'User',
          email: ''
        });
      }
        
      const gender = normalizedGender(userInfoData.gender);
  
      if (
        gender &&
        typeof userInfoData.age === 'number' &&
        typeof userInfoData.height === 'number' &&
        typeof userInfoData.weight === 'number' &&
        typeof userInfoData.activityFactor === 'number' &&
        typeof userInfoData.bmr === 'number' &&
        typeof userInfoData.tdee === 'number' &&
        typeof userInfoData.avatarUrl === 'string' 
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
  
        const consumed = 900; // placeholder
  
        setCalorieData({
          bmr: userInfoData.bmr,
          tdee: userInfoData.tdee,
          consumed: consumed,
          remaining: userInfoData.tdee - consumed,
        });
  
        setUserData({ fullName: userData.fullName || 'User' });
      } else {
        Alert.alert('Invalid user data', 'Please complete your profile information.');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };
  
  const getCurrentDate = (): string => {
    const date = new Date();
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const getDaysInMonth = (): (number | null)[] => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    const days: (number | null)[] = [];
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const isToday = (day: number | null): boolean => {
    if (!day) return false;
    const today = new Date().getDate();
    return day === today;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Hi {userData?.fullName?.split(' ')[0] || 'User'}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <View style={styles.profileSection}>
            {userInfo?.avatarUrl ? (
              <Image source={{uri: userInfo.avatarUrl}} style={styles.avatar}/>
            ) : (
               <Ionicons name="person-circle" size={50} color="#FF6B35" />
            )}
            </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Calorie Card */}
        <View style={styles.calorieCard}>
          <View style={styles.calorieTextContainer}>
          <View style={styles.calorieHeader}>
            <Ionicons name="restaurant" size={24} color="#FF6B35" />
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
            <TouchableOpacity>
              <Ionicons name="chevron-back" size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.calendarTitle}>{getCurrentDate()}</Text>
            <TouchableOpacity>
              <Ionicons name="chevron-forward" size={24} color="#666" />
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
                  (day !== null && day !== undefined && isToday(day)) ? styles.calendarDayToday : null
                ]}
              >
                <Text style={[
                  styles.calendarDayText,
                  (day !== null && day !== undefined && isToday(day)) ? styles.calendarDayTodayText : null
                ]}>
                  {day || ''}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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
       <BottomNavigation />
    </SafeAreaView>
  );
};

export default HomeScreen;