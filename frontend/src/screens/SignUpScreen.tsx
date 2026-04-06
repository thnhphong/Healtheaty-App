import Colors from '../constants/Colors';
// frontend/screens/SignUpScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StatusBar,
  SafeAreaView, Alert, ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/SignUpScreenStyles';
import { NavigationProp } from '@react-navigation/native';
import { collection, getDocs, query, where, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

type RootStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
  UserInfo: undefined;
  Home: undefined;
  Profile: undefined;
  EditProfile: undefined;
  Plan: undefined;
  History: undefined;
};

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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignUp = async () => {
    const { fullName, email, phone, password, confirmPassword } = formData;

    // Validation
    if (!fullName || !email || !phone || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Invalid email address');
      return;
    }

    setLoading(true);

    try {
      //check if email already exists
      const usersRef = collection(db, 'user');
      const q = query(usersRef, where('email', '==', email.toLowerCase()))
      const querySnapshot = await getDocs(q);
      console.log('Firestore query result:', querySnapshot.empty ? 'No matches' : 'Email found');
      
      if (!querySnapshot.empty) {
        Alert.alert('Error', 'Email already registered');
        setLoading(false);
        return;
      }

      // Create Firebase Auth user - Firebase handles password hashing securely
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // send verification email 
      await sendEmailVerification(user);
      Alert.alert(
        'Verify Your Email',
        'A verification link has been sent to your inbox. Please verify before signing in.',
        [{ text: 'OK' }]
      )

      // Save additional user data in Firestore (NO PASSWORD - Firebase Auth handles this)
      await setDoc(doc(db, 'user', user.uid), {
        email,
        fullName: fullName,
        phone,
        createdAt: serverTimestamp()
      });

      //sign out the user so they have to log in again after verifying
      await auth.signOut()

      setLoading(false);
      Alert.alert('Sign Up Successful!', 'Your account has been created.', [
        { text: 'OK', onPress: () => navigation.navigate('SignIn') }
      ]);
    } catch (error: any) {
      console.error('Signup error:', error);
      setLoading(false);
      let errorMessage = 'Signup failed. Please try again.';

      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email already registered.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email format.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'No internet connection.';
          break;
        default:
          if (error.message) errorMessage = error.message;
      }

      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="restaurant" size={24} color={Colors.primary} />
          <Text style={styles.logoText}>Healtheaty</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Sign Up</Text>
        <Text style={styles.subtitle}>Add your details to register</Text>

        <View style={styles.formContainer}>
          <TextInput 
            style={styles.input} 
            placeholder="Name" 
            placeholderTextColor={Colors.textLight}
            value={formData.fullName} 
            onChangeText={v => handleInputChange('fullName', v)} 
            editable={!loading} 
          />
          <TextInput 
            style={styles.input} 
            placeholder="Email" 
            placeholderTextColor={Colors.textLight}
            value={formData.email} 
            onChangeText={v => handleInputChange('email', v)} 
            keyboardType="email-address" 
            autoCapitalize="none" 
            editable={!loading} 
          />
          <TextInput 
            style={styles.input} 
            placeholder="Mobile No" 
            placeholderTextColor={Colors.textLight}
            value={formData.phone} 
            onChangeText={v => handleInputChange('phone', v)} 
            keyboardType="phone-pad" 
            editable={!loading} 
          />
          <TextInput 
            style={styles.input} 
            placeholder="Password" 
            placeholderTextColor={Colors.textLight}
            value={formData.password} 
            onChangeText={v => handleInputChange('password', v)} 
            secureTextEntry 
            editable={!loading} 
          />
          <TextInput 
            style={styles.input} 
            placeholder="Confirm password" 
            placeholderTextColor={Colors.textLight}
            value={formData.confirmPassword} 
            onChangeText={v => handleInputChange('confirmPassword', v)} 
            secureTextEntry 
            editable={!loading} 
          />

          <TouchableOpacity 
            style={[styles.signUpButton, loading && { opacity: 0.7 }]} 
            onPress={handleSignUp} 
            disabled={loading}
          >
            <Text style={styles.signUpButtonText}>
              {loading ? 'Creating account...' : 'Create an account'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')} disabled={loading}>
            <Text style={styles.signInLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

    </SafeAreaView>
  );
};

export default SignUpScreen;