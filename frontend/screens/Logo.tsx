import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { welcomeStyles } from '../styles/WelcomeScreenStyles';

const Logo: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Simulate fetching dark mode preference
    const fetchDarkModePreference = async () => {
      // Replace with actual logic to fetch user preference
      const darkMode = false; // Example value
      setIsDarkMode(darkMode);
    };

    fetchDarkModePreference();
  }, []);

  return (
     <View style={welcomeStyles.header}>
            <View style={welcomeStyles.logoContainer}>
              <Ionicons name="restaurant" size={40} color="#FFFFFF" />
              <Text style={welcomeStyles.logoText}>Healtheaty</Text>
            </View>
          </View>
  );
}
export default Logo;