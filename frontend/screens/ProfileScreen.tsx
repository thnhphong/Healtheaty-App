// frontend/screens/ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import { styles } from '../styles/ProfileScreenStyles';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../backend/config/firebase';
import { auth } from '../../backend/config/firebase';
import BottomNavigation from '../components/ui/BottomNavigation';
//bottom navigation


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
type ProfileScreenProps = {
  navigation: NavigationProp<RootStackParamList, 'Profile'>;
};

interface UserData {
  fullName?: string;
  email?: string;
}

interface UserInfo {
  age: number;
  gender: 'male' | 'female';
  height: number;
  weight: number;
  activityFactor: number;
  bmr: number;
  tdee: number;
  avatarUrl?: string;
}

// Removed duplicate HomeScreenProps interface - not needed here

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  let avatarUrl = userInfo?.avatarUrl;

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const user = auth.currentUser;
  if (!user) {
    console.log('User not looged in');
    return;
  }
  try{
    const userDocRef = doc(db, 'user', user.uid)
    const userDoc = await getDoc(userDocRef);

    //userInfo
    const userInfoDocRef = doc(db, 'userInfo', user.uid)
    const userInfoDoc = await getDoc(userInfoDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data() as UserData;
      const userInfo = userInfoDoc.data() as UserInfo;
      setUserData(userData);
      setUserInfo(userInfo);
    }else{
      console.log('No user data found');
    }
  }
  catch (error) {
    console.error('Error loading user data:', error);
  }

  };

  const handleSignOut = async () => {
    Alert.alert(
      'Log Out',
      'Are you sure to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          onPress: async () => {
            try {
              navigation.navigate('Welcome');
            } catch (error) {
              Alert.alert('Error', 'Logging out failed');
            }
          },
          style: 'destructive'
        },
      ],
      { cancelable: true }
    );
  };

  const getActivityLevelText = (level: number): string => {
    const levels: { [key: number]: string } = {
      1: 'Sedentary 🛋️',
      2: 'Light activity 🚶',
      3: 'Moderate activity 🏃',
      4: 'Very active 🏋️',
      5: 'Extra active 🚴',
    };
    return levels[level] || 'Undefined';
  };

  const calculateBMI = (): number => {
    if (userInfo?.weight && userInfo?.height) {
      const heightInM = userInfo.height / 100;
      return parseFloat((userInfo.weight / (heightInM * heightInM)).toFixed(1));
    }
    return 0;
  };

  const getBMIStatus = (bmi: number): { text: string; color: string } => {
    if (bmi < 18.5) return { text: 'Uderweight', color: '#3498db' };
    if (bmi < 25) return { text: 'Normal', color: '#27ae60' };
    if (bmi < 30) return { text: 'Overweight', color: '#f39c12' };
    return { text: 'Obese', color: 'red' };
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity>
          <Ionicons name="settings" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={styles.profileSection}>
          //avatar 
          <View style={styles.avatarContainer}>
            //check if userInfo has avatarUrl
            {userInfo?.avatarUrl ? (
              <Image source={{ uri: userInfo.avatarUrl }} style={styles.avartar} />
            ) : (
              <View>
                <Ionicons name="person-circle" size={120} color="#FF6B35" />
              </View>
            )}
          </View>
          
          <Text style={styles.userName}>{userData?.fullName || 'User'}</Text>
          <Text style={styles.userEmail}>{userData?.email}</Text>
          
          <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfile')}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Section */}
        {userInfo && (
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Health Information</Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userInfo.age}</Text>
                <Text style={styles.statLabel}>Age</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userInfo.height}cm</Text>
                <Text style={styles.statLabel}>Height</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userInfo.weight}kg</Text>
                <Text style={styles.statLabel}>Weight</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: getBMIStatus(calculateBMI()).color }]}>
                  {calculateBMI()}
                </Text>
                <Text style={styles.statLabel}>BMI</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Gender:</Text>
              <Text style={styles.infoValue}>
                {userInfo.gender === 'male' ? 'Male' : 'Female'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Activity Level:</Text>
              <Text style={styles.infoValue}>
                {getActivityLevelText(userInfo.activityFactor)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>BMI Status:</Text>
              <Text style={[styles.infoValue, { color: getBMIStatus(calculateBMI()).color }]}>
                {getBMIStatus(calculateBMI()).text}
              </Text>
            </View>
          </View>
        )}

        {/* Menu Options */}
        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="heart" size={24} color="#FF6B35" />
            <Text style={styles.menuText}>Favorites</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="notifications" size={24} color="#FF6B35" />
            <Text style={styles.menuText}>Notifications</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="help-circle" size={24} color="#FF6B35" />
            <Text style={styles.menuText}>Help</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="information-circle" size={24} color="#FF6B35" />
            <Text style={styles.menuText}>About</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleSignOut}>
            <Ionicons name="log-out" size={24} color="#e74c3c" />
            <Text style={[styles.menuText, { color: '#e74c3c' }]}>Log out</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNavigation />
    </SafeAreaView>
  );
};

export default ProfileScreen;