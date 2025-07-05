import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  // Header section
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 16,
    color: '#212529',
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
    backgroundColor: '#e9ecef',
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },

  avatarOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  changePhotoButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  changePhotoText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },

  // Form section
  formSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
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

  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#495057',
    marginBottom: 8,
  },

  requiredLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#495057',
    marginBottom: 8,
  },

  requiredAsterisk: {
    color: '#dc3545',
  },

  input: {
    borderWidth: 1.5,
    borderColor: '#dee2e6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#212529',
    minHeight: 50,
    marginBottom: 12,
  },

  inputFocused: {
    borderColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },

  inputError: {
    borderColor: '#dc3545',
  },

  disabledInput: {
    backgroundColor: '#f8f9fa',
    color: '#6c757d',
    borderColor: '#e9ecef',
  },

  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  // Original picker styles
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
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
    color: '#333',
  },
    // Add these to your existing styles
  genderButton: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  genderButtonText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
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
    borderBottomColor: '#eee',
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
    color: '#007AFF',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },



  // Grid-specific picker adjustments
  gridPickerContainer: {
    borderWidth: 1.5,
    borderColor: '#dee2e6',
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
    minHeight: 20,
  },

  // Helper text
  helperText: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 4,
    fontStyle: 'italic',
  },

  errorText: {
    fontSize: 14,
    color: '#dc3545',
    marginTop: 4,
  },

  // Action buttons section
  actionsSection: {
    marginTop: 20,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
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
    color: '#FF6B35',
    flex: 1,
  },

  menuItemArrow: {
    color: '#6c757d',
  },

  // Save button
  saveButtonContainer: {
    marginTop: 32,
    paddingHorizontal: 20,
  },

  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    minHeight: 54,
  },

  saveButtonPressed: {
    backgroundColor: '#0056b3',
    transform: [{ scale: 0.98 }],
  },

  saveButtonDisabled: {
    backgroundColor: '#6c757d',
    shadowOpacity: 0.1,
  },

  saveButtonText: {
    color: '#fff',
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
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6c757d',
  },

  // Responsive design
  smallScreen: {
    paddingHorizontal: 16,
  },

  // Activity factor section
  activityButton: {
    minHeight: 60,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
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
    color: '#333',
    fontWeight: '500',
  },
  activityDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  activityModalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  activityOptionButton: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedOption: {
    backgroundColor: '#f0f8ff',
    borderColor: '#007AFF',
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
    color: '#333',
    marginBottom: 2,
  },
  activityOptionValue: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
    marginBottom: 2,
  },
  activityOptionDescription: {
    fontSize: 13,
    color: '#666',
  },
  selectedOptionText: {
    color: '#007AFF',
  },
  selectedOptionDescText: {
    color: '#0056b3',
  },
});