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
    backgroundColor: 'white',
    padding: 15,
    borderWidth: 1,
    borderColor: Colors.noti,
    borderRadius: 100,
    alignItems: 'center',
    marginTop: 15,
  },
  text: {
    color: Colors.noti,
    fontWeight: '600',
    fontSize: 16,
  },
});
