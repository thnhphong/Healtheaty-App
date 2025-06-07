// frontend/screens/SignInScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProps } from '../types/navigation';
import { signInStyles } from '../styles/SignInScreenStyles';

interface SignInScreenProps extends NavigationProps {}

interface SignInFormData {
  email: string;
  password: string;
}

const SignInScreen: React.FC<SignInScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState<SignInFormData>({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (field: keyof SignInFormData, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    const { email, password } = formData;
    
    if (!email.trim() || !password.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Lỗi', 'Email không hợp lệ');
      return false;
    }

    return true;
  };

  const handleSignIn = async (): Promise<void> => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulate sign in process
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert('Thành công', 'Đăng nhập thành công!');
      navigation.navigate('Home');
    } catch (error: any) {
      Alert.alert('Đăng nhập thất bại', 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (): void => {
    Alert.alert('Thông báo', 'Tính năng này sẽ được cập nhật sớm');
  };

  const handleGoogleSignIn = (): void => {
    Alert.alert('Thông báo', 'Tính năng này sẽ được cập nhật sớm');
  };

  const handleNavigateToSignUp = (): void => {
    navigation.navigate('SignUp');
  };

  return (
    <SafeAreaView style={signInStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={signInStyles.header}>
        <View style={signInStyles.logoContainer}>
          <Ionicons name="restaurant" size={24} color="#FF6B35" />
          <Text style={signInStyles.logoText}>Healthy Eating</Text>
        </View>
      </View>

      {/* Content */}
      <View style={signInStyles.content}>
        <Text style={signInStyles.title}>Sign In</Text>
        <Text style={signInStyles.subtitle}>Add your details to login</Text>

        <View style={signInStyles.formContainer}>
          <TextInput
            style={signInStyles.input}
            placeholder="Your email"
            placeholderTextColor="#999"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />

          <TextInput
            style={signInStyles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            value={formData.password}
            onChangeText={(value) => handleInputChange('password', value)}
            secureTextEntry={true}
            autoCapitalize="none"
            editable={!loading}
          />

          <TouchableOpacity 
            style={[signInStyles.signInButton, loading && signInStyles.disabledButton]}
            onPress={handleSignIn}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={signInStyles.signInButtonText}>
              {loading ? 'Đang đăng nhập...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={signInStyles.forgotPassword}
            onPress={handleForgotPassword}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={signInStyles.forgotPasswordText}>Forgot your password?</Text>
          </TouchableOpacity>
        </View>

        <View style={signInStyles.divider}>
          <Text style={signInStyles.dividerText}>Or Sign In With</Text>
        </View>

        <TouchableOpacity 
          style={signInStyles.googleButton}
          onPress={handleGoogleSignIn}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={signInStyles.googleButtonText}>Sign In With Google</Text>
        </TouchableOpacity>

        <View style={signInStyles.footer}>
          <Text style={signInStyles.footerText}>Don't have an Account? </Text>
          <TouchableOpacity 
            onPress={handleNavigateToSignUp}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={signInStyles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom indicator */}
      <View style={signInStyles.bottomIndicator} />
    </SafeAreaView>
  );
};

export default SignInScreen;