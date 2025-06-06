// Welcome.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
// import MaskedView from '@react-native-masked-view/masked-view';
// import LinearGradient from 'react-native-linear-gradient';

const Welcome = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Top Section with Orange Background */}
      <View style={styles.topSection}>
        {/* You can add extra design icons here later */}
      </View>

      {/* Logo (PNG) */}
      <View style={styles.logoContainer}>
        <View style={styles.logoBox}>
          <Image
            source={require('../assets/images/HealtheatyLogo.png')} // Adjust path if different
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
      </View>

  {/* Gradient Text: "Healthily Eating Made"
  <MaskedView
    maskElement={
      <Text style={[styles.title, styles.gradientText]}>
        Healthily{'\n'}Eating Made
      </Text>
    }
  >
    <LinearGradient
      colors={['#FF3C00', '#7BBF42']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={[styles.title, styles.gradientText, { opacity: 0 }]}>
        Healthily{'\n'}Eating Made
      </Text>
    </LinearGradient>
  </MaskedView> */}

  {/* "Better" in black stays normal */}
  <Text style={[styles.title, styles.black]}>Better</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Simplify healthy eating with a meal plan tailored to your goals, tastes and schedules.
      </Text>

      {/* Buttons */}
      <TouchableOpacity style={styles.signInButton}>
        <Text style={styles.signInText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.createAccountButton}>
        <Text style={styles.createAccountText}>Create an account</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topSection: {
    height: '35%',
    backgroundColor: '#FF6C00',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginTop: -35,
    alignItems: 'center',
  },
  logoBox: {
    backgroundColor: 'white',
    padding: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  logoImage: {
    width: 150,
    height: 40,
  },
  title: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '600',
  },
  orange: {
    color: '#FF6C00',
  },
  green: {
    color: '#7BBF42',
  },
  black: {
    color: '#000',
    fontWeight: 'bold',
  },
  subtitle: {
    marginHorizontal: 30,
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginTop: 16,
  },
  signInButton: {
    backgroundColor: '#FF6C00',
    marginTop: 40,
    marginHorizontal: 50,
    paddingVertical: 12,
    borderRadius: 30,
  },
  signInText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  createAccountButton: {
    marginTop: 12,
    marginHorizontal: 50,
    paddingVertical: 12,
    borderRadius: 30,
    borderColor: '#FF6C00',
    borderWidth: 1,
  },
  createAccountText: {
    textAlign: 'center',
    color: '#FF6C00',
    fontWeight: '600',
    fontSize: 16,
  },
  // gradientText: {
  //   textAlign: 'center',
  //   fontSize: 28,
  //   fontWeight: '600',
  //   lineHeight: 36,
  // },  
});
