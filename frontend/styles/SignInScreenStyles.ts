import { StyleSheet, Dimensions } from 'react-native';
import Colors from '../constants/Colors';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    minHeight: height, // Đảm bảo ScrollView có chiều cao tối thiểu
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginLeft: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 40,
  },
  formContainer: {
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: '#333333',
    marginBottom: 16,
    color: Colors.primaryInputText,
    backgroundColor: Colors.primaryInput,
  },
  signInButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 50,
    paddingVertical: 20,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
    shadowColor: '#FF6B35',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
    shadowOpacity: 0,
    elevation: 0,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPasswordText: {
    color: '#FF6B35',
    fontSize: 14,
    textAlign: 'center',
  },
  signInGoogleContainer: {
    marginBottom: 30,
  },
  signInGoogleText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 12,
  },
  signInGoogleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4285F4',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#4285F4',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signInGoogleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#666666',
    marginRight: 4,
  },
  signUpLink: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: 'bold',
  },
});