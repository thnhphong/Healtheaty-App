// navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens - update these paths based on your actual screen locations
import WelcomeScreen from '../screens/WelcomeScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import UserInfoScreen from '../screens/UserInfoScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import ForgotPassword from '../components/ui/ForgotPassword';
import ScanFoodScreen from '../screens/ScanFoodScreen';
import HelpScreen from '../screens/HelpScreen';
import AboutScreen from '../screens/AboutScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="UserInfo" component={UserInfoScreen} />
        <Stack.Screen name="Help" component={HelpScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen
  name="Home"
  component={HomeScreen}
  options={{
    gestureEnabled: false,
  }}
/>

        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} /> 
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="ScanFood" component={ScanFoodScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;