// frontend/screens/SignUpScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Alert,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signUpStyles } from '../styles/SignUpScreenStyles';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

interface SignUpScreenProps {
  navigation: NavigationProp<RootStackParamList, 'SignUp'>;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSignUp = async (): Promise<void> => {
    const { fullName, email, phone, password, confirmPassword } = formData;

    // Validation
    if (!fullName || !email || !phone || !password || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);
    
    // Simulate sign up process
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Đăng ký thành công!',
        'Tài khoản của bạn đã được tạo thành công.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('UserInfo')
          }
        ]
      );
    }, 2000);
  };

  return (
    <SafeAreaView style={signUpStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={signUpStyles.header}>
        <View style={signUpStyles.logoContainer}>
          <Ionicons name="restaurant" size={24} color="#FF6B35" />
          <Text style={signUpStyles.logoText}>Healthy Eating</Text>
        </View>
      </View>

      <ScrollView style={signUpStyles.content} showsVerticalScrollIndicator={false}>
        <Text style={signUpStyles.title}>Sign Up</Text>
        <Text style={signUpStyles.subtitle}>Add your details to login</Text>

        <View style={signUpStyles.formContainer}>
          <TextInput
            style={signUpStyles.input}
            placeholder="Name"
            placeholderTextColor="#999"
            value={formData.fullName}
            onChangeText={(value) => handleInputChange('fullName', value)}
          />

          <TextInput
            style={signUpStyles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={signUpStyles.input}
            placeholder="Mobile No"
            placeholderTextColor="#999"
            value={formData.phone}
            onChangeText={(value) => handleInputChange('phone', value)}
            keyboardType="phone-pad"
          />

          <TextInput
            style={signUpStyles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            value={formData.password}
            onChangeText={(value) => handleInputChange('password', value)}
            secureTextEntry={true}
          />

          <TextInput
            style={signUpStyles.input}
            placeholder="Confirm password"
            placeholderTextColor="#999"
            value={formData.confirmPassword}
            onChangeText={(value) => handleInputChange('confirmPassword', value)}
            secureTextEntry={true}
          />

          <TouchableOpacity 
            style={signUpStyles.signUpButton}
            onPress={handleSignUp}
            disabled={loading}
          >
            <Text style={signUpStyles.signUpButtonText}>
              {loading ? 'Đang tạo tài khoản...' : 'Create an account'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={signUpStyles.footer}>
          <Text style={signUpStyles.footerText}>Already have an Account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={signUpStyles.signInLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom indicator */}
      <View style={signUpStyles.bottomIndicator} />
    </SafeAreaView>
  );
};

export default SignUpScreen;