import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Home, Calendar, ScanLine, Clock, User } from 'lucide-react-native'; 

const BottomNavigation = () => {
  const [activeTab, setActiveTab] = useState('Home');

  const tabs = [
    { name: 'Home', icon: Home },
    { name: 'Plan', icon: Calendar },
    { name: 'Scan', icon: ScanLine, isCenter: true },
    { name: 'History', icon: Clock },
    { name: 'Profile', icon: User }
  ];

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
  };

  return (
    <View style={{ backgroundColor: 'white', borderTopWidth: 1, borderColor: '#ccc', paddingVertical: 12 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.name;

          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => handleTabPress(tab.name)}
              style={{ alignItems: 'center', marginTop: tab.isCenter ? -60 : 0 }}
            >
              <View
                style={{
                  backgroundColor: tab.isCenter
                    ? '#FF6B35'
                    : isActive
                    ? '#FFEDE4'
                    : 'transparent',
                  padding: tab.isCenter ? 16 : 10,
                  borderRadius: tab.isCenter ? 50 : 16,
                }}
              >
                <Icon
                  size={tab.isCenter ? 36 : 20}
                  color={
                    tab.isCenter
                      ? '#fff'
                      : isActive
                      ? '#FF6B35'
                      : '#999'
                  }
                />
              </View>
              {!tab.isCenter && (
                <Text
                  style={{
                    fontSize: 14,
                    color: isActive ? '#FF6B35' : '#999',
                    marginTop: 4,
                  }}
                >
                  {tab.name}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default BottomNavigation;
