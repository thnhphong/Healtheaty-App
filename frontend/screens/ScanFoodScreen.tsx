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
  const pickImageFromLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
        console.log('Image selected:', result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert("Error", "Failed to pick image from library.");
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
                  onPress={pickImageFromLibrary}
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
                  <View style={styles.nutritionSection}>
                    <Text style={styles.sectionTitle}>Nutrition Facts (per 100g)</Text>
                    <View style={styles.nutritionGrid}>
                      <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionLabel}>Calories</Text>
                        <Text style={styles.nutritionValue}>{scannedProduct.calories} kcal</Text>
                      </View>
                      <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionLabel}>Fat</Text>
                        <Text style={styles.nutritionValue}>{scannedProduct.nutrients.fat}g</Text>
                      </View>
                      <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionLabel}>Carbs</Text>
                        <Text style={styles.nutritionValue}>{scannedProduct.nutrients.carbs}g</Text>
                      </View>
                      <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionLabel}>Protein</Text>
                        <Text style={styles.nutritionValue}>{scannedProduct.nutrients.protein}g</Text>
                      </View>
                      <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionLabel}>Sugar</Text>
                        <Text style={styles.nutritionValue}>{scannedProduct.nutrients.sugar}g</Text>
                      </View>
                      <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionLabel}>Fiber</Text>
                        <Text style={styles.nutritionValue}>{scannedProduct.nutrients.fiber}g</Text>
                      </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
  },
  modeButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
    padding: 12,
    alignItems: 'center',
    minWidth: 80,
  },
  modeButtonText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
  },
  libraryButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
    padding: 12,
  },
  scanningFrame: {
    alignSelf: 'center',
    width: 250,
    height: 250,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#00ff00',
    borderWidth: 3,
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    left: 'auto',
    borderLeftWidth: 0,
    borderRightWidth: 3,
    borderBottomWidth: 0,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    top: 'auto',
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 3,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    top: 'auto',
    left: 'auto',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderRightWidth: 3,
    borderBottomWidth: 3,
  },
  scanningText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    textAlign: 'center',
  },
  bottomControls: {
    alignItems: 'center',
    paddingBottom: 50,
  },
  captureButton: {
    backgroundColor: '#007AFF',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  captureButtonDisabled: {
    backgroundColor: '#666',
  },
  barcodeInstructions: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  barcodeInstructionsText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  previewImage: {
    flex: 1,
    width: '100%',
  },
  previewOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  backButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
    padding: 12,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultCard: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  foodInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  foodImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  foodInfo: {
    flex: 1,
  },
  resultText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  resultSubtext: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  analyzeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
  },
  analyzeButtonDisabled: {
    backgroundColor: '#ccc',
  },
  analyzeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  permissionText: {
    fontSize: 18,
    color: '#333',
    marginVertical: 20,
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  placeholderImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  productInfo: {
    marginBottom: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  productBrand: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  productBarcode: {
    fontSize: 12,
    color: '#999',
    marginBottom: 16,
  },
  nutriScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  nutriScoreLabel: {
    fontSize: 16,
    color: '#333',
  },
  nutriScoreBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  nutriScoreText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  nutritionSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  ingredientsSection: {
    marginBottom: 20,
  },
  ingredientsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});