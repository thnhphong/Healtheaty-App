import Colors from '../../constants/Colors';
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Alert, 
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  KeyboardAvoidingView,
  Button,
  ScrollView,
} from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import { styles } from '../styles/SignInScreenStyles';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithCredential } from 'firebase/auth';
import { auth, db } from '../../backend/config/firebase';
import { doc, getDoc } from 'firebase/firestore';

WebBrowser.maybeCompleteAuthSession();

type RootStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
  UserInfo: undefined;
  Home: undefined;
  Profile: undefined;
  EditProfile: undefined;
  ForgotPassword: undefined;
  Plan: undefined;
  History: undefined;
};

interface SignInScreenProps {
  navigation: NavigationProp<RootStackParamList>;
}

interface SignInFormData {
  email: string;
  password: string;
}

const SignInScreen: React.FC<SignInScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState<SignInFormData>({ email: '', password: '' });
  const [loading, setLoading] = useState<boolean>(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const emailInputRef = useRef<TextInput>(null)
  const passwordInputRef = useRef<TextInput>(null)

  // Keyboard listeners
  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardVisible(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setIsKeyboardVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: 'YOUR_CLIENT_ID',
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    redirectUri: makeRedirectUri({ native: 'healtheaty://redirect' }),
  });

  useEffect(() => {
    if (response?.type === 'success') {
      setLoading(false);
      const { idToken } = response.authentication!;
      const credential = GoogleAuthProvider.credential(idToken);
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          console.log('Google Sign-In successful:', userCredential.user.uid);
          navigation.navigate('UserInfo');
        })
        .catch((error) => {
          setLoading(false);
          Alert.alert('Error', `Failed to sign in with Google: ${error.message}`);
        });
    } else if (response?.type === 'error') {
      setLoading(false);
      Alert.alert('Error', `Google Sign-In failed: ${response.error?.message || 'Unknown error'}`);
    } else if (response?.type === 'dismiss') {
      setLoading(false);
    }
  }, [response]);

  const handleInputChange = (field: keyof SignInFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
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
    

  const handleSignIn = async () => {
    if (!validateForm()) return;
    const { email, password } = formData;
    setLoading(true);
    
    try {
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userInfoRef = doc(db, 'userInfo', userCredential.user.uid);
      const userInfoDoc = await getDoc(userInfoRef);
      
      console.log('Signed in:', userCredential.user.uid);
      if (!userInfoDoc.exists()) {
        navigation.navigate('UserInfo');
      } else {
        navigation.navigate('Home');
      }
      
    } catch (error: any) {
    
      let errorMessage = 'Failed to sign in. Please try again.';
      switch (error.code) {
        case 'auth/user-not-found': errorMessage = 'No account found with this email.'; break;
        case 'auth/invalid-credential': errorMessage = 'Email or password is wrong.'; break;
        case 'auth/too-many-requests': errorMessage = 'Too many failed attempts. Please try again later.'; break;
        case 'auth/network-request-failed': errorMessage = 'No internet connection.'; break;
        default: if (error.message) errorMessage = error.message;
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (loading || !request) return;
    setLoading(true);
    try {
      await promptAsync();
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to initiate Google Sign-In');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="dark-content" backgroundColor=Colors.white />
          
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Ionicons name="restaurant" size={24} color=Colors.primary />
                <Text style={styles.logoText}>Healtheaty</Text>
              </View>
            </View>

            <View style={styles.content}>
              <Text style={styles.title}>Sign In</Text>
              <Text style={styles.subtitle}>Add your details to login</Text>

              <View style={styles.formContainer}>
                <TextInput
                  ref={emailInputRef}
                  style={styles.input}
                  placeholder="Your email"
                  placeholderTextColor=Colors.textLight
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={true}
                  showSoftInputOnFocus={true}
                  returnKeyType="next"
                  onSubmitEditing={() => passwordInputRef.current?.focus()}
                />
                <TextInput
                  ref={passwordInputRef}
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor=Colors.textLight
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  secureTextEntry
                  editable={true}
                  showSoftInputOnFocus={true}
                  returnKeyType="go"
                  onSubmitEditing={handleSignIn}
                />

                <TouchableOpacity
                  style={[styles.signInButton, loading && styles.disabledButton]}
                  onPress={handleSignIn}
                  disabled={loading}
                >
                  <Text style={styles.signInButtonText}>
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                  <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                </TouchableOpacity>
              </View>

              {/* Chỉ hiển thị phần Google Sign In khi bàn phím không hiện */}
              {!isKeyboardVisible && (
                <View style={styles.signInGoogleContainer}>
                  <Text style={styles.signInGoogleText}>Or Sign In With</Text>
                  <TouchableOpacity
                    style={styles.signInGoogleButton}
                    onPress={handleGoogleSignIn}
                    disabled={loading}
                  >
                    <Ionicons name="logo-google" size={24} color=Colors.white />
                    <Text style={styles.signInGoogleButtonText}>Sign In With Google</Text>
                  </TouchableOpacity>
                </View>
              )}

              {!isKeyboardVisible && (
                <View style={styles.footer}>
                  <Text style={styles.footerText}>Don't have an account?</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                    <Text style={styles.signUpLink}>Sign Up</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default SignInScreen;