import React from 'react';
import { View, ScrollView, TouchableOpacity, Linking, Image, Text, SafeAreaView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HelpScreen: React.FC = () => {
  const handleEmailPress = () => {
    Linking.openURL('mailto:thnhphong4869@gmail.com');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Ionicons name="help-circle-outline" size={90} color="#FF6B35" style={styles.icon} />

        <Text style={styles.title}>Help & Support</Text>

        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
          }}
          style={styles.image}
        />

        <Text style={styles.description}>
          We're here to help you! If you have any questions, issues, or feedback, don't hesitate to reach out.
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleEmailPress}>
          <Ionicons name="mail" size={20} color="#fff" />
          <Text style={styles.buttonText}>Contact Us via Email</Text>
        </TouchableOpacity>

        <Text style={styles.email}>thnhphong4869@gmail.com</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HelpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    marginTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  image: {
    width: 120,
    height: 120,
    marginVertical: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#FF6B35',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  email: {
    marginTop: 15,
    color: '#888',
    fontSize: 14,
  },
});