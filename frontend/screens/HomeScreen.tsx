// frontend/screens/HomeScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProps } from '../types/navigation';
import { styles } from '../styles/HomeScreenStyles';

type HomeScreenProps = NavigationProps<'Home'>;

interface UserData {
  fullName?: string;
}

interface UserInfo {
  gender: 'male' | 'female';
  weight: number;
  height: number;
  age: number;
  activityFactor: number;
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
    consumed: 850, // Example
    remaining: 0
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Mock data for demonstration
      setUserData({ fullName: 'John Doe' });
      setUserInfo({
        gender: 'male',
        weight: 70,
        height: 175,
        age: 25,
        activityFactor: 3
      });
      
      // Mock calorie calculations
      const mockBMR = 1680;
      const mockTDEE = 2300;
      setCalorieData(prev => ({
        ...prev,
        bmr: mockBMR,
        tdee: mockTDEE,
        remaining: mockTDEE - prev.consumed
      }));
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải dữ liệu người dùng');
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
          <Ionicons name="person-circle" size={32} color="#FF6B35" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Calorie Card */}
        <View style={styles.calorieCard}>
          <View style={styles.calorieHeader}>
            <Ionicons name="restaurant" size={24} color="#FF6B35" />
            <Text style={styles.calorieTitle}>Daily Intake</Text>
          </View>
          
          <View style={styles.calorieCircle}>
            <Text style={styles.calorieNumber}>{calorieData.remaining}</Text>
            <Text style={styles.calorieLabel}>Calories Left</Text>
          </View>
          
          <Text style={styles.calorieSubtext}>
            Your Calorie Intake is {Math.round((calorieData.consumed / calorieData.tdee) * 100)}%
          </Text>
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
            <Text style={styles.statLabel}>BMR</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{calorieData.tdee}</Text>
            <Text style={styles.statLabel}>TDEE</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{calorieData.consumed}</Text>
            <Text style={styles.statLabel}>Consumed</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="#FF6B35" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="calendar" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItemCenter}>
          <Ionicons name="add" size={30} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="heart" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person" size={24} color="#666" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;