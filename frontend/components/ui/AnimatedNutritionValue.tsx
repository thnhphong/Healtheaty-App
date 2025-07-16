import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';

interface AnimatedNutritionValueProps {
  value: number;
  suffix?: string;
  duration?: number;
}

const AnimatedNutritionValue: React.FC<AnimatedNutritionValueProps> = ({ value, suffix = '', duration = 1000 }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [displayed, setDisplayed] = useState('0');

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value,
      duration,
      useNativeDriver: false,
    }).start();

    const listener = animatedValue.addListener(({ value: v }) => {
      setDisplayed(`${Math.floor(v)}${suffix}`);
    });

    return () => animatedValue.removeListener(listener);
  }, [value]);

  return <Text style={styles.nutritionValue}>{displayed}</Text>;
};

export default AnimatedNutritionValue;

const styles = StyleSheet.create({
  nutritionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
});
