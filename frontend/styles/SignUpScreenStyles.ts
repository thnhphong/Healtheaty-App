// frontend/styles/SignUpScreenStyles.ts
import { StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

export const signUpStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    color: '#333',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  formContainer: {
    marginBottom: 30,
  },
  input: {
    backgroundColor: Colors.primaryInput,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 25,
    fontSize: 16,
    marginBottom: 20,
    color: Colors.primaryInputText,
  },
  signUpButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 25,
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#FFB399',
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  signInLink: {
    color: '#FF6B35',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomIndicator: {
    height: 4,
    backgroundColor: '#333',
    marginHorizontal: 150,
    borderRadius: 2,
    marginBottom: 10,
  },
});