import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

interface Props{
  consumed: number;
  tdee: number;
}

const CircularCalorieProgess: React.FC<Props> = ( {consumed, tdee}) => {
  const percent = Math.min(100, Math.max((consumed / tdee) * 100, 1));
  return (
    <View style={styles.container}>
      <AnimatedCircularProgress 
      size={120}
      width={15}
      fill={percent}
      tintColor="red"
      backgroundColor="white" 
      arcSweepAngle={360}
      rotation={0}
      lineCap="round"
      >
      {
      () => (
        <View style={styles.centerCircle}>
          <Text style={styles.kcalText}>{Math.round(percent)}%</Text>
          <Text style={styles.kcalLabel}>{consumed} kcal</Text>
        </View>
      )
      }
      </AnimatedCircularProgress>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#FFA500',
    borderRadius: 16,
    padding: 8,
    margin: 8,
  },
  centerCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFA500',
    borderRadius: 999,
    width: 100,
    height: 100,
  },
  kcalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  kcalLabel: {
    fontSize: 14,
    color: '#000',
  },
});

export default CircularCalorieProgess;