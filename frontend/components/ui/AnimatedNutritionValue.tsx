// frontend/components/ui/AnimatedNutritionValue.tsx
import React, { useEffect, useRef } from 'react';
import { Text, Animated, StyleSheet } from 'react-native';

interface AnimatedNutritionValueProps {
  value: number;
  suffix?: string;
  duration?: number;
  style?: any;
}

const AnimatedNutritionValue: React.FC<AnimatedNutritionValueProps> = ({
  value,
  suffix = '',
  duration = 1000,
  style
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const displayValue = useRef(0);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value,
      duration: duration,
      useNativeDriver: false,
    }).start();

    animatedValue.addListener(({ value }) => {
      displayValue.current = Math.round(value);
    });

    return () => {
      animatedValue.removeAllListeners();
    };
  }, [value, duration]);

  const [displayText, setDisplayText] = React.useState('0');

  useEffect(() => {
    const listener = animatedValue.addListener(({ value }) => {
      setDisplayText(Math.round(value).toString());
    });

    return () => {
      animatedValue.removeListener(listener);
    };
  }, [animatedValue]);

  return (
    <Text style={[styles.nutritionValue, style]}>
      {displayText}{suffix}
    </Text>
  );
};

const styles = StyleSheet.create({
  nutritionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
});

export default AnimatedNutritionValue;