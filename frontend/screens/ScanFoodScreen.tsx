import { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Modal,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../../backend/config/firebase';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { styles } from '../styles/ScanFoodScreen';
import AnimatedNutritionValue from '../components/ui/AnimatedNutritionValue';

// Types
interface OpenFoodFactsProduct {
  product_name?: string;
  brands?: string;
  nutriscore_grade?: string;
  nutriments?: {
    energy_kcal_100g?: number;
    fat_100g?: number;
    carbohydrates_100g?: number;
    proteins_100g?: number;
    sugars_100g?: number;
    fiber_100g?: number;
    salt_100g?: number;
  };
  image_url?: string;
  ingredients_text?: string;
  categories?: string;
  serving_size?: string;
}

interface ScannedProduct {
  barcode: string;
  productName: string;
  brand: string;
  calories: number;
  nutrients: {
    fat: number;
    carbs: number;
    protein: number;
    sugar: number;
    fiber: number;
    salt: number;
  };
  imageUrl: string;
  ingredients: string;
  categories: string;
  servingSize: string;
  nutriScore: string;
}

type ScanMode = 'photo' | 'barcode';

export default function ScanFoodScreen() {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');
  const [scanMode, setScanMode] = useState<ScanMode>('photo');
  const [scannedProduct, setScannedProduct] = useState<ScannedProduct | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  // Request camera permission on mount
  useEffect(() => {
    const requestCameraPermission = async () => {
      if (permission && !permission.granted) {
        const newPermission = await requestPermission();
        if (!newPermission.granted) {
          Alert.alert(
            "Permission Required", 
            "Camera access is required for scanning food. Please enable it in settings."
          );
        }
      }
    };

    requestCameraPermission();
  }, [permission, requestPermission]);

  
  const onCameraReady = useCallback(() => {
    setCameraReady(true);
  }, []);

  
  const fetchProductData = async (barcode: string): Promise<ScannedProduct | null> => {
    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await response.json();
      
      if (data.status === 1 && data.product) {
        const product: OpenFoodFactsProduct = data.product;
        
        return {
          barcode,
          productName: product.product_name || 'Unknown Product',
          brand: product.brands || 'Unknown Brand',
          calories: product.nutriments?.energy_kcal_100g || 0,
          nutrients: {
            fat: product.nutriments?.fat_100g || 0,
            carbs: product.nutriments?.carbohydrates_100g || 0,
            protein: product.nutriments?.proteins_100g || 0,
            sugar: product.nutriments?.sugars_100g || 0,
            fiber: product.nutriments?.fiber_100g || 0,
            salt: product.nutriments?.salt_100g || 0,
          },
          imageUrl: product.image_url || '',
          ingredients: product.ingredients_text || '',
          categories: product.categories || '',
          servingSize: product.serving_size || '100g',
          nutriScore: product.nutriscore_grade || 'unknown',
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching product data:', error);
      return null;
    }
  };

  // Save product to Firebase
  const saveProductToFirebase = async (product: ScannedProduct) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      const productData = {
        ...product,
        userId: user.uid,
        scannedAt: new Date().toISOString(),
        dateAdded: new Date().toISOString(),
      };

    
      await addDoc(collection(db, 'scannedProducts'), productData);

      
      const today = new Date().toISOString().split('T')[0];
      const diaryRef = doc(db, 'foodDiary', `${user.uid}_${today}`);
      
      await setDoc(diaryRef, {
        userId: user.uid,
        date: today,
        foods: [productData], 
      }, { merge: true });

      Alert.alert('Success', 'Product saved successfully!');
    } catch (error) {
      console.error('Error saving product:', error);
      Alert.alert('Error', 'Failed to save product. Please try again.');
    }
  };

  
  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (isScanning) return;
    
    setIsScanning(true);
    setIsLoading(true);
    
    try {
      const product = await fetchProductData(data);
      
      if (product) {
        setScannedProduct(product);
        setShowProductModal(true);
      } else {
        Alert.alert(
          'Product Not Found',
          'This product was not found in our database. Please try scanning again or enter the product manually.'
        );
      }
    } catch (error) {
      console.error('Error processing barcode:', error);
      Alert.alert('Error', 'Failed to process barcode. Please try again.');
    } finally {
      setIsLoading(false);
      setIsScanning(false);
    }
  };

  // Take photo with camera
  const takePhoto = useCallback(async () => {
    if (!cameraRef.current || !cameraReady) {
      Alert.alert("Error", "Camera is not ready");
      return;
    }

    try {
      setIsLoading(true);
      
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        exif: false,
      });
      
      if (photo) {
        setImageUri(photo.uri);
        console.log('Photo taken:', photo.uri);
      }
      
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert("Error", "Failed to take photo. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [cameraReady]);

  // Pick image from library
  const openImageLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      handleImageResult(result);
    } catch (error) {
      console.error('Error opening image library:', error);
      Alert.alert('Error', 'Failed to open image library');
    }
  };

  // Helper function to handle image result
  const handleImageResult = (result) => {
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      setImageUri(selectedImage.uri);
      console.log('Image selected:', selectedImage.uri);
    }
  };
  // Reset to camera view
  const resetCamera = () => {
    setImageUri(null);
    setScannedProduct(null);
    setShowProductModal(false);
    setIsScanning(false);
  };

  // Handle food analysis (placeholder)
  const analyzeFoodImage = async () => {
    if (!imageUri) return;

    try {
      setIsLoading(true);
      
      // TODO: Replace with your actual food recognition API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert("Analysis Complete", "Food has been analyzed successfully!");
      
    } catch (error) {
      console.error('Error analyzing food:', error);
      Alert.alert("Error", "Failed to analyze food. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Switch scan mode
  const switchScanMode = () => {
    setScanMode(scanMode === 'photo' ? 'barcode' : 'photo');
    resetCamera();
  };

  // Loading state
  if (!permission) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading camera...</Text>
      </View>
    );
  }

  // Permission denied
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-outline" size={64} color="#ccc" />
        <Text style={styles.permissionText}>Camera permission is required</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!imageUri ? (
        <>
          {/* Camera View */}
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={facing}
            onCameraReady={onCameraReady}
            onBarcodeScanned={scanMode === 'barcode' ? handleBarCodeScanned : undefined}
            barcodeScannerSettings={{
              barcodeTypes: ['ean13', 'ean8', 'code128', 'code39', 'upc_a', 'upc_e'],
            }}
          >
            {/* Camera Overlay */}
            <View style={styles.cameraOverlay}>
              {/* Top Controls */}
              <View style={styles.topControls}>
                <TouchableOpacity 
                  style={styles.modeButton} 
                  onPress={switchScanMode}
                >
                  <Ionicons 
                    name={scanMode === 'photo' ? 'barcode-outline' : 'camera-outline'} 
                    size={28} 
                    color="white" 
                  />
                  <Text style={styles.modeButtonText}>
                    {scanMode === 'photo' ? 'Barcode' : 'Photo'}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.libraryButton} 
                  onPress={openImageLibrary}
                >
                  <Ionicons name="image-outline" size={28} color="white" />
                </TouchableOpacity>
              </View>

              {/* Scanning Frame */}
              <View style={styles.scanningFrame}>
                <View style={styles.corner} />
                <View style={[styles.corner, styles.cornerTopRight]} />
                <View style={[styles.corner, styles.cornerBottomLeft]} />
                <View style={[styles.corner, styles.cornerBottomRight]} />
                <Text style={styles.scanningText}>
                  {scanMode === 'photo' 
                    ? 'Position food in the frame' 
                    : 'Align barcode within the frame'
                  }
                </Text>
              </View>

              {/* Bottom Controls */}
              <View style={styles.bottomControls}>
                {scanMode === 'photo' && (
                  <TouchableOpacity 
                    style={[styles.captureButton, isLoading && styles.captureButtonDisabled]}
                    onPress={takePhoto}
                    disabled={isLoading || !cameraReady}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Ionicons name="camera" size={32} color="white" />
                    )}
                  </TouchableOpacity>
                )}
                
                {scanMode === 'barcode' && (
                  <View style={styles.barcodeInstructions}>
                    <Text style={styles.barcodeInstructionsText}>
                      {isScanning ? 'Scanning...' : 'Point camera at barcode'}
                    </Text>
                    {isLoading && <ActivityIndicator size="small" color="#fff" />}
                  </View>
                )}
              </View>
            </View>
          </CameraView>
        </>
      ) : (
        <>
          {/* Image Preview */}
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
          
          {/* Preview Overlay */}
          <View style={styles.previewOverlay}>
            <TouchableOpacity style={styles.backButton} onPress={resetCamera}>
              <Ionicons name="arrow-back" size={28} color="white" />
            </TouchableOpacity>
          </View>

          {/* Result Card */}
          <View style={styles.resultCard}>
            <View style={styles.foodInfoRow}>
              <Image
                source={{ uri: imageUri }}
                style={styles.foodImage}
              />
              <View style={styles.foodInfo}>
                <Text style={styles.resultText}>Analyze this food image</Text>
                <Text style={styles.resultSubtext}>
                  Tap to get nutritional information
                </Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={[styles.analyzeButton, isLoading && styles.analyzeButtonDisabled]}
              onPress={analyzeFoodImage}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.analyzeButtonText}>Analyze Food</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Product Details Modal */}
      <Modal
        visible={showProductModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowProductModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowProductModal(false)}>
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Product Details</Text>
            <View style={{ width: 28 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            {scannedProduct && (
              <>
                {/* Product Image */}
                {scannedProduct.imageUrl ? (
                  <Image 
                    source={{ uri: scannedProduct.imageUrl }} 
                    style={styles.productImage} 
                  />
                ) : (
                  <View style={styles.placeholderImage}>
                    <Ionicons name="image-outline" size={48} color="#ccc" />
                  </View>
                )}

                {/* Product Info */}
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{scannedProduct.productName}</Text>
                  <Text style={styles.productBrand}>{scannedProduct.brand}</Text>
                  <Text style={styles.productBarcode}>Barcode: {scannedProduct.barcode}</Text>
                  
                  {/* Nutri-Score */}
                  {scannedProduct.nutriScore !== 'unknown' && (
                    <View style={styles.nutriScoreContainer}>
                      <Text style={styles.nutriScoreLabel}>Nutri-Score: </Text>
                      <View style={[styles.nutriScoreBadge, { backgroundColor: getNutriScoreColor(scannedProduct.nutriScore) }]}>
                        <Text style={styles.nutriScoreText}>{scannedProduct.nutriScore.toUpperCase()}</Text>
                      </View>
                    </View>
                  )}

                  {/* Nutrition Facts */}
                {/* Nutrition Facts */}
              <View style={styles.nutritionSection}>
              <Text style={styles.sectionTitle}>Nutrition Facts (per 100g)</Text>
              <View style={styles.nutritionGrid}>
                {[
                { label: 'Calories', rawValue: parseFloat(scannedProduct.calories) || 0, icon: 'flame', suffix: ' kcal' },
                { label: 'Fat', rawValue: parseFloat(scannedProduct.nutrients.fat) || 0, icon: 'pizza', suffix: 'g' },
                { label: 'Carbs', rawValue: parseFloat(scannedProduct.nutrients.carbs) || 0, icon: 'leaf', suffix: 'g' },
                { label: 'Protein', rawValue: parseFloat(scannedProduct.nutrients.protein) || 0, icon: 'fitness', suffix: 'g' },
                { label: 'Sugar', rawValue: parseFloat(scannedProduct.nutrients.sugar) || 0, icon: 'ice-cream', suffix: 'g' },
                { label: 'Fiber', rawValue: parseFloat(scannedProduct.nutrients.fiber) || 0, icon: 'barbell', suffix: 'g' },
              ].map((item, index) => (
                <View key={index} style={styles.nutritionItemCard}>
                  <Ionicons name={item.icon} size={24} color="#4CAF50" style={styles.nutritionIcon} />
                  <Text style={styles.nutritionLabel}>{item.label}</Text>
                  <AnimatedNutritionValue value={item.rawValue} suffix={item.suffix} duration={2000} />
                </View>
              ))}
              </View>
                </View>
                  {/* Ingredients */}
                  {scannedProduct.ingredients && (
                    <View style={styles.ingredientsSection}>
                      <Text style={styles.sectionTitle}>Ingredients</Text>
                      <Text style={styles.ingredientsText}>{scannedProduct.ingredients}</Text>
                    </View>
                  )}
                </View>

                {/* Save Button */}
                <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={() => {
                    saveProductToFirebase(scannedProduct);
                    setShowProductModal(false);
                    resetCamera();
                  }}
                >
                  <Text style={styles.saveButtonText}>Save to My Foods</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

// Helper function to get nutri-score color
const getNutriScoreColor = (grade: string): string => {
  switch (grade.toLowerCase()) {
    case 'a': return '#00AA00';
    case 'b': return '#7FBF00';
    case 'c': return '#FFAA00';
    case 'd': return '#FF7F00';
    case 'e': return '#FF0000';
    default: return '#999';
  }
};
