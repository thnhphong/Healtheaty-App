// frontend/styles/WelcomeScreenStyles.ts
import { StyleSheet } from 'react-native';

export const welcomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF6B35',
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
    color: '#FFFFFF',
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
    color: '#FFFFFF',
  },
  eatingText: {
    fontSize: 44,
    fontWeight: '700',
    color: '#FFE5B4',
  },
  betterText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    color: '#FFFFFF',
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
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 25,
    marginBottom: 15,
  },
  signInButtonText: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  createAccountButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  createAccountButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});