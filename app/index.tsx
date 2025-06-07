import { StyleSheet, Text, View } from "react-native";

// App.tsx (root level)
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../frontend/types/navigation';

import WelcomeScreen from '../frontend/screens/WelcomeScreen';
import SignInScreen from '../frontend/screens/SignInScreen';
import SignUpScreen from '../frontend/screens/SignUpScreen';
import UserInfoScreen from '../frontend/screens/UserInfoScreen';
import HomeScreen from '../frontend/screens/HomeScreen';
import ProfileScreen from '../frontend/screens/ProfileScreen';


const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        id={undefined}
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="UserInfo" component={UserInfoScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}