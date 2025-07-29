import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  TextInput, 
  StyleSheet 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const PortionEditor = ({ 
  visible, 
  onClose, 
  onApply, 
  productData,
  initialPortionType = 'per100g', // 'per100g' or 'perServing'
  initialServingCount = 1 
}) => {
  const [portionType, setPortionType] = useState(initialPortionType);
  const [servingCount, setServingCount] = useState(initialServingCount);
  const [customSize, setCustomSize] = useState(100); // For custom size in grams

  // Calculate nutrition values based on current settings
  const calculateNutrition = (baseValue, type) => {
    if (type === 'per100g') {
      return (baseValue * customSize) / 100;
    } else {
      return baseValue * servingCount;
    }
  };

  // Get display text for current portion
  const getPortionDisplayText = () => {
    if (portionType === 'per100g') {
      return `${customSize}g`;
    } else {
      return `${servingCount} serving${servingCount !== 1 ? 's' : ''}`;
    }
  };

  // Handle apply button press
  const handleApply = () => {
    const portionData = {
      type: portionType,
      servingCount: servingCount,
      customSize: customSize,
      displayText: getPortionDisplayText(),
      multiplier: portionType === 'per100g' ? customSize / 100 : servingCount
    };
    onApply(portionData);
    onClose();
  };

  // Get nutrition preview
  const getCaloriesPreview = () => {
    if (portionType === 'per100g') {
      const basePer100g = productData.caloriesPer100g || 0;
      return Math.round((basePer100g * customSize) / 100);
    } else {
      const basePerServing = productData.caloriesPerServing || 0;
      return Math.round(basePerServing * servingCount);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Edit Portion Size</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Portion Type Selector */}
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                portionType === 'per100g' && styles.activeTypeButton
              ]}
              onPress={() => setPortionType('per100g')}
            >
              <Text style={[
                styles.typeButtonText,
                portionType === 'per100g' && styles.activeTypeButtonText
              ]}>
                Per 100g
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.typeButton,
                portionType === 'perServing' && styles.activeTypeButton
              ]}
              onPress={() => setPortionType('perServing')}
            >
              <Text style={[
                styles.typeButtonText,
                portionType === 'perServing' && styles.activeTypeButtonText
              ]}>
                Per Serving
              </Text>
            </TouchableOpacity>
          </View>

          {/* Input Section */}
          {portionType === 'per100g' ? (
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Custom size (grams):</Text>
              <TextInput
                style={styles.textInput}
                value={customSize.toString()}
                onChangeText={(text) => {
                  const value = parseInt(text) || 0;
                  setCustomSize(Math.max(1, Math.min(1000, value)));
                }}
                keyboardType="numeric"
                placeholder="Enter grams"
                selectTextOnFocus
              />
              
              {/* Quick gram options */}
              <View style={styles.quickOptions}>
                {[50, 100, 150, 200, 250].map((gram) => (
                  <TouchableOpacity
                    key={gram}
                    style={[
                      styles.quickOption,
                      customSize === gram && styles.activeQuickOption
                    ]}
                    onPress={() => setCustomSize(gram)}
                  >
                    <Text style={[
                      styles.quickOptionText,
                      customSize === gram && styles.activeQuickOptionText
                    ]}>
                      {gram}g
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Number of servings:</Text>
              <Text style={styles.servingHint}>
                (e.g., 1, 2, or 3 pieces in a chocolate box)
              </Text>
              
              {/* Serving counter */}
              <View style={styles.servingCounter}>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => setServingCount(Math.max(1, servingCount - 1))}
                >
                  <Ionicons name="remove" size={20} color="white" />
                </TouchableOpacity>
                
                <TextInput
                  style={styles.servingInput}
                  value={servingCount.toString()}
                  onChangeText={(text) => {
                    const value = parseInt(text) || 1;
                    setServingCount(Math.max(1, Math.min(20, value)));
                  }}
                  keyboardType="numeric"
                  textAlign="center"
                  selectTextOnFocus
                />
                
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => setServingCount(Math.min(20, servingCount + 1))}
                >
                  <Ionicons name="add" size={20} color="white" />
                </TouchableOpacity>
              </View>
              
              {/* Quick serving options */}
              <View style={styles.quickOptions}>
                {[1, 2, 3, 4, 5].map((count) => (
                  <TouchableOpacity
                    key={count}
                    style={[
                      styles.quickOption,
                      servingCount === count && styles.activeQuickOption
                    ]}
                    onPress={() => setServingCount(count)}
                  >
                    <Text style={[
                      styles.quickOptionText,
                      servingCount === count && styles.activeQuickOptionText
                    ]}>
                      {count}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Preview Section */}
          <View style={styles.previewSection}>
            <Text style={styles.previewTitle}>Nutrition Preview</Text>
            <View style={styles.previewContent}>
              <View style={styles.previewItem}>
                <Ionicons name="flame" size={18} color="#FF6B35" />
                <Text style={styles.previewText}>
                  {getCaloriesPreview()} kcal
                </Text>
              </View>
              <Text style={styles.previewPortion}>
                {getPortionDisplayText()}
              </Text>
            </View>
          </View>

          {/* Apply Button */}
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply Portion Size</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 16,
    padding: 20,
    minWidth: 340,
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTypeButton: {
    backgroundColor: '#4CAF50',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTypeButtonText: {
    color: 'white',
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  servingHint: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  textInput: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  servingCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  counterButton: {
    width: 44,
    height: 44,
    backgroundColor: '#4CAF50',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  servingInput: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 20,
    minWidth: 80,
    textAlign: 'center',
  },
  quickOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    minWidth: 50,
    alignItems: 'center',
  },
  activeQuickOption: {
    backgroundColor: '#4CAF50',
  },
  quickOptionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  activeQuickOptionText: {
    color: 'white',
  },
  previewSection: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  previewContent: {
    alignItems: 'center',
  },
  previewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginLeft: 8,
  },
  previewPortion: {
    fontSize: 12,
    color: '#666',
  },
  applyButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PortionEditor;