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

// Define your root stack param list
type RootStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
  UserInfo: undefined;
  Home: undefined;
  Profile: undefined;
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
    { value: 1, label: 'Ít vận động (ngồi nhiều)' },
    { value: 2, label: 'Vận động nhẹ (1-3 ngày/tuần)' },
    { value: 3, label: 'Vận động vừa (3-5 ngày/tuần)' },
    { value: 4, label: 'Vận động nhiều (6-7 ngày/tuần)' },
    { value: 5, label: 'Vận động cực nhiều (2 lần/ngày)' }
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
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return false;
    }

    if (isNaN(Number(age)) || isNaN(Number(height)) || isNaN(Number(weight))) {
      Alert.alert('Lỗi', 'Vui lòng nhập số hợp lệ');
      return false;
    }

    const ageNum = parseInt(age);
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);

    if (ageNum <= 0 || ageNum > 120) {
      Alert.alert('Lỗi', 'Tuổi phải từ 1 đến 120');
      return false;
    }

    if (heightNum <= 0 || heightNum > 250) {
      Alert.alert('Lỗi', 'Chiều cao phải từ 1 đến 250 cm');
      return false;
    }

    if (weightNum <= 0 || weightNum > 500) {
      Alert.alert('Lỗi', 'Cân nặng phải từ 1 đến 500 kg');
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

  const calculateTDEE = (): number => {
    const bmr = calculateBMR();
    const activityMultipliers = {
      1: 1.2,   // Sedentary
      2: 1.375, // Light activity
      3: 1.55,  // Moderate activity
      4: 1.725, // Very active
      5: 1.9    // Extra active
    };
    
    return bmr * activityMultipliers[userInfo.activityFactor as keyof typeof activityMultipliers];
  };

  const handleSubmit = (): void => {
    if (!validateInput()) {
      return;
    }

    setLoading(true);
    
    // Simulate processing time
    setTimeout(() => {
      const userInfoData = {
        age: parseInt(userInfo.age),
        gender: userInfo.gender,
        height: parseFloat(userInfo.height),
        weight: parseFloat(userInfo.weight),
        activityFactor: userInfo.activityFactor,
        bmr: calculateBMR(),
        tdee: calculateTDEE()
      };

      console.log('User Info Data:', userInfoData);
      
      Alert.alert(
        'Thành công!',
        `Thông tin của bạn đã được lưu thành công.\nBMR: ${Math.round(userInfoData.bmr)} calo/ngày\nTDEE: ${Math.round(userInfoData.tdee)} calo/ngày`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home')
          }
        ]
      );
      
      setLoading(false);
    }, 1500);
  };

  return (
    <SafeAreaView style={userInfoStyles.container}>
      <ScrollView style={userInfoStyles.content} showsVerticalScrollIndicator={false}>
        <Text style={userInfoStyles.title}>Thông tin cá nhân</Text>
        <Text style={userInfoStyles.subtitle}>Nhập thông tin để tính toán lượng calo phù hợp</Text>

        <View style={userInfoStyles.formContainer}>
          <Text style={userInfoStyles.label}>Tuổi</Text>
          <TextInput
            style={userInfoStyles.input}
            placeholder="Nhập tuổi của bạn"
            placeholderTextColor="#999"
            value={userInfo.age}
            onChangeText={(value) => handleInputChange('age', value)}
            keyboardType="numeric"
          />

          <Text style={userInfoStyles.label}>Giới tính</Text>
          <View style={userInfoStyles.pickerContainer}>
            <Picker
              selectedValue={userInfo.gender}
              onValueChange={(value) => handleInputChange('gender', value)}
              style={userInfoStyles.picker}
            >
              <Picker.Item label="Nam" value="male" />
              <Picker.Item label="Nữ" value="female" />
            </Picker>
          </View>

          <Text style={userInfoStyles.label}>Chiều cao (cm)</Text>
          <TextInput
            style={userInfoStyles.input}
            placeholder="Nhập chiều cao"
            placeholderTextColor="#999"
            value={userInfo.height}
            onChangeText={(value) => handleInputChange('height', value)}
            keyboardType="numeric"
          />

          <Text style={userInfoStyles.label}>Cân nặng (kg)</Text>
          <TextInput
            style={userInfoStyles.input}
            placeholder="Nhập cân nặng"
            placeholderTextColor="#999"
            value={userInfo.weight}
            onChangeText={(value) => handleInputChange('weight', value)}
            keyboardType="numeric"
          />

          <Text style={userInfoStyles.label}>Mức độ hoạt động</Text>
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
              {loading ? 'Đang lưu...' : 'Lưu thông tin'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserInfoScreen;