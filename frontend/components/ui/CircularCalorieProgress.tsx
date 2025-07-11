import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

interface Props {
  consumed: number;
  tdee: number;
}

const CircularCalorieProgress: React.FC<Props> = ({ consumed, tdee }) => {
  // Đảm bảo giá trị không âm và hợp lệ
  const safeConsumed = Math.max(0, consumed || 0);
  const safeTdee = Math.max(1, tdee || 1); // Tránh chia cho 0
  
  const percent = Math.min(100, Math.max(0, (safeConsumed / safeTdee) * 100));
  const remaining = Math.max(0, safeTdee - safeConsumed);
  
  // Thay đổi màu dựa trên tiến trình
  const getProgressColor = () => {
    if (percent <= 50) return '#4CAF50'; // Xanh lá - an toàn
    if (percent <= 80) return '#FF9800'; // Cam - cảnh báo
    return '#F44336'; // Đỏ - vượt quá
  };

  return (
    <View style={styles.container}>
      <AnimatedCircularProgress 
        size={120}
        width={15}
        fill={percent}
        tintColor={getProgressColor()}
        backgroundColor="rgba(255, 255, 255, 0.3)" 
        arcSweepAngle={360}
        rotation={0}
        lineCap="round"
        duration={1000}
      >
        {() => (
          <View style={styles.centerCircle}>
            <Text style={styles.percentText}>{Math.round(percent)}%</Text>
            <Text style={styles.consumedText}>{safeConsumed}</Text>
            <Text style={styles.kcalLabel}>kcal</Text>
          </View>
        )}
      </AnimatedCircularProgress>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#FFA500',
    borderRadius: 16,
    padding: 10,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  centerCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFA500',
    borderRadius: 50, // Thay đổi từ 999 thành 50
    width: 90,  // Giảm kích thước để phù hợp hơn
    height: 90,
  },
  percentText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  consumedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  kcalLabel: {
    fontSize: 12,
    color: '#000',
    opacity: 0.8,
  },
  remainingText: {
    fontSize: 10,
    color: '#000',
    opacity: 0.7,
    marginTop: 2,
    textAlign: 'center',
  },
});

export default CircularCalorieProgress;