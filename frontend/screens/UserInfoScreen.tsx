// frontend/screens/SignUpScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { NavigationProp } from '@react-navigation/native';
import { userInfoStyles } from '../styles/UserInfoScreenStyles';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../backend/config/firebase';

// Define your root stack param list
type RootStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
  UserInfo: undefined;
  Home: undefined;
  Profile: undefined;
  EditProfile: undefined;
};

interface UserInfoScreenProps {
  navigation: NavigationProp<RootStackParamList>;
}

interface UserInfo {
  age: string;
  gender: 'male' | 'female';
  height: string;
  weight: string;
  activityFactor: number;
}

interface ActivityLevel {
  value: number;
  label: string;
}

const UserInfoScreen: React.FC<UserInfoScreenProps> = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    age: '',
    gender: 'male',
    height: '',
    weight: '',
    activityFactor: 1
  });
  const [loading, setLoading] = useState<boolean>(false);

  const activityLevels: ActivityLevel[] = [
    { value: 1, label: 'Sedentary (little/no exercise)' },
    { value: 2, label: 'Light activity (1-3 days/week)' },
    { value: 3, label: 'Moderate activity (3-5 days/week)' },
    { value: 4, label: 'Very active (6-7 days/week)' },
    { value: 5, label: 'Extremely active (2 times/day)' }
  ];

  const handleInputChange = (field: keyof UserInfo, value: string | number): void => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateInput = (): boolean => {
    const { age, height, weight } = userInfo;

    if (!age || !height || !weight) {
      Alert.alert('Error', 'Please fill in all information');
      return false;
    }

    if (isNaN(Number(age)) || isNaN(Number(height)) || isNaN(Number(weight))) {
      Alert.alert('Error', 'Please enter valid numbers');
      return false;
    }

    const ageNum = parseInt(age);
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);

    if (ageNum <= 0 || ageNum > 120) {
      Alert.alert('Error', 'Age must be between 1 and 120');
      return false;
    }

    if (heightNum <= 0 || heightNum > 250) {
      Alert.alert('Error', 'Height must be between 1 and 250 cm');
      return false;
    }

    if (weightNum <= 0 || weightNum > 500) {
      Alert.alert('Error', 'Weight must be between 1 and 500 kg');
      return false;
    }

    return true;
  };

  const calculateBMR = (): number => {
    const ageNum = parseInt(userInfo.age);
    const heightNum = parseFloat(userInfo.height);
    const weightNum = parseFloat(userInfo.weight);

    // Mifflin-St Jeor Equation
    if (userInfo.gender === 'male') {
      return (10 * weightNum) + (6.25 * heightNum) - (5 * ageNum) + 5;
    } else {
      return (10 * weightNum) + (6.25 * heightNum) - (5 * ageNum) - 161;
    }
  };

  const calculateTDEE = (activityFactor: number): number => {
    const bmr = calculateBMR();
    const activityMultipliers = {
      1: 1.2,   // Sedentary
      2: 1.375, // Light activity
      3: 1.55,  // Moderate activity
      4: 1.725, // Very active
      5: 1.9    // Extra active
    };
    
    return bmr * activityMultipliers[activityFactor as keyof typeof activityMultipliers];
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateInput()) {
      return;
    }

    setLoading(true);
    
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'User not logged in');
        setLoading(false);
        return;
      }

      const bmr = calculateBMR();
      const tdee = calculateTDEE(userInfo.activityFactor);

      const userInfoData = {
        userId: user.uid,
        age: parseInt(userInfo.age),
        gender: userInfo.gender,
        height: parseFloat(userInfo.height),
        weight: parseFloat(userInfo.weight),
        activityFactor: userInfo.activityFactor, // Save as number to match Firestore
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Save to Firestore
      await setDoc(doc(db, 'userInfo', user.uid), userInfoData);
      
      console.log('User Info Data saved:', userInfoData);
      
      Alert.alert(
        'Success!',
        `Your information has been saved successfully.\nBMR: ${Math.round(bmr)} calories/day\nTDEE: ${Math.round(tdee)} calories/day`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home')
          }
        ]
      );
    } catch (error) {
      console.error('Error saving user info:', error);
      Alert.alert('Error', 'Failed to save information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={userInfoStyles.container}>
      <ScrollView style={userInfoStyles.content} showsVerticalScrollIndicator={false}>
        <Text style={userInfoStyles.title}>Personal Information</Text>
        <Text style={userInfoStyles.subtitle}>Enter your information to calculate appropriate calories</Text>

        <View style={userInfoStyles.formContainer}>
          <Text style={userInfoStyles.label}>Age</Text>
          <TextInput
            style={userInfoStyles.input}
            placeholder="Enter your age"
            placeholderTextColor="#999"
            value={userInfo.age}
            onChangeText={(value) => handleInputChange('age', value)}
            keyboardType="numeric"
          />

          <Text style={userInfoStyles.label}>Gender</Text>
          <View style={userInfoStyles.pickerContainer}>
            <Picker
              selectedValue={userInfo.gender}
              onValueChange={(value) => handleInputChange('gender', value)}
              style={userInfoStyles.picker}
            >
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
            </Picker>
          </View>

          <Text style={userInfoStyles.label}>Height (cm)</Text>
          <TextInput
            style={userInfoStyles.input}
            placeholder="Enter your height"
            placeholderTextColor="#999"
            value={userInfo.height}
            onChangeText={(value) => handleInputChange('height', value)}
            keyboardType="numeric"
          />

          <Text style={userInfoStyles.label}>Weight (kg)</Text>
          <TextInput
            style={userInfoStyles.input}
            placeholder="Enter your weight"
            placeholderTextColor="#999"
            value={userInfo.weight}
            onChangeText={(value) => handleInputChange('weight', value)}
            keyboardType="numeric"
          />

          <Text style={userInfoStyles.label}>Activity Level</Text>
          <View style={userInfoStyles.pickerContainer}>
            <Picker
              selectedValue={userInfo.activityFactor}
              onValueChange={(value) => handleInputChange('activityFactor', value)}
              style={userInfoStyles.picker}
            >
              {activityLevels.map((level) => (
                <Picker.Item
                  key={level.value}
                  label={level.label}
                  value={level.value}
                />
              ))}
            </Picker>
          </View>

          <TouchableOpacity 
            style={[userInfoStyles.submitButton, loading && userInfoStyles.disabledButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={userInfoStyles.submitButtonText}>
              {loading ? 'Saving...' : 'Save Information'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserInfoScreen;