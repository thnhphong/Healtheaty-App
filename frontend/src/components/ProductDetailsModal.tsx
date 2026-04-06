import Colors from '../constants/Colors';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScannedProduct } from '../types/product';
import AnimatedNutritionValue from './ui/AnimatedNutritionValue';
import { styles } from '../styles/ScanFoodScreen';

interface ProductDetailsModalProps {
  visible: boolean;
  product: ScannedProduct | null;
  onClose: () => void;
  onSave: (product: ScannedProduct) => void;
  showPerServing: boolean;
  onToggleServing: () => void;
}

const getNutriScoreColor = (grade: string): string => {
  switch (grade.toLowerCase()) {
    case 'a': return Colors.nutriScore.A;
    case 'b': return Colors.nutriScore.B;
    case 'c': return Colors.nutriScore.C;
    case 'd': return Colors.nutriScore.D;
    case 'e': return Colors.nutriScore.E;
    default: return Colors.textLight;
  }
};

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  visible,
  product,
  onClose,
  onSave,
  showPerServing,
  onToggleServing,
}) => {
  if (!product) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={28} color=Colors.text />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>
            {product.isVietnameseFood ? 'Food Detected' : 
             product.isFromPhoto ? 'Detected Food' : 'Product Details'}
          </Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView style={styles.modalContent}>
          {product.imageUrl ? (
            <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons name="image-outline" size={48} color=Colors.graySilver />
            </View>
          )}

          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.productName}</Text>
            {product.brand && <Text style={styles.productBrand}>{product.brand}</Text>}
            {product.barcode && <Text style={styles.productBarcode}>Barcode: {product.barcode}</Text>}
            
            {product.nutriScore && product.nutriScore !== 'unknown' && (
              <View style={styles.nutriScoreContainer}>
                <Text style={styles.nutriScoreLabel}>Nutri-Score: </Text>
                <View style={[styles.nutriScoreBadge, { backgroundColor: getNutriScoreColor(product.nutriScore) }]}>
                  <Text style={styles.nutriScoreText}>{product.nutriScore.toUpperCase()}</Text>
                </View>
              </View>
            )}

            <View style={styles.nutritionSection}>
              <Text style={styles.sectionTitle}>
                🍽️ Nutrition Facts ({showPerServing ? 'per serving' : 'per 100g'} - {product.servingSize})
              </Text>
              
              <TouchableOpacity onPress={onToggleServing}>
                <Text style={{ color: 'blue', marginBottom: 10 }}>
                  {showPerServing ? 'Switch to per 100g' : 'Switch to per serving'}
                </Text>
              </TouchableOpacity>

              <View style={styles.nutritionGrid}>
                <View style={styles.nutritionItemCard}>
                  <Ionicons name="flame" size={24} color=Colors.primary style={styles.nutritionIcon} />
                  <Text style={styles.nutritionLabel}>Calories</Text>
                  <AnimatedNutritionValue value={product.calories} suffix=" kcal" duration={2000} />
                </View>
                
                {product.nutrients && (
                  <>
                    <View style={styles.nutritionItemCard}>
                      <Ionicons name="fitness" size={24} color=Colors.success style={styles.nutritionIcon} />
                      <Text style={styles.nutritionLabel}>Protein</Text>
                      <AnimatedNutritionValue 
                        value={showPerServing ? product.nutrientsPerServing?.protein ?? 0 : product.nutrients.protein} 
                        suffix="g" 
                        duration={2000} 
                      />
                    </View>
                    
                    <View style={styles.nutritionItemCard}>
                      <Ionicons name="leaf" size={24} color=Colors.accentBlue style={styles.nutritionIcon} />
                      <Text style={styles.nutritionLabel}>Carbs</Text>
                      <AnimatedNutritionValue 
                        value={showPerServing ? product.nutrientsPerServing?.carbs ?? 0 : product.nutrients.carbs} 
                        suffix="g" 
                        duration={2000} 
                      />
                    </View>
                    
                    <View style={styles.nutritionItemCard}>
                      <Ionicons name="pizza" size={24} color=Colors.warning style={styles.nutritionIcon} />
                      <Text style={styles.nutritionLabel}>Fat</Text>
                      <AnimatedNutritionValue 
                        value={showPerServing ? product.nutrientsPerServing?.fat ?? 0 : product.nutrients.fat} 
                        suffix="g" 
                        duration={2000} 
                      />
                    </View>
                  </>
                )}
              </View>
            </View>

            {product.ingredients && (
              <View style={styles.ingredientsSection}>
                <Text style={styles.sectionTitle}>🥬 Ingredients</Text>
                <Text style={styles.ingredientsText}>{product.ingredients}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity 
            style={[styles.saveButton, product.isVietnameseFood && styles.vietnameseSaveButton]}
            onPress={() => onSave(product)}
          >
            <Text style={styles.saveButtonText}>
              {product.isVietnameseFood ? 'Save Food' : '💾 Save to My Foods'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default ProductDetailsModal;
