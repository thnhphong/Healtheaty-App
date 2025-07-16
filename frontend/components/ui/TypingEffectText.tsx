import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';

interface TypingEffectTextProps {
  text: string;
  speed?: number;       // Typing speed in ms
  deleteSpeed?: number; // Deleting speed in ms
  pauseDuration?: number; // Pause before delete (ms)
  style?: TextStyle;
}

const TypingEffectText: React.FC<TypingEffectTextProps> = ({
  text,
  speed = 80,
  deleteSpeed = 16,
  pauseDuration = 800,
  style,
}) => {
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (!isDeleting && index < text.length) {
      // Typing effect
      timeout = setTimeout(() => {
        setDisplayed(text.slice(0, index + 1));
        setIndex(prev => prev + 1);
      }, speed);
    } else if (!isDeleting && index === text.length) {
      // Pause before deleting
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, pauseDuration);
    } else if (isDeleting && index > 0) {
      // Deleting effect
      timeout = setTimeout(() => {
        setDisplayed(text.slice(0, index - 1));
        setIndex(prev => prev - 1);
      }, deleteSpeed);
    } else if (isDeleting && index === 0) {
      // Restart typing
      setIsDeleting(false);
    }

    return () => clearTimeout(timeout);
  }, [index, isDeleting, text, speed, deleteSpeed, pauseDuration]);

  return <Text style={[styles.subtitle, style]}>{displayed}</Text>;
};

export default TypingEffectText;

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 20,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
});
