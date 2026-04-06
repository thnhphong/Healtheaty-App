import Colors from '../constants/Colors';
// frontend/styles/WelcomeScreenStyles.ts
import { StyleSheet } from 'react-native';

export const welcomeStyles  = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    },
  logoText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 30,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  healthyText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: Colors.white,
  },
  eatingText: {
    fontSize: 44,
    fontWeight: '700',
    color: Colors.welcome.lightOrange,
  },
  betterText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: Colors.white,
  },
  subtitle: {
    color: Colors.white,
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.9,
    fontStyle: 'italic',
    fontWeight: '500',
  },
  buttonContainer: {
    gap: 16,
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  signInButton: {
    backgroundColor: Colors.white,
    paddingVertical: 16,
    borderRadius: 25,
    marginBottom: 15,
  },
  signInButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  createAccountButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  createAccountButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});