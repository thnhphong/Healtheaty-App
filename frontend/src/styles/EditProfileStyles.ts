import Colors from '../constants/Colors';
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },

  // Header section
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSoft,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 16,
    color: Colors.textDark,
  },

  // Content area
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },

  // Profile picture section
  profilePictureSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 16,
  },

  avatarContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 16,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.borderSoft,
    borderWidth: 4,
    borderColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },

  avatarOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.accentBlue,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  changePhotoButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.accentBlue,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  changePhotoText: {
    fontSize: 14,
    color: Colors.white,
    fontWeight: '600',
  },

  // Form section
  formSection: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: 16,
  },

  // Input fields
  inputGroup: {
    marginBottom: 20,
  },

  // Grid layout for form fields
  gridRow: {
    flexDirection: 'row',
    marginHorizontal: -8,
    marginBottom: 20,
  },

  gridColumn: {
    flex: 1,
    marginHorizontal: 8,
  },

  gridInputGroup: {
    marginBottom: 0,
  },
  
  

  requiredLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textGray,
    marginBottom: 8,
  },

  requiredAsterisk: {
    color: Colors.danger,
  },

  input: {
    borderWidth: 1.5,
    borderColor: Colors.borderMedium,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: Colors.white,
    color: Colors.textDark,
    minHeight: 50,
    marginBottom: 12,
  },

  inputFocused: {
    borderColor: Colors.accentBlue,
    shadowColor: Colors.accentBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },

  inputError: {
    borderColor: Colors.danger,
  },

  disabledInput: {
    backgroundColor: Colors.backgroundLight,
    color: Colors.textMuted,
    borderColor: Colors.borderSoft,
  },

  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: Colors.text,
  },
  // Original picker styles
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 8,
    backgroundColor: Colors.white,
    height: 50,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  pickerItem: {
    fontSize: 16,
    height: 50,
    color: Colors.text,
  },
    // Add these to your existing styles
  genderButton: {
    height: 50,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  genderButtonText: {
    fontSize: 16,
    color: Colors.text,
  },
  dropdownIcon: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  optionButton: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderExtraSoft,
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  cancelButton: {
    paddingVertical: 15,
    marginTop: 10,
  },
  cancelText: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.accentBlue,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },



  // Grid-specific picker adjustments
  gridPickerContainer: {
    borderWidth: 1.5,
    borderColor: Colors.borderMedium,
    borderRadius: 8,
    backgroundColor: Colors.white,
    overflow: 'hidden',
    minHeight: 20,
  },

  // Helper text
  helperText: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 4,
    fontStyle: 'italic',
  },

  errorText: {
    fontSize: 14,
    color: Colors.danger,
    marginTop: 4,
  },

  // Action buttons section
  actionsSection: {
    marginTop: 20,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  menuItemIcon: {
    marginRight: 16,
  },

  menuText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary,
    flex: 1,
  },

  menuItemArrow: {
    color: Colors.textMuted,
  },

  // Save button
  saveButtonContainer: {
    marginTop: 32,
    paddingHorizontal: 20,
  },

  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.accentBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    minHeight: 54,
  },

  saveButtonPressed: {
    backgroundColor: Colors.primary,
    transform: [{ scale: 0.98 }],
  },

  saveButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  // Loading state
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.overlayStrongWhite,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.textMuted,
  },

  // Responsive design
  smallScreen: {
    paddingHorizontal: 16,
  },

  // Activity factor section
  activityButton: {
    minHeight: 60,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  activityButtonContent: {
    flex: 1,
  },
  activityButtonText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  activityDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  activityModalContent: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  activityOptionButton: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderExtraSoft,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedOption: {
    backgroundColor: Colors.accentLightBlue,
    borderColor: Colors.accentBlue,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 4,
  },
  activityOptionContent: {
    flex: 1,
  },
  activityOptionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 2,
  },
  activityOptionValue: {
    fontSize: 14,
    color: Colors.accentBlue,
    fontWeight: '500',
    marginBottom: 2,
  },
  activityOptionDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  selectedOptionText: {
    color: Colors.accentBlue,
  },
  selectedOptionDescText: {
    color: '#0056b3',
  },
  // Thêm vào EditProfileStyles.ts
successModalOverlay: {
  flex: 1,
  backgroundColor: Colors.overlay,
  justifyContent: 'center',
  alignItems: 'center',
},
successModalContent: {
  backgroundColor: 'white',
  borderRadius: 20,
  padding: 20,
  alignItems: 'center',
  minWidth: 250,
  minHeight: 200,
},
successAnimation: {
  width: 120,
  height: 120,
},
successText: {
  fontSize: 18,
  fontWeight: 'bold',
  color: Colors.text,
  textAlign: 'center',
  marginTop: 10,
},
changePhoto: {
  marginTop: 10,
  fontSize: 14,
  color: Colors.textDisabled
},
disabled: {
  opacity: 0.5
}

});