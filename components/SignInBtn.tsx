// components/SignInBtn.tsx
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Colors from '../app/constants/colors';

export default function SignInBtn({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: Colors.noti,
    padding: 15,
    borderRadius: 100,
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
