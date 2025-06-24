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
import { NavigationProp } from '@react-navigation/native';
import { welcomeStyles } from '../styles/WelcomeScreenStyles';
import SignInBtn from '../components/ui/SignInBtn';
import SignUpBtn from '../components/ui/SignUpBtn';
import Logo from '../screens/Logo';

// Define your root stack param list
type RootStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
  UserInfo: undefined;
  Home: undefined;
  Profile: undefined;
};

interface WelcomeScreenProps {
  navigation: NavigationProp<RootStackParamList>;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const handleSignInPress = (): void => {
    navigation.navigate('SignIn');
  };

  const handleCreateAccountPress = (): void => {
    navigation.navigate('SignUp');
  };

  return (
    <SafeAreaView style={welcomeStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6B35" />
      
      {/* Logo */}
      <View style={welcomeStyles.header}>
        <Logo />
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
        <SignInBtn onPress={handleSignInPress} />
        <SignUpBtn onPress={handleCreateAccountPress} />
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;