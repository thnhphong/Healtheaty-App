import Colors from '../constants/Colors';
import { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
  ScrollView,
  Animated,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../services/firebase';
import { collection, addDoc, doc, setDoc, arrayUnion } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { styles } from '../styles/ScanFoodScreen';
import AnimatedNutritionValue from '../components/ui/AnimatedNutritionValue';
import { uploadImageToCloudinary } from '../utils/uploadImageToCloudinary';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { vietnameseFoodNutrition } from '../constants/foodCalorieDatabase';

type RootStackParamList = {
  History: { refresh?: number };
};

type NavigationProps = StackNavigationProp<RootStackParamList>;

// Types for Vietnamese Food API
interface VietnameseFoodPrediction {
  rank: number;
  class_id: string;
  class_name: string;
  confidence: number;
  percentage: number;
}

interface VietnameseFoodAPIResponse {
  success: boolean;
  best_prediction: {
    food_name: string;
    confidence: number;
    percentage: number;
  };
  top_predictions: VietnameseFoodPrediction[];
  model_info: {
    total_classes: number;
    model_type: string;
    tensorflow_version: string;
  };
  error?: string;
  message?: string;
}

// Existing types
interface CameraPhotoResult {
  uri: string;
  width?: number;
  height?: number;
  base64?: string;
  exif?: any;
}

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
  nutrientsPerServing?: {
    fat: number;
    carbs: number;
    protein: number;
    sugar: number;
    fiber: number;
    salt: number;
  };
  image_url?: string;
  ingredients_text?: string;
  categories?: string;
  serving_size?: string;
}

interface ScannedProduct {
  barcode?: string;
  productName: string;
  brand?: string;
  caloriesPer100g?: number;
  caloriesPerServing?: number;
  calories: number;
  nutrients?: {
    fat: number;
    carbs: number;
    protein: number;
    sugar: number;
    fiber: number;
    salt: number;
  };
  nutrientsPerServing?: {
    fat: number;
    carbs: number;
    protein: number;
    sugar: number;
    fiber: number;
    salt: number;
  };
  imageUrl: string;
  ingredients?: string;
  servingSize: string;
  nutriScore?: string;
  isFromPhoto?: boolean;
  // New fields for Vietnamese food
  confidence?: number;
  isVietnameseFood?: boolean;
  allPredictions?: VietnameseFoodPrediction[];
}

type ScanMode = 'photo' | 'barcode';


  const VIETNAMESE_FOOD_API_URL = 'http://192.168.1.2:5000'; 
// const VIETNAMESE_FOOD_API_URL = 'https://vietnamese-food-classifier-api-production.up.railway.app';


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
  const [vietnameseFoodPredictions, setVietnameseFoodPredictions] = useState<VietnameseFoodPrediction[]>([]);
  const [isMounted, setIsMounted] = useState(true);
  const [showPerServing, setShowPerServing] = useState(true);
  
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation<NavigationProps>();
  const VIETNAMESE_FOOD_API_URL = 'http://10.11.73.47:8000';
  // ==========================================
  // 🍜 VIETNAMESE FOOD API FUNCTIONS
  // ==========================================

  const analyzeVietnameseFood = async (imageUri: string): Promise<VietnameseFoodAPIResponse> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    try {
      console.log('🍜 Analyzing Vietnamese food with API...');
      
      // Convert image to base64
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: 'base64',
      });

      console.log(`📸 Image converted to base64, size: ${base64.length} characters`);

      const response = await fetch(`${VIETNAMESE_FOOD_API_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          image: base64,
          top_k: 5 
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!isMounted) {
        throw new Error('Component unmounted');
      }

      console.log(`🌐 API Response status: ${response.status}`);
      
      if (response.status === 503) {
        throw new Error('MODEL_NOT_LOADED');
      }
      
      if (response.status === 400) {
        throw new Error('INVALID_IMAGE');
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API Error:`, errorText);
        throw new Error(`API_ERROR_${response.status}`);
      }

      const result: VietnameseFoodAPIResponse = await response.json();
      console.log(`✅ Vietnamese Food API Success:`, JSON.stringify(result, null, 2));
      
      if (!result.success) {
        throw new Error(result.message || 'PREDICTION_FAILED');
      }

      return result;
      
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        console.log('⏱️ Vietnamese Food API request timeout');
        throw new Error('REQUEST_TIMEOUT');
      }
      
      console.error('❌ Error analyzing Vietnamese food:', error);
      
      // Handle specific error types
      if (error.message === 'MODEL_NOT_LOADED') {
        throw new Error('🤖 AI model is loading. Please try again in a moment.');
      }
      
      if (error.message === 'INVALID_IMAGE') {
        throw new Error('📸 Image format not supported. Please try a different image.');
      }
      
      if (error.message === 'REQUEST_TIMEOUT') {
        throw new Error('⏱️ Request timeout. Please check your internet connection.');
      }
      
      throw new Error('🔌 Could not connect to Vietnamese Food AI service.');
    }
  };

  const testAPIConnection = async (): Promise<boolean> => {
    try {
      console.log('🔍 Testing Vietnamese Food API connection...');
      
      const response = await fetch(`${VIETNAMESE_FOOD_API_URL}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ API Connection Test Success:', result);
        return result.model_loaded === true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ API Connection Test Failed:', error);
      return false;
    }
  };

  const createVietnameseFoodProduct = (
    prediction: VietnameseFoodPrediction, 
    allPredictions: VietnameseFoodPrediction[], 
    imageUrl: string
  ): ScannedProduct => {
    const foodId = prediction.class_id;
    const foodName = prediction.class_name;
    const confidence = prediction.confidence;
    
    // Get nutrition info from database
    const nutritionInfo = vietnameseFoodNutrition[foodId] || {
      calories: 200,
      protein: 10,
      carbs: 30,
      fat: 5
    };

    return {
      productName: foodName,
      calories: nutritionInfo.calories,
      caloriesPer100g: nutritionInfo.calories,
      caloriesPerServing: nutritionInfo.calories,
      imageUrl: imageUrl,
      isFromPhoto: true,
      isVietnameseFood: true,
      confidence: confidence,
      allPredictions: allPredictions,
      servingSize: '1 phần',
      nutrients: {
        fat: nutritionInfo.fat,
        carbs: nutritionInfo.carbs,
        protein: nutritionInfo.protein,
        sugar: 5, // Default
        fiber: 3, // Default
        salt: 1.5, // Default
      },
      nutrientsPerServing: {
        fat: nutritionInfo.fat,
        carbs: nutritionInfo.carbs,
        protein: nutritionInfo.protein,
        sugar: 5,
        fiber: 3,
        salt: 1.5,
      }
    };
  };

  // ==========================================
  // EXISTING FUNCTIONS (Modified to include Vietnamese Food API)
  // ==========================================

  useEffect(() => {
    setIsMounted(true);
    console.log('🍜 ScanFoodScreen mounted - Testing Vietnamese Food API...');
    
    // Test API connection on mount
    testAPIConnection().then(isConnected => {
      if (isConnected) {
        console.log('✅ Vietnamese Food API is ready!');
      } else {
        console.log('⚠️ Vietnamese Food API not available - fallback mode enabled');
      }
    });
    
    return () => {
      console.log('🍜 ScanFoodScreen unmounting - cleaning up...');
      setIsMounted(false);
      scanLineAnim.stopAnimation();
      setIsLoading(false);
      setIsScanning(false);
      setImageUri(null);
      setScannedProduct(null);
      setShowProductModal(false);
      setVietnameseFoodPredictions([]);
      setCameraReady(false);
      console.log('✅ ScanFoodScreen cleanup completed');
    };
  }, []);

  // Request camera permission on mount
  useEffect(() => {
    if (!isMounted) return;
    
    const requestCameraPermission = async () => {
      try {
        if (permission && !permission.granted) {
          const newPermission = await requestPermission();
          if (!newPermission.granted && isMounted) {
            Alert.alert(
              "Permission Required", 
              "Camera access is required for scanning food. Please enable it in settings."
            );
          }
        }
      } catch (error) {
        console.error('Permission error:', error);
        if (isMounted) {
          Alert.alert('Error', 'Failed to request camera permission');
        }
      }
    };

    requestCameraPermission();
  }, [permission, requestPermission, isMounted]);

  // Animation cho thanh quét
  useEffect(() => {
    if (!isMounted || scanMode !== 'barcode') return;
    
    const animateLoop = () => {
      if (!isMounted) return;
      
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scanLineAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };
    
    animateLoop();
    
    return () => {
      scanLineAnim.stopAnimation();
    };
  }, [scanMode, scanLineAnim, isMounted]);

  const onCameraReady = useCallback(() => {
    if (isMounted) {
      setCameraReady(true);
    }
  }, [isMounted]);

  // ==========================================
  // FOOD ANALYSIS FUNCTIONS (Updated)
  // ==========================================

  const analyzeFoodImageFromLibrary = async (uri: string) => {
    try {
      setIsLoading(true);
      
      console.log('🍜 Starting Vietnamese food analysis from library...');
      
      // First try Vietnamese Food API
      try {
        const apiResult = await analyzeVietnameseFood(uri);
        
        if (apiResult.success && apiResult.top_predictions.length > 0) {
          console.log('✅ Vietnamese Food API successful!');
          
          setVietnameseFoodPredictions(apiResult.top_predictions);
          
          // Create product from best prediction
          const detectedProduct = createVietnameseFoodProduct(
            apiResult.top_predictions[0],
            apiResult.top_predictions,
            uri // Use local image URI for now, can upload to Cloudinary if needed
          );

          setScannedProduct(detectedProduct);
          setShowProductModal(true);
          return;
        }
      } catch (apiError) {
        console.log('⚠️ Vietnamese Food API failed, trying fallback...', apiError.message);
        
        // Show user-friendly message but continue with fallback
        Alert.alert(
          "AI Service Update", 
          `${apiError.message}\n\nDon't worry! You can still save your food manually.`,
          [
            { text: "Try Again", onPress: () => setImageUri(null) },
            { 
              text: "Continue Manually", 
              onPress: () => {
                const manualProduct: ScannedProduct = {
                  productName: 'Vietnamese Food - Please Edit Name',
                  calories: 250,
                  servingSize: '1 phần',
                  imageUrl: uri,
                  isFromPhoto: true,
                  isVietnameseFood: false,
                };
                setScannedProduct(manualProduct);
                setShowProductModal(true);
              }
            }
          ]
        );
        return;
      }

      // If Vietnamese API didn't work, try uploading to Cloudinary for other services
      console.log('📤 Uploading to Cloudinary for fallback recognition...');
      const uploadedImageUrl = await uploadImageToCloudinary(uri);
      
      if (!uploadedImageUrl) {
        throw new Error('Failed to upload image');
      }

      // Fallback: Use original food detection logic
      Alert.alert(
        "Manual Food Entry", 
        "Vietnamese food AI is temporarily unavailable. Please enter the food details manually.",
        [
          { text: "Try Again", onPress: () => setImageUri(null) },
          { 
            text: "Enter Manually", 
            onPress: () => {
              const manualProduct: ScannedProduct = {
                productName: 'Food Item - Please Edit Name',
                calories: 200,
                servingSize: '100g',
                imageUrl: uploadedImageUrl,
                isFromPhoto: true,
              };
              setScannedProduct(manualProduct);
              setShowProductModal(true);
            }
          }
        ]
      );
      
    } catch (error) {
      console.error('❌ Error analyzing food from library:', error);
      Alert.alert(
        "Analysis Failed", 
        "Could not analyze the image. Please check your internet connection and try again.",
        [
          { text: "Try Again", onPress: () => setImageUri(null) },
          { text: "OK" }
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeFoodImage = async () => {
    if (!imageUri) return;

    try {
      setIsLoading(true);
      
      console.log('🍜 Starting Vietnamese food analysis from camera...');
      
      // Try Vietnamese Food API first
      try {
        const apiResult = await analyzeVietnameseFood(imageUri);
        
        if (apiResult.success && apiResult.top_predictions.length > 0) {
          console.log('✅ Vietnamese Food API successful from camera!');
          
          setVietnameseFoodPredictions(apiResult.top_predictions);
          
          const detectedProduct = createVietnameseFoodProduct(
            apiResult.top_predictions[0],
            apiResult.top_predictions,
            imageUri
          );

          setScannedProduct(detectedProduct);
          setShowProductModal(true);
          return;
        }
      } catch (apiError) {
        console.log('⚠️ Vietnamese Food API failed from camera, using fallback...', apiError.message);
      }

      // Fallback: Upload to Cloudinary and use manual entry
      console.log('📤 Uploading camera image to Cloudinary...');
      const uploadedImageUrl = await uploadImageToCloudinary(imageUri);
      
      if (!uploadedImageUrl) {
        throw new Error('Failed to upload image');
      }

      Alert.alert(
        "Food Detected", 
        "Vietnamese food AI is temporarily unavailable. You can still save your food with estimated nutrition values.",
        [
          { text: "Retake Photo", onPress: () => resetCamera() },
          { 
            text: "Save Anyway", 
            onPress: () => {
              const manualProduct: ScannedProduct = {
                productName: 'Vietnamese Food Item',
                calories: 250,
                servingSize: '1 phần',
                imageUrl: uploadedImageUrl,
                isFromPhoto: true,
              };
              setScannedProduct(manualProduct);
              setShowProductModal(true);
            }
          }
        ]
      );
      
    } catch (error) {
      console.error('❌ Error analyzing camera food:', error);
      Alert.alert(
        "Analysis Failed", 
        "Could not analyze the image. Please check your internet connection and try again.",
        [
          { text: "Retake Photo", onPress: () => resetCamera() },
          { text: "OK" }
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // EXISTING FUNCTIONS (Keep as-is)
  // ==========================================

  const parseProductData = (product: any) => {
    const nutriments = product.nutriments || {};
    const servingSize = product.serving_size || '100g';
    const caloriesPer100g = nutriments['energy-kcal_100g'] || nutriments['energy_100g'] * 0.23900573614 || null;
    const caloriesPerServing = nutriments['energy-kcal_serving'] || nutriments['energy_serving'] * 0.23900573614 || null;

    const nutrients = {
      fatPer100g: nutriments['fat_100g'],
      fatPerServing: nutriments['fat_serving'],
      carbsPer100g: nutriments['carbohydrates_100g'],
      carbsPerServing: nutriments['carbohydrates_serving'],
      proteinPer100g: nutriments['proteins_100g'],
      proteinPerServing: nutriments['proteins_serving'],
      sugarPer100g: nutriments['sugars_100g'],
      sugarPerServing: nutriments['sugars_serving'],
      fiberPer100g: nutriments['fiber_100g'],
      fiberPerServing: nutriments['fiber_serving'],
    };

    return {
      productName: product.product_name || '',
      brand: product.brands || '',
      imageUrl: product.image_url || '',
      ingredients: product.ingredients_text || '',
      categories: product.categories || '',
      servingSize,
      caloriesPer100g,
      caloriesPerServing,
      nutrients,
    };
  };

  const fetchProductData = async (barcode: string): Promise<ScannedProduct | null> => {
    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await response.json();

      if (data.status === 1 && data.product) {
        const product: any = data.product;
        const nutriments = product.nutriments || {};

        const getNumericValue = (value: any): number => {
          if (typeof value === 'number') return value;
          if (typeof value === 'string') {
            const parsed = parseFloat(value);
            return isNaN(parsed) ? 0 : parsed;
          }
          return 0;
        };

        const energyKcalPer100g = getNumericValue(nutriments['energy-kcal_100g']) ||
                                  getNumericValue(nutriments['energy_100g']) * 0.239;
        const energyKcalPerServing = getNumericValue(nutriments['energy-kcal_serving']) ||
                                     getNumericValue(nutriments['energy_serving']) * 0.239;

        const calories = energyKcalPerServing || energyKcalPer100g || 0;

        return {
          barcode,
          productName: product.product_name || 'Unknown Product',
          brand: product.brands || 'Unknown Brand',
          imageUrl: product.image_url || '',
          ingredients: product.ingredients_text || 'N/A',
          servingSize: product.serving_size || '100g',
          caloriesPer100g: Math.round(energyKcalPer100g),
          caloriesPerServing: Math.round(energyKcalPerServing),
          calories: Math.round(calories),
          nutrients: {
            fat: getNumericValue(nutriments['fat_100g']),
            carbs: getNumericValue(nutriments['carbohydrates_100g']),
            protein: getNumericValue(nutriments['proteins_100g']),
            sugar: getNumericValue(nutriments['sugars_100g']),
            fiber: getNumericValue(nutriments['fiber_100g']),
            salt: getNumericValue(nutriments['salt_100g']),
          },
          nutrientsPerServing: {
            fat: getNumericValue(nutriments['fat_serving']),
            carbs: getNumericValue(nutriments['carbohydrates_serving']),
            protein: getNumericValue(nutriments['proteins_serving']),
            sugar: getNumericValue(nutriments['sugars_serving']),
            fiber: getNumericValue(nutriments['fiber_serving']),
            salt: getNumericValue(nutriments['salt_serving']),
          },
          nutriScore: product.nutriscore_grade || 'unknown',
          isFromPhoto: false,
        };
      }

      console.warn(`Product not found for barcode: ${barcode}`);
      return null;

    } catch (error) {
      console.error('Error fetching product data:', error);
      return null;
    }
  };

  const saveProductToFirebase = async (product: ScannedProduct) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      if (!isMounted) return;

      const now = new Date();
      const productData = {
        ...product,
        userId: user.uid,
        scannedAt: now.toISOString(),
        dateAdded: now.toISOString(),
      };

      const savePromise = Promise.race([
        (async () => {
          await addDoc(collection(db, 'scannedProducts'), productData);

          const today = now.toISOString().split('T')[0];
          const diaryRef = doc(db, 'foodDiary', `${user.uid}_${today}`);
          
          await setDoc(diaryRef, {
            userId: user.uid,
            date: today,
            foods: arrayUnion(productData),
            updatedAt: now.toISOString(),
          }, { merge: true });
        })(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 10000)
        )
      ]);

      await savePromise;

      if (isMounted) {
        Alert.alert('Success', 'Food saved successfully!');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      if (isMounted) {
        Alert.alert('Error', 'Failed to save food. Please try again.');
      }
    }
  };

  const isPointInScanArea = (x: number, y: number, bounds: any) => {
    const scanAreaWidth = 280;
    const scanAreaHeight = 200;
    const screenWidth = bounds.width;
    const screenHeight = bounds.height;
    
    const scanAreaLeft = (screenWidth - scanAreaWidth) / 2;
    const scanAreaRight = scanAreaLeft + scanAreaWidth;
    const scanAreaTop = (screenHeight - scanAreaHeight) / 2;
    const scanAreaBottom = scanAreaTop + scanAreaHeight;

    return (
      x >= scanAreaLeft &&
      x <= scanAreaRight &&
      y >= scanAreaTop &&
      y <= scanAreaBottom
    );
  };

  const handleBarCodeScanned = async ({ type, data, bounds }: { type: string; data: string; bounds?: any }) => {
    if (isScanning || !isMounted) return;
    
    if (bounds && bounds.origin) {
      const centerX = bounds.origin.x + bounds.size.width / 2;
      const centerY = bounds.origin.y + bounds.size.height / 2;
      
      if (!isPointInScanArea(centerX, centerY, { width: bounds.width || 400, height: bounds.height || 800 })) {
        return;
      }
    }
    
    setIsScanning(true);
    setIsLoading(true);
    
    try {
      const product = await fetchProductData(data);
      
      if (!isMounted) return;
      
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
      if (!isMounted) return;
      
      console.error('Error processing barcode:', error);
      Alert.alert('Error', 'Failed to process barcode. Please try again.');
    } finally {
      if (isMounted) {
        setIsLoading(false);
        setTimeout(() => {
          if (isMounted) {
            setIsScanning(false);
          }
        }, 2000);
      }
    }
  };

  const takePhoto = useCallback(async () => {
    if (!cameraRef.current || !cameraReady || !isMounted) {
      Alert.alert("Error", "Camera is not ready");
      return;
    }

    try {
      setIsLoading(true);
      
      const photoPromise = cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        exif: false,
      }) as Promise<CameraPhotoResult>;
      
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Camera timeout')), 5000)
      );
      
      const photo = await Promise.race([photoPromise, timeoutPromise]);
      
      if (photo && photo.uri && isMounted) {
        setImageUri(photo.uri);
        console.log('📸 Photo taken:', photo.uri);
      }
      
    } catch (error) {
      if (!isMounted) return;
      
      console.error('Error taking photo:', error);
      Alert.alert("Error", "Failed to take photo. Please try again.");
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  }, [cameraReady, isMounted]);

  const openImageLibrary = async () => {
    try {
      setCameraReady(false);
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        
        if (!isMounted) return;
        
        setImageUri(selectedImage.uri);
        console.log('🖼️ Image selected for food recognition:', selectedImage.uri);
        
        setTimeout(async () => {
          if (isMounted && selectedImage.uri) {
            await analyzeFoodImageFromLibrary(selectedImage.uri);
          }
        }, 100);
      } else {
        if (isMounted) {
          setTimeout(() => {
            if (isMounted) {
              setCameraReady(true);
            }
          }, 100);
        }
      }
    } catch (error) {
      console.error('Error opening image library:', error);
      if (isMounted) {
        Alert.alert('Error', 'Failed to open image library');
        setTimeout(() => {
          if (isMounted) {
            setCameraReady(true);
          }
        }, 100);
      }
    }
  };

  const resetCamera = () => {
    if (!isMounted) return;
    
    console.log('🔄 Resetting camera...');
    
    setImageUri(null);
    setScannedProduct(null);
    setShowProductModal(false);
    setIsScanning(false);
    setVietnameseFoodPredictions([]);
    setIsLoading(false);
    
    scanLineAnim.stopAnimation();
    scanLineAnim.setValue(0);
    
    setCameraReady(false);
    
    setTimeout(() => {
      if (isMounted) {
        console.log('✅ Camera ready restored');
        setCameraReady(true);
        
        if (scanMode === 'barcode') {
          setTimeout(() => {
            if (isMounted) {
              Animated.loop(
                Animated.sequence([
                  Animated.timing(scanLineAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                  }),
                  Animated.timing(scanLineAnim, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: true,
                  }),
                ])
              ).start();
            }
          }, 100);
        }
      }
    }, 200);
  };

  const switchScanMode = () => {
    console.log(`🔄 Switching from ${scanMode} to ${scanMode === 'photo' ? 'barcode' : 'photo'}`);
    
    scanLineAnim.stopAnimation();
    scanLineAnim.setValue(0);
    
    setScanMode(scanMode === 'photo' ? 'barcode' : 'photo');
    resetCamera();
  };

  // Loading state
  if (!permission) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.accentBlue} />
        <Text style={styles.loadingText}>Loading camera...</Text>
      </View>
    );
  }

  // Permission denied
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-outline" size={64} color={Colors.graySilver} />
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
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={facing}
            onCameraReady={onCameraReady}
            onBarcodeScanned={scanMode === 'barcode' ? handleBarCodeScanned : undefined}
            barcodeScannerSettings={{
              barcodeTypes: ['ean13', 'ean8', 'code128', 'code39', 'upc_a', 'upc_e'],
            }}
          />

          <View style={styles.cameraOverlay}>
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
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Ionicons name="image-outline" size={28} color="white" />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.scanningFrame}>
              {scanMode === 'barcode' && (
                <View style={styles.scanningArea}>
                  <View style={styles.corner} />
                  <View style={[styles.corner, styles.cornerTopRight]} />
                  <View style={[styles.corner, styles.cornerBottomLeft]} />
                  <View style={[styles.corner, styles.cornerBottomRight]} />
                  
                  <Animated.View
                    style={[
                      styles.scanLine,
                      {
                        transform: [
                          {
                            translateY: scanLineAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [-100, 100],
                            }),
                          },
                        ],
                      },
                    ]}
                  />
                </View>
              )}
              
              {scanMode === 'barcode' && (
                <Text style={styles.scanningText}>
                  Align barcode within the frame
                </Text>
              )}
            </View>

            <View style={styles.bottomControls}>
              {scanMode === 'photo' && (
                <TouchableOpacity 
                  style={[styles.captureButton, isLoading && styles.captureButtonDisabled]}
                  onPress={takePhoto}
                  disabled={isLoading || !cameraReady}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color={Colors.white} />
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
                  {isLoading && <ActivityIndicator size="small" color={Colors.white} />}
                </View>
              )}
            </View>
          </View>
        </>
      ) : (
        <>
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
          
          <View style={styles.previewOverlay}>
            <TouchableOpacity style={styles.backButton} onPress={resetCamera}>
              <Ionicons name="arrow-back" size={28} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.resultCard}>
            <View style={styles.foodInfoRow}>
              <Image
                source={{ uri: imageUri }}
                style={styles.foodImage}
              />
              <View style={styles.foodInfo}>
                <Text style={styles.resultText}>🍜 Analyze Food</Text>
                <Text style={styles.resultSubtext}>
                  AI will identify Vietnamese dishes and provide nutrition info
                </Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={[styles.analyzeButton, isLoading && styles.analyzeButtonDisabled]}
              onPress={analyzeFoodImage}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <Text style={styles.analyzeButtonText}>Analyze Food</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Enhanced Product Details Modal for Vietnamese Food */}
      <Modal
        visible={showProductModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowProductModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowProductModal(false)}>
              <Ionicons name="close" size={28} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {scannedProduct?.isVietnameseFood ? 'Food Detected' : 
               scannedProduct?.isFromPhoto ? 'Detected Food' : 'Product Details'}
            </Text>
            <View style={{ width: 28 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            {scannedProduct && (
              <>
                {scannedProduct.imageUrl ? (
                  <Image 
                    source={{ uri: scannedProduct.imageUrl }} 
                    style={styles.productImage} 
                  />
                ) : (
                  <View style={styles.placeholderImage}>
                    <Ionicons name="image-outline" size={48} color={Colors.graySilver} />
                  </View>
                )}

                <View style={styles.productInfo}>
                  <Text style={styles.productName}>
                    {scannedProduct.productName}
                  </Text>
                  
                  {scannedProduct.brand && (
                    <Text style={styles.productBrand}>{scannedProduct.brand}</Text>
                  )}
                  
                  {scannedProduct.barcode && (
                    <Text style={styles.productBarcode}>Barcode: {scannedProduct.barcode}</Text>
                  )}
                  
                 
                  
                  {/* Nutri-Score for barcode products */}
                  {scannedProduct.nutriScore && scannedProduct.nutriScore !== 'unknown' && (
                    <View style={styles.nutriScoreContainer}>
                      <Text style={styles.nutriScoreLabel}>Nutri-Score: </Text>
                      <View style={[styles.nutriScoreBadge, { backgroundColor: getNutriScoreColor(scannedProduct.nutriScore) }]}>
                        <Text style={styles.nutriScoreText}>{scannedProduct.nutriScore.toUpperCase()}</Text>
                      </View>
                    </View>
                  )}

                  {/* Nutrition Facts */}
                  <View style={styles.nutritionSection}>
                    <Text style={styles.sectionTitle}>
                      🍽️ Nutrition Facts ({showPerServing ? 'per serving' : 'per 100g'} - {scannedProduct.servingSize})
                    </Text>
                    
                    <TouchableOpacity onPress={() => setShowPerServing(!showPerServing)}>
                      <Text style={{ color: 'blue', marginBottom: 10 }}>
                        {showPerServing ? 'Switch to per 100g' : 'Switch to per serving'}
                      </Text>
                    </TouchableOpacity>

                    {scannedProduct.isVietnameseFood || scannedProduct.isFromPhoto ? (
                      // Enhanced nutrition for Vietnamese food
                      <View style={styles.nutritionGrid}>
                        <View style={styles.nutritionItemCard}>
                          <Ionicons name="flame" size={24} color={Colors.primary} style={styles.nutritionIcon} />
                          <Text style={styles.nutritionLabel}>Calories</Text>
                          <AnimatedNutritionValue value={scannedProduct.calories} suffix=" kcal" duration={2000} />
                        </View>
                        
                        {scannedProduct.nutrients && (
                          <>
                            <View style={styles.nutritionItemCard}>
                              <Ionicons name="fitness" size={24} color={Colors.success} style={styles.nutritionIcon} />
                              <Text style={styles.nutritionLabel}>Protein</Text>
                              <AnimatedNutritionValue 
                                value={showPerServing ? scannedProduct.nutrientsPerServing?.protein ?? 0 : scannedProduct.nutrients.protein} 
                                suffix="g" 
                                duration={2000} 
                              />
                            </View>
                            
                            <View style={styles.nutritionItemCard}>
                              <Ionicons name="leaf" size={24} color={Colors.accentBlue} style={styles.nutritionIcon} />
                              <Text style={styles.nutritionLabel}>Carbs</Text>
                              <AnimatedNutritionValue 
                                value={showPerServing ? scannedProduct.nutrientsPerServing?.carbs ?? 0 : scannedProduct.nutrients.carbs} 
                                suffix="g" 
                                duration={2000} 
                              />
                            </View>
                            
                            <View style={styles.nutritionItemCard}>
                              <Ionicons name="pizza" size={24} color={Colors.warning} style={styles.nutritionIcon} />
                              <Text style={styles.nutritionLabel}>Fat</Text>
                              <AnimatedNutritionValue 
                                value={showPerServing ? scannedProduct.nutrientsPerServing?.fat ?? 0 : scannedProduct.nutrients.fat} 
                                suffix="g" 
                                duration={2000} 
                              />
                            </View>
                          </>
                        )}
                      </View>
                    ) : (
                      // Full nutrition for barcode-scanned products
                      <View style={styles.nutritionGrid}>
                        {[
                          {
                            label: 'Calories', 
                            rawValue: showPerServing ? scannedProduct.caloriesPerServing ?? 0 : scannedProduct.caloriesPer100g ?? 0,
                            icon: 'flame', 
                            suffix: ' kcal',
                            color: Colors.primary
                          },
                          {
                            label: 'Fat', 
                            rawValue: showPerServing ? scannedProduct.nutrientsPerServing?.fat ?? 0 : scannedProduct.nutrients?.fat ?? 0,
                            icon: 'pizza', 
                            suffix: 'g',
                            color: Colors.warning
                          },
                          {
                            label: 'Carbs', 
                            rawValue: showPerServing ? scannedProduct.nutrientsPerServing?.carbs ?? 0 : scannedProduct.nutrients?.carbs ?? 0,
                            icon: 'leaf', 
                            suffix: 'g',
                            color: Colors.accentBlue
                          },
                          {
                            label: 'Protein', 
                            rawValue: showPerServing ? scannedProduct.nutrientsPerServing?.protein ?? 0 : scannedProduct.nutrients?.protein ?? 0,
                            icon: 'fitness', 
                            suffix: 'g',
                            color: Colors.success
                          },
                          {
                            label: 'Sugar', 
                            rawValue: showPerServing ? scannedProduct.nutrientsPerServing?.sugar ?? 0 : scannedProduct.nutrients?.sugar ?? 0,
                            icon: 'ice-cream', 
                            suffix: 'g',
                            color: Colors.protein
                          },
                          {
                            label: 'Fiber',
                            rawValue: showPerServing ? scannedProduct.nutrientsPerServing?.fiber ?? 0 : scannedProduct.nutrients?.fiber ?? 0,
                            icon: 'barbell', 
                            suffix: 'g',
                            color: Colors.chartColors[6]
                          },
                        ].map((item, index) => (
                          <View key={index} style={styles.nutritionItemCard}>
                            <Ionicons name={item.icon as any} size={24} color={item.color} style={styles.nutritionIcon} />
                            <Text style={styles.nutritionLabel}>{item.label}</Text>
                            <AnimatedNutritionValue value={item.rawValue} suffix={item.suffix} duration={2000} />
                          </View>
                        ))}
                      </View>
                    )}
                  </View>

                  {/* Ingredients */}
                  {scannedProduct.ingredients && (
                    <View style={styles.ingredientsSection}>
                      <Text style={styles.sectionTitle}>🥬 Ingredients</Text>
                      <Text style={styles.ingredientsText}>{scannedProduct.ingredients}</Text>
                    </View>
                  )}
                </View>

                {/* Enhanced Save Button */}
                <TouchableOpacity 
                  style={[styles.saveButton, scannedProduct.isVietnameseFood && styles.vietnameseSaveButton]}
                  onPress={() => {
                    saveProductToFirebase(scannedProduct);
                    setShowProductModal(false);
                    navigation.navigate('History', { refresh: Date.now() });
                    resetCamera();
                  }}
                >
                  <Text style={styles.saveButtonText}>
                    {scannedProduct.isVietnameseFood ? 'Save Food' : '💾 Save to My Foods'}
                  </Text>
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
    case 'a': return Colors.nutriScore.A;
    case 'b': return Colors.nutriScore.B;
    case 'c': return Colors.nutriScore.C;
    case 'd': return Colors.nutriScore.D;
    case 'e': return Colors.nutriScore.E;
    default: return Colors.textLight;
  }
};