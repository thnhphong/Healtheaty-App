// frontend/screens/WelcomeScreen.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { welcomeStyles } from '../styles/WelcomeScreenStyles';

const WelcomeScreen: React.FC = () => {
  const handleSignInPress = (): void => {
    // Navigate to Sign In screen (frontend only)
    console.log('Navigate to Sign In');
  };

  const handleCreateAccountPress = (): void => {
    // Navigate to Sign Up screen (frontend only)
    console.log('Navigate to Sign Up');
  };

  return (
    <SafeAreaView style={welcomeStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6B35" />
      
      {/* Header với logo */}
      <View style={welcomeStyles.header}>
        <View style={welcomeStyles.logoContainer}>
          <Ionicons name="restaurant" size={40} color="#FFFFFF" />
          <Text style={welcomeStyles.logoText}>Healthy Eating App</Text>
        </View>
      </View>

      {/* Main Content */}
      <View style={welcomeStyles.content}>
        <View style={welcomeStyles.iconContainer}>
          <Ionicons name="restaurant-outline" size={80} color="#FFFFFF" />
        </View>
        
        <Text style={welcomeStyles.title}>
          <Text style={welcomeStyles.healthyText}>Healthy</Text>
          {'\n'}
          <Text style={welcomeStyles.eatingText}>Eating Made</Text>
          {'\n'}
          <Text style={welcomeStyles.betterText}>Better</Text>
        </Text>
        
        <Text style={welcomeStyles.subtitle}>
          Start your journey to a healthier lifestyle
        </Text>
      </View>

      {/* Buttons */}
      <View style={welcomeStyles.buttonContainer}>
        <TouchableOpacity 
          style={welcomeStyles.signInButton}
          onPress={handleSignInPress}
          activeOpacity={0.8}
        >
          <Text style={welcomeStyles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={welcomeStyles.createAccountButton}
          onPress={handleCreateAccountPress}
          activeOpacity={0.8}
        >
          <Text style={welcomeStyles.createAccountButtonText}>Create an account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;