import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Alert, 
} from 'react-native'
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import { signInStyles } from '../styles/SignInScreenStyles';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithCredential } from 'firebase/auth';
import { auth } from '../../backend/config/firebase';
import { useEffect } from 'react';


WebBrowser.maybeCompleteAuthSession(); // Required for iOS

type RootStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
  UserInfo: undefined;
  Home: undefined;
  Profile: undefined;
  EditProfile: undefined;
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

  // Google Auth Session with your Expo redirect URI
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '974622630670-l66g0ku545r5n5kpka9jf1g6f6o1j2f0.apps.googleusercontent.com',
    iosClientId: '974622630670-rouo2bolqc1jdph7k4kdrjpjoskdhqqu.apps.googleusercontent.com',
    androidClientId: '974622630670-uqmjojaas67v1qb1fq1h3s9f7dli732m.apps.googleusercontent.com',
    redirectUri: makeRedirectUri({
      native: 'healtheaty//redirect', 
    }),
  });

  useEffect(() => {
    if (response?.type === 'success') {
      setLoading(false); // Reset loading state
      const { idToken } = response.authentication!;
      const credential = GoogleAuthProvider.credential(idToken);
      signInWithCredential(auth, credential)
        .then(userCredential => {
          console.log('Google Sign-In successful:', userCredential.user.uid);
          navigation.navigate('UserInfo');
        })
        .catch(error => {
          console.error('Firebase Sign-In error:', error);
          Alert.alert('Error', `Failed to sign in with Google: ${error.message}`);
        });
    } else if (response?.type === 'error') {
      setLoading(false); // Reset loading state
      console.error('Google Auth error:', response.error);
      Alert.alert('Error', `Google Sign-In failed: ${response.error?.message || 'Unknown error'}`);
    } else if (response?.type === 'dismiss') {
      setLoading(false); // Reset loading state if user dismisses the auth session
    }
  }, [response]);

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

  const handleGoogleSignIn = async (): Promise<void> => {
    if (loading || !request) return; // Prevent multiple calls
    setLoading(true); // Set loading to true to disable button
    try {
      await promptAsync();
    } catch (error) {
      setLoading(false);
      console.error('Google Sign-In error:', error);
      Alert.alert('Error', 'Failed to initiate Google Sign-In');
    }
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

        <View style={signInStyles.signInGoogleContainer}>
          <Text style={signInStyles.signInGoogleText}>Or Sign In With</Text>
          <TouchableOpacity
            style={signInStyles.signInGoogleButton}
            onPress={handleGoogleSignIn}
            disabled={loading}
          >
            <Ionicons name="logo-google" size={24} color="#FFFFFF" />
            <Text style={signInStyles.signInGoogleButtonText}>Sign In With Google</Text>
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