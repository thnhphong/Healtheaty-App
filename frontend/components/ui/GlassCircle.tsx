import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

const GlassCircle = ({ size = 200, children }) => {
  return (
    <View style={styles.container}>
      {/* Background gradient */}
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Glass circle */}
      <View style={[styles.glassContainer, { width: size, height: size, borderRadius: size / 2 }]}>
        <BlurView intensity={20} style={styles.blurContainer}>
          <LinearGradient
            colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.05)']}
            style={styles.glassGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <View style={styles.innerGlow} />
          <View style={styles.content}>
            {children}
          </View>
        </BlurView>
      </View>
      
      {/* Additional decorative circles */}
      <View style={[styles.decorativeCircle, styles.circle1]} />
      <View style={[styles.decorativeCircle, styles.circle2]} />
      <View style={[styles.decorativeCircle, styles.circle3]} />
    </View>
  );
};

const App = () => {
  return (
    <GlassCircle size={250}>
      <View style={styles.contentExample}>
        <View style={styles.dot} />
        <View style={styles.ring} />
      </View>
    </GlassCircle>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  background: {
    position: 'absolute',
    width: width * 1.5,
    height: height * 1.5,
    opacity: 0.3,
  },
  glassContainer: {
    overflow: 'hidden',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  blurContainer: {
    flex: 1,
    borderRadius: 125,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  glassGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 125,
  },
  innerGlow: {
    position: 'absolute',
    top: 2,
    left: 2,
    right: 2,
    bottom: 2,
    borderRadius: 123,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentExample: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    marginBottom: 20,
  },
  ring: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  decorativeCircle: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  circle1: {
    width: 100,
    height: 100,
    top: '20%',
    left: '10%',
  },
  circle2: {
    width: 60,
    height: 60,
    top: '70%',
    right: '15%',
  },
  circle3: {
    width: 80,
    height: 80,
    top: '15%',
    right: '20%',
  },
});

export default GlassCircle;