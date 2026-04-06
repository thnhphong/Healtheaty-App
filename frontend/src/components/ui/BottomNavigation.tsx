import Colors from '../../constants/Colors';
import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Home, Calendar, ScanLine, Clock, User } from 'lucide-react-native';
import { NavigationProp, useRoute } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

interface BottomNavigationProps {
  navigation: NavigationProp<any>;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ navigation }) => {
  const route = useRoute();

  const handleTabPress = (tabName: string) => {
    if (tabName === 'Scan') {
      navigation.navigate('ScanFood');
    } else {
      navigation.navigate(tabName);
    }
  };

  return (
    <View style={{
      backgroundColor: 'white',
      borderTopWidth: 1,
      borderColor: Colors.graySilver,
      height: 70,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    }}>

      <TouchableOpacity onPress={() => handleTabPress('Home')} style={{ alignItems: 'center' }}>
        <Home color={route.name === 'Home' ? Colors.primary : Colors.textLight} size={24} />
        <Text style={{ fontSize: 12, color: route.name === 'Home' ? Colors.primary : Colors.textLight }}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleTabPress('Plan')} style={{ alignItems: 'center' }}>
        <Calendar color={route.name === 'Plan' ? Colors.primary : Colors.textLight} size={24} />
        <Text style={{ fontSize: 12, color: route.name === 'Plan' ? Colors.primary : Colors.textLight }}>Plan</Text>
      </TouchableOpacity>

      <View style={{ width: 70 }} />

      <TouchableOpacity onPress={() => handleTabPress('History')} style={{ alignItems: 'center' }}>
        <Clock color={route.name === 'History' ? Colors.primary : Colors.textLight} size={24} />
        <Text style={{ fontSize: 12, color: route.name === 'History' ? Colors.primary : Colors.textLight }}>History</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleTabPress('Profile')} style={{ alignItems: 'center' }}>
        <User color={route.name === 'Profile' ? Colors.primary : Colors.textLight} size={24} />
        <Text style={{ fontSize: 12, color: route.name === 'Profile' ? Colors.primary : Colors.textLight }}>Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleTabPress('Scan')}
        style={{
          position: 'absolute',
          top: -30,
          left: screenWidth / 2 - 35,
          backgroundColor: Colors.primary,
          borderRadius: 35,
          padding: 18,
          elevation: 5,
          shadowColor: Colors.black,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
        }}
      >
        <ScanLine color=Colors.white size={28} />
      </TouchableOpacity>

    </View>
  );
};

export default BottomNavigation;
