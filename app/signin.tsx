import { View, Text, StyleSheet } from 'react-native';
import InputField from '../components/InputFields';
import CustomButton from '../components/CustomButtons';

export default function SignInScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <InputField placeholder="Email" />
      <InputField placeholder="Password" secureTextEntry />
      <CustomButton title="Login" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});
