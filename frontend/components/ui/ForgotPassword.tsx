import React, { useState } from 'react'
import {
  Text,
  View, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  StyleSheet,
} from 'react-native';
//import firebase sendPasswordResetEmail
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../../backend/config/firebase';

import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Navigation } from 'lucide-react-native';


const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const navigation = useNavigation()

  const handleResetPassword = async () => {
    if(!email){
      Alert.alert('Error', 'Please enter your email')
      return;
    }
    try{
      await sendPasswordResetEmail(auth, email)
      Alert.alert('Success', 'Password reset email sent')
      setEmail('');
    }catch(error: any){
      Alert.alert('Reset Failed', error.message)
    }
  }
  return (
    <View style={styles.container}>
      {/* back to the previous screen */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text>Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Forgot Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Send Reset Email</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ForgotPassword

const styles = StyleSheet.create({
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    backgroundColor: '#ccc',
    borderRadius: 50,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    color: '#000',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})
