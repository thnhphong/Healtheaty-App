import React from 'react';
import { View, Text, Image, ScrollView, SafeAreaView, StyleSheet } from 'react-native';

const AboutScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Image
          source={require('../images/icons/tdee.png')}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.title}>About HealthMate</Text>

        <Text style={styles.description}>
          Healtheaty is your personal wellness assistant. We help you track your fitness journey by calculating your BMR, TDEE, and much more. Our goal is to empower you with data and insights to live a healthier life.
        </Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Version</Text>
          <Text style={styles.infoText}>1.0.0</Text>

          <Text style={styles.infoTitle}>Developed by</Text>
          <Text style={styles.infoText}>Hutech Team</Text>

          <Text style={styles.infoTitle}>Contact</Text>
          <Text style={styles.infoText}>thnhphong4869@gmail.com</Text>
        </View>

        <Text style={styles.footer}>
          © 2025 Healtheaty. All rights reserved.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { alignItems: 'center', padding: 24 },
  image: { width: '100%', height: 180, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FF6B35', marginBottom: 16 },
  description: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  infoBox: {
    width: '100%',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  infoTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
    color: '#555',
  },
  infoText: {
    fontSize: 15,
    color: '#777',
  },
  footer: {
    marginTop: 20,
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
  },
});
