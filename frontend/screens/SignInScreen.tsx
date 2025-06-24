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
import { NavigationProp } from '@react-navigation/native';
import { signInStyles } from '../styles/SignInScreenStyles';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../backend/config/firebase';

type RootStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
  UserInfo: undefined;
  Home: undefined;
  Profile: undefined;
};

interface SignInScreenProps {
  navigation: NavigationProp<RootStackParamList>;
}

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
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Invalid email address');
      return false;
    }
    return true;
  };

  const handleSignIn = async (): Promise<void> => {
    if (!validateForm()) return;
    const { email, password } = formData;
    setLoading(true);

    try {
      // Firebase Auth handles password verification automatically
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('Signed in:', user.uid);

      Alert.alert('Success', 'Signed in successfully', [
        { text: 'OK', onPress: () => navigation.navigate('Home') }
      ]);
    } catch (error: any) {
      console.error('Sign-in error:', error);
      setLoading(false);
      
      let errorMessage = 'Failed to sign in. Please try again.';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'No internet connection.';
          break;
        default:
          if (error.message) errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
      return;
    }
    
    setLoading(false);
  };

  return (
    <SafeAreaView style={signInStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={signInStyles.header}>
        <View style={signInStyles.logoContainer}>
          <Ionicons name="restaurant" size={24} color="#FF6B35" />
          <Text style={signInStyles.logoText}>Healthy Eating</Text>
        </View>
      </View>

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
            editable={!loading}
          />
          <TextInput
            style={signInStyles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            value={formData.password}
            onChangeText={(value) => handleInputChange('password', value)}
            secureTextEntry
            editable={!loading}
          />

          <TouchableOpacity
            style={[signInStyles.signInButton, loading && signInStyles.disabledButton]}
            onPress={handleSignIn}
            disabled={loading}
          >
            <Text style={signInStyles.signInButtonText}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => Alert.alert('Coming Soon')}>
            <Text style={signInStyles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <View style={signInStyles.footer}>
          <Text style={signInStyles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={signInStyles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={signInStyles.bottomIndicator} />
    </SafeAreaView>
  );
};

export default SignInScreen;