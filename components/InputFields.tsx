// components/InputField.tsx
import { TextInput, StyleSheet } from 'react-native';

export default function InputField({ placeholder, secureTextEntry = false }: { placeholder: string; secureTextEntry?: boolean }) {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#aaa"
      secureTextEntry={secureTextEntry}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    fontSize: 16,
  },
});
