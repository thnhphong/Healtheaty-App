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
import { db } from '../../backend/config/firebase';
import { collection, addDoc, doc, setDoc, arrayUnion } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { styles } from '../styles/ScanFoodScreen';
import AnimatedNutritionValue from '../components/ui/AnimatedNutritionValue';
import { foodCalorieDatabase } from '../../backend/models/foodCalorieDatabase';
import { vietnameseFoodNutrition } from '../../backend/data/foodCalorieDatabase';
import { uploadImageToCloudinary } from '../utils/uploadImageToCloudinary';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import PortionEditor from '../components/ui/PortionEditor';

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

interface RoboflowPrediction {
  class: string;
  confidence: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PortionData {
  type: 'per100g' | 'perServing';
  servingCount: number;
  customSize: number;
  displayText: string;
  multiplier: number;
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
  confidence?: number;
  isVietnameseFood?: boolean;
  allPredictions?: VietnameseFoodPrediction[];
}

type ScanMode = 'photo' | 'barcode';

// Custom hook for portion calculations
const usePortionCalculator = (scannedProduct: ScannedProduct | null, currentPortion: PortionData) => {
  const calculatePortionNutrition = useCallback((baseValue: number, baseType: 'per100g' | 'perServing'): number => {
    if (!scannedProduct || !baseValue) return 0;
    
    if (currentPortion.type === 'per100g') {
      if (baseType === 'per100g') {
        return (baseValue * currentPortion.customSize) / 100;
      }
      // If current is per100g but base is perServing
      const servingSizeInGrams = parseFloat(scannedProduct.servingSize?.replace(/[^\d.]/g, '')) || 100;
      return (baseValue * currentPortion.customSize) / servingSizeInGrams;
    } else {
      if (baseType === 'perServing') {
        return baseValue * currentPortion.servingCount;
      }
      // If current is perServing but base is per100g
      const servingSizeInGrams = parseFloat(scannedProduct.servingSize?.replace(/[^\d.]/g, '')) || 100;
      return (baseValue * servingSizeInGrams * currentPortion.servingCount) / 100;
    }
  }, [scannedProduct, currentPortion]);

  return { calculatePortionNutrition };
};



const VIETNAMESE_FOOD_API_URL = 'http://192.168.2.51:5000';
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
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation<NavigationProps>();
  /* change details from per100g to perServing*/
  const [showPerServing, setShowPerServing] = useState(true);
  const [selectedPortion, setSelectedPortion] = useState<number>(1);
  

  //portion state with better defaults
  const [showPortionEditor, setShowPortionEditor] = useState(false);
  const [currentPortion, setCurrentPortion] = useState<PortionData>({
    type: 'per100g',
    servingCount: 1,
    customSize: 100,
    displayText: '100g',
    multiplier: 1
  });

  //helper function to calculate nutrition based on current portion
  const calculatePortionNutrition = (baseValue, baseType) => {
  if (!scannedProduct || !baseValue) return 0;
  
  if (currentPortion.type === 'per100g') {
    if (baseType === 'per100g') {
      return (baseValue * currentPortion.customSize) / 100;
    }
    // If current is per100g but base is perServing
    else {
      const servingSizeInGrams = parseFloat(scannedProduct.servingSize?.replace(/[^\d.]/g, '')) || 100;
      return (baseValue * currentPortion.customSize) / servingSizeInGrams;
    }
  } else {
    if (baseType === 'perServing') {
      return baseValue * currentPortion.servingCount;
    }
    // If current is perServing but base is per100g
    else {
      const servingSizeInGrams = parseFloat(scannedProduct.servingSize?.replace(/[^\d.]/g, '')) || 100;
      return (baseValue * servingSizeInGrams * currentPortion.servingCount) / 100;
    }
  }
}

   //handle portion editor apply
  const handlePortionApply = (portionData) => {
  setCurrentPortion(portionData);
  // Force a re-render by updating a state that affects the key
  setShowPerServing(prev => prev); // This triggers a re-render
}

  // 🍜 VIETNAMESE FOOD API FUNCTIONS
  const analyzeVietnameseFood = async (imageUri: string): Promise<VietnameseFoodAPIResponse> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: FileSystem.EncodingType.Base64 });
      const response = await fetch(`${VIETNAMESE_FOOD_API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, top_k: 5 }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      if (!isMounted) throw new Error('Component unmounted');
      if (response.status === 503) throw new Error('MODEL_NOT_LOADED');
      if (response.status === 400) throw new Error('INVALID_IMAGE');
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API_ERROR_${response.status}`);
      }

      const result: VietnameseFoodAPIResponse = await response.json();
      if (!result.success) throw new Error(result.message || 'PREDICTION_FAILED');
      return result;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') throw new Error('REQUEST_TIMEOUT');
      if (error.message === 'MODEL_NOT_LOADED') throw new Error('AI model is loading. Try again.');
      if (error.message === 'INVALID_IMAGE') throw new Error('Image format not supported.');
      if (error.message === 'REQUEST_TIMEOUT') throw new Error('Request timeout. Check internet.');
      throw new Error('Could not connect to Vietnamese Food AI service.');
    }
  };

  const testAPIConnection = async (): Promise<boolean> => {
    try {
      const response = await fetch(`${VIETNAMESE_FOOD_API_URL}/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const result = await response.json();
        return result.model_loaded === true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const createVietnameseFoodProduct = (
    prediction: VietnameseFoodPrediction,
    allPredictions: VietnameseFoodPrediction[],
    imageUrl: string
  ): ScannedProduct => {
    const foodId = prediction.class_id;
    const nutritionInfo = vietnameseFoodNutrition[foodId] || { calories: 200, protein: 10, carbs: 30, fat: 5 };
    return {
      productName: prediction.class_name,
      calories: nutritionInfo.calories,
      caloriesPer100g: nutritionInfo.calories,
      caloriesPerServing: nutritionInfo.calories,
      imageUrl,
      isFromPhoto: true,
      isVietnameseFood: true,
      confidence: prediction.confidence,
      allPredictions,
      servingSize: '1 phần',
      nutrients: { fat: nutritionInfo.fat, carbs: nutritionInfo.carbs, protein: nutritionInfo.protein, sugar: 5, fiber: 3, salt: 1.5 },
      nutrientsPerServing: { fat: nutritionInfo.fat, carbs: nutritionInfo.carbs, protein: nutritionInfo.protein, sugar: 5, fiber: 3, salt: 1.5 },
    };
  };

  // FOOD ANALYSIS FUNCTIONS
  const analyzeFoodImageFromLibrary = async (uri: string) => {
    try {
      setIsLoading(true);
      const apiResult = await analyzeVietnameseFood(uri);
      if (apiResult.success && apiResult.top_predictions.length > 0) {
        setVietnameseFoodPredictions(apiResult.top_predictions);
        const detectedProduct = createVietnameseFoodProduct(apiResult.top_predictions[0], apiResult.top_predictions, uri);
        setScannedProduct(detectedProduct);
        setShowProductModal(true);
      } else {
        throw new Error('No predictions from Vietnamese API');
      }
    } catch (error) {
      Alert.alert("AI Service Update", `${error.message}\n\nContinue manually.`, [
        { text: "Try Again", onPress: () => setImageUri(null) },
        { text: "Continue Manually", onPress: () => {
          setScannedProduct({ productName: 'Vietnamese Food - Edit Name', calories: 250, servingSize: '1 phần', imageUrl: uri, isFromPhoto: true });
          setShowProductModal(true);
        }},
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeFoodImage = async () => {
    if (!imageUri) return;
    try {
      setIsLoading(true);
      const apiResult = await analyzeVietnameseFood(imageUri);
      if (apiResult.success && apiResult.top_predictions.length > 0) {
        setVietnameseFoodPredictions(apiResult.top_predictions);
        const detectedProduct = createVietnameseFoodProduct(apiResult.top_predictions[0], apiResult.top_predictions, imageUri);
        setScannedProduct(detectedProduct);
        setShowProductModal(true);
      } else {
        throw new Error('No predictions from Vietnamese API');
      }
    } catch (error) {
      Alert.alert("Food Detected", `${error.message}\n\nSave with estimated values.`, [
        { text: "Retake Photo", onPress: () => resetCamera() },
        { text: "Save Anyway", onPress: () => {
          setScannedProduct({ productName: 'Vietnamese Food Item', calories: 250, servingSize: '1 phần', imageUrl: imageUri, isFromPhoto: true });
          setShowProductModal(true);
        }},
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // EXISTING FUNCTIONS
  useEffect(() => {
    setIsMounted(true);
    testAPIConnection().then(isConnected => isConnected ? console.log('✅ Vietnamese Food API ready!') : console.log('⚠️ Vietnamese Food API unavailable'));
    return () => {
      setIsMounted(false);
      scanLineAnim.stopAnimation();
      setIsLoading(false);
      setIsScanning(false);
      setImageUri(null);
      setScannedProduct(null);
      setShowProductModal(false);
      setVietnameseFoodPredictions([]);
      setCameraReady(false);
    };
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const requestCameraPermission = async () => {
      try {
        if (permission && !permission.granted) {
          const newPermission = await requestPermission();
          if (!newPermission.granted && isMounted) Alert.alert("Permission Required", "Camera access required.");
        }
      } catch (error) {
        if (isMounted) Alert.alert('Error', 'Failed to request camera permission');
      }
    };
    requestCameraPermission();
  }, [permission, requestPermission, isMounted]);

  useEffect(() => {
    if (!isMounted || scanMode !== 'barcode') return;
    Animated.loop(Animated.sequence([
      Animated.timing(scanLineAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
      Animated.timing(scanLineAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
    ])).start();
    return () => scanLineAnim.stopAnimation();
  }, [scanMode, scanLineAnim, isMounted]);

  const onCameraReady = useCallback(() => {
    if (isMounted) setCameraReady(true);
  }, [isMounted]);

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
    return { productName: product.product_name || '', brand: product.brands || '', imageUrl: product.image_url || '', ingredients: product.ingredients_text || '', categories: product.categories || '', servingSize, caloriesPer100g, caloriesPerServing, nutrients };
  };

  const fetchProductData = async (barcode: string): Promise<ScannedProduct | null> => {
    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await response.json();
      if (data.status === 1 && data.product) {
        const product = data.product;
        const nutriments = product.nutriments || {};
        const getNumericValue = (value: any): number => (typeof value === 'number' ? value : typeof value === 'string' ? parseFloat(value) || 0 : 0);
        const energyKcalPer100g = getNumericValue(nutriments['energy-kcal_100g']) || getNumericValue(nutriments['energy_100g']) * 0.239;
        const energyKcalPerServing = getNumericValue(nutriments['energy-kcal_serving']) || getNumericValue(nutriments['energy_serving']) * 0.239;
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
          nutrients: { fat: getNumericValue(nutriments['fat_100g']), carbs: getNumericValue(nutriments['carbohydrates_100g']), protein: getNumericValue(nutriments['proteins_100g']), sugar: getNumericValue(nutriments['sugars_100g']), fiber: getNumericValue(nutriments['fiber_100g']), salt: getNumericValue(nutriments['salt_100g']) },
          nutrientsPerServing: { fat: getNumericValue(nutriments['fat_serving']), carbs: getNumericValue(nutriments['carbohydrates_serving']), protein: getNumericValue(nutriments['proteins_serving']), sugar: getNumericValue(nutriments['sugars_serving']), fiber: getNumericValue(nutriments['fiber_serving']), salt: getNumericValue(nutriments['salt_serving']) },
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
      if (!user) { Alert.alert('Error', 'User not authenticated'); return; }
      if (!isMounted) return;
      const now = new Date();
      const productData = { ...product, userId: user.uid, scannedAt: now.toISOString(), dateAdded: now.toISOString() };
      await Promise.race([(async () => {
        await addDoc(collection(db, 'scannedProducts'), productData);
        const today = now.toISOString().split('T')[0];
        const diaryRef = doc(db, 'foodDiary', `${user.uid}_${today}`);
        await setDoc(diaryRef, { userId: user.uid, date: today, foods: arrayUnion(productData), updatedAt: now.toISOString() }, { merge: true });
      })(), new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))]);
      if (isMounted) Alert.alert('Success', 'Food saved successfully!');
    } catch (error) {
      console.error('Error saving product:', error);
      if (isMounted) Alert.alert('Error', 'Failed to save food. Try again.');
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
    return x >= scanAreaLeft && x <= scanAreaRight && y >= scanAreaTop && y <= scanAreaBottom;
  };

  const handleBarCodeScanned = async ({ type, data, bounds }: { type: string; data: string; bounds?: any }) => {
    if (isScanning || !isMounted) return;
    if (bounds && bounds.origin) {
      const centerX = bounds.origin.x + bounds.size.width / 2;
      const centerY = bounds.origin.y + bounds.size.height / 2;
      if (!isPointInScanArea(centerX, centerY, { width: bounds.width || 400, height: bounds.height || 800 })) return;
    }
    setIsScanning(true);
    setIsLoading(true);
    try {
      const product = await fetchProductData(data);
      if (!isMounted) return;
      if (product) { setScannedProduct(product); setShowProductModal(true); } else Alert.alert('Product Not Found', 'Not found. Try again or enter manually.');
    } catch (error) {
      if (!isMounted) return;
      console.error('Error processing barcode:', error);
      Alert.alert('Error', 'Failed to process barcode. Try again.');
    } finally {
      if (isMounted) { setIsLoading(false); setTimeout(() => setIsScanning(false), 2000); }
    }
  };

  const takePhoto = useCallback(async () => {
    if (!cameraRef.current || !cameraReady || !isMounted) { Alert.alert("Error", "Camera not ready"); return; }
    try {
      setIsLoading(true);
      const photo = await Promise.race([cameraRef.current.takePictureAsync({ quality: 0.8, base64: false, exif: false }), new Promise((_, reject) => setTimeout(() => reject(new Error('Camera timeout')), 5000))]);
      if (photo && photo.uri && isMounted) setImageUri(photo.uri);
    } catch (error) {
      if (!isMounted) return;
      console.error('Error taking photo:', error);
      Alert.alert("Error", "Failed to take photo. Try again.");
    } finally {
      if (isMounted) setIsLoading(false);
    }
  }, [cameraReady, isMounted]);

  const openImageLibrary = async () => {
    try {
      setCameraReady(false);
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.7, allowsMultipleSelection: false });
      if (!result.canceled && result.assets && result.assets.length > 0 && isMounted) {
        setImageUri(result.assets[0].uri);
        setTimeout(() => analyzeFoodImageFromLibrary(result.assets[0].uri), 100);
      } else if (isMounted) setTimeout(() => setCameraReady(true), 100);
    } catch (error) {
      console.error('Error opening image library:', error);
      if (isMounted) { Alert.alert('Error', 'Failed to open image library'); setTimeout(() => setCameraReady(true), 100); }
    }
  };

  const resetCamera = () => {
    if (!isMounted) return;
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
        setCameraReady(true);
        if (scanMode === 'barcode') Animated.loop(Animated.sequence([Animated.timing(scanLineAnim, { toValue: 1, duration: 2000, useNativeDriver: true }), Animated.timing(scanLineAnim, { toValue: 0, duration: 2000, useNativeDriver: true })])).start();
      }
    }, 200);
  };

  const switchScanMode = () => {
    scanLineAnim.stopAnimation();
    scanLineAnim.setValue(0);
    setScanMode(scanMode === 'photo' ? 'barcode' : 'photo');
    resetCamera();
  };

  const getAdjustedValue = (baseValue: number | undefined, portionFactor: number, count: number) => {
  if (!baseValue) return 0;
  return baseValue * portionFactor * count;
  };

  const createPortionAdjustedProduct = (originalProduct, portion) => {
  // Calculate adjusted nutrition values
  const adjustedCalories = calculatePortionNutrition(
    originalProduct.caloriesPer100g || originalProduct.calories, 
    'per100g'
  );
  
  const adjustedNutrients = originalProduct.nutrients ? {
    fat: calculatePortionNutrition(originalProduct.nutrients.fat, 'per100g'),
    carbs: calculatePortionNutrition(originalProduct.nutrients.carbs, 'per100g'),
    protein: calculatePortionNutrition(originalProduct.nutrients.protein, 'per100g'),
    sugar: calculatePortionNutrition(originalProduct.nutrients.sugar, 'per100g'),
    fiber: calculatePortionNutrition(originalProduct.nutrients.fiber, 'per100g'),
    salt: calculatePortionNutrition(originalProduct.nutrients.salt, 'per100g'),
  } : null;

  // Create the adjusted product object
  const adjustedProduct = {
    ...originalProduct,
    // Update calories to the portion-adjusted amount
    calories: Math.round(adjustedCalories),
    
    // Keep original per100g values for reference
    originalCaloriesPer100g: originalProduct.caloriesPer100g || originalProduct.calories,
    originalNutrients: originalProduct.nutrients,
    
    // Add portion-adjusted nutrients
    nutrients: adjustedNutrients,
    
    // Add portion information for tracking
    portionInfo: {
      type: portion.type,
      servingCount: portion.servingCount,
      customSize: portion.customSize,
      displayText: portion.displayText,
      multiplier: portion.multiplier
    },
    
    // Update serving size to reflect actual consumed portion
    servingSize: portion.displayText,
    
    // Add a flag to indicate this is portion-adjusted
    isPortionAdjusted: true,
    
    // Update product name to include portion info
    productName: `${originalProduct.productName} (${portion.displayText})`,
  };

  return adjustedProduct;
};

const createPortionAdjustedProductDetailed = (originalProduct, portion) => {
  const adjustedCalories = calculatePortionNutrition(
    originalProduct.caloriesPer100g || originalProduct.calories, 
    'per100g'
  );
  
  const adjustedNutrients = originalProduct.nutrients ? {
    fat: calculatePortionNutrition(originalProduct.nutrients.fat, 'per100g'),
    carbs: calculatePortionNutrition(originalProduct.nutrients.carbs, 'per100g'),
    protein: calculatePortionNutrition(originalProduct.nutrients.protein, 'per100g'),
    sugar: calculatePortionNutrition(originalProduct.nutrients.sugar, 'per100g'),
    fiber: calculatePortionNutrition(originalProduct.nutrients.fiber, 'per100g'),
    salt: calculatePortionNutrition(originalProduct.nutrients.salt, 'per100g'),
  } : null;

  return {
    ...originalProduct,
    
    // Consumed values (what the user actually ate)
    consumedCalories: Math.round(adjustedCalories),
    consumedNutrients: adjustedNutrients,
    
    // Original values (for reference)
    originalCalories: originalProduct.caloriesPer100g || originalProduct.calories,
    originalNutrients: originalProduct.nutrients,
    
    // Portion details
    portionConsumed: {
      type: portion.type,
      amount: portion.type === 'per100g' ? portion.customSize : portion.servingCount,
      unit: portion.type === 'per100g' ? 'grams' : 'servings',
      displayText: portion.displayText
    },
    
    // For backwards compatibility, set calories to consumed amount
    calories: Math.round(adjustedCalories),
    nutrients: adjustedNutrients,
    
    // Add metadata
    isPortionAdjusted: true,
    adjustedAt: new Date().toISOString(),
    productName: `${originalProduct.productName} (${portion.displayText})`,
  };
};


  if (!permission) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#007AFF" /><Text style={styles.loadingText}>Loading camera...</Text></View>;
  }
  if (!permission.granted) {
    return <View style={styles.permissionContainer}><Ionicons name="camera-outline" size={64} color="#ccc" /><Text style={styles.permissionText}>Camera permission required</Text><TouchableOpacity style={styles.permissionButton} onPress={requestPermission}><Text style={styles.permissionButtonText}>Grant Permission</Text></TouchableOpacity></View>;
  }

  return (
    <View style={styles.container}>
      {!imageUri ? (
        <>
          <CameraView ref={cameraRef} style={styles.camera} facing={facing} onCameraReady={onCameraReady} onBarcodeScanned={scanMode === 'barcode' ? handleBarCodeScanned : undefined} barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'code128', 'code39', 'upc_a', 'upc_e'] }} />
          <View style={styles.cameraOverlay}>
            <View style={styles.topControls}>
              <TouchableOpacity style={styles.modeButton} onPress={switchScanMode}><Ionicons name={scanMode === 'photo' ? 'barcode-outline' : 'camera-outline'} size={28} color="white" /><Text style={styles.modeButtonText}>{scanMode === 'photo' ? 'Barcode' : 'Photo'}</Text></TouchableOpacity>
              <TouchableOpacity style={styles.libraryButton} onPress={openImageLibrary} disabled={isLoading}>{isLoading ? <ActivityIndicator size="small" color="white" /> : <Ionicons name="image-outline" size={28} color="white" />}</TouchableOpacity>
            </View>
            <View style={styles.scanningFrame}>
              {scanMode === 'barcode' && (
                <View style={styles.scanningArea}>
                  <View style={styles.corner} />
                  <View style={[styles.corner, styles.cornerTopRight]} />
                  <View style={[styles.corner, styles.cornerBottomLeft]} />
                  <View style={[styles.corner, styles.cornerBottomRight]} />
                  <Animated.View style={[styles.scanLine, { transform: [{ translateY: scanLineAnim.interpolate({ inputRange: [0, 1], outputRange: [-100, 100] }) }] }]} />
                </View>
              )}
              {scanMode === 'barcode' && <Text style={styles.scanningText}>Align barcode within frame</Text>}
            </View>
            <View style={styles.bottomControls}>
              {scanMode === 'photo' && <TouchableOpacity style={[styles.captureButton, isLoading && styles.captureButtonDisabled]} onPress={takePhoto} disabled={isLoading || !cameraReady}>{isLoading ? <ActivityIndicator size="small" color="#fff" /> : <Ionicons name="camera" size={32} color="white" />}</TouchableOpacity>}
              {scanMode === 'barcode' && <View style={styles.barcodeInstructions}><Text style={styles.barcodeInstructionsText}>{isScanning ? 'Scanning...' : 'Point camera at barcode'}</Text>{isLoading && <ActivityIndicator size="small" color="#fff" />}</View>}
            </View>
          </View>
        </>
      ) : (
        <>
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
          <View style={styles.previewOverlay}><TouchableOpacity style={styles.backButton} onPress={resetCamera}><Ionicons name="arrow-back" size={28} color="white" /></TouchableOpacity></View>
          <View style={styles.resultCard}>
            <View style={styles.foodInfoRow}><Image source={{ uri: imageUri }} style={styles.foodImage} /><View style={styles.foodInfo}><Text style={styles.resultText}>🍜 Analyze Food</Text><Text style={styles.resultSubtext}>AI will identify Vietnamese dishes and nutrition info</Text></View></View>
            <TouchableOpacity style={[styles.analyzeButton, isLoading && styles.analyzeButtonDisabled]} onPress={analyzeFoodImage} disabled={isLoading}>{isLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.analyzeButtonText}>Analyze Food</Text>}</TouchableOpacity>
          </View>
        </>
      )}
      <Modal visible={showProductModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowProductModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}><TouchableOpacity onPress={() => setShowProductModal(false)}><Ionicons name="close" size={28} color="#333" /></TouchableOpacity><Text style={styles.modalTitle}>{scannedProduct?.isVietnameseFood ? 'Food Detected' : scannedProduct?.isFromPhoto ? 'Detected Food' : 'Product Details'}</Text><View style={{ width: 28 }} /></View>
          <ScrollView style={styles.modalContent}>
            {scannedProduct && (
              <>
                {scannedProduct.imageUrl ? <Image source={{ uri: scannedProduct.imageUrl }} style={styles.productImage} /> : <View style={styles.placeholderImage}><Ionicons name="image-outline" size={48} color="#ccc" /></View>}
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{scannedProduct.productName}</Text>
                  {scannedProduct.brand && <Text style={styles.productBrand}>{scannedProduct.brand}</Text>}
                  {scannedProduct.barcode && <Text style={styles.productBarcode}>Barcode: {scannedProduct.barcode}</Text>}
                  {scannedProduct.nutriScore && scannedProduct.nutriScore !== 'unknown' && (
                    <View style={styles.nutriScoreContainer}><Text style={styles.nutriScoreLabel}>Nutri-Score: </Text><View style={[styles.nutriScoreBadge, { backgroundColor: getNutriScoreColor(scannedProduct.nutriScore) }]}><Text style={styles.nutriScoreText}>{scannedProduct.nutriScore.toUpperCase()}</Text></View></View>
                  )}
                  <View style={styles.nutritionSection}>
                    <Text style={styles.sectionTitle}>Nutrition Facts ({showPerServing ? 'per serving' : 'per 100g'} - {scannedProduct.servingSize})</Text>
                    <TouchableOpacity 
                      style={styles.portionDisplay}
                      onPress={() => setShowPortionEditor(true)}
                    >
                      <Text style={styles.portionText}>{currentPortion.displayText}</Text>
                      <Ionicons name="create-outline" size={16} color="#4CAF50" style={styles.editIcon} />
                      <Text>Portion Size</Text>
                    </TouchableOpacity>
                    <Text style={styles.nutritionItem}>Calories: {showPerServing ? scannedProduct.caloriesPerServing?.toFixed(0) ?? 'N/A' : scannedProduct.caloriesPer100g?.toFixed(0) ?? 'N/A'}</Text>
                    <TouchableOpacity onPress={() => setShowPerServing(!showPerServing)}><Text style={{ color: 'blue', marginBottom: 10 }}>{showPerServing ? 'Switch to per 100g' : 'Switch to per serving'}</Text></TouchableOpacity>
                    {(scannedProduct.isVietnameseFood || scannedProduct.isFromPhoto) ? (
                      <View style={styles.nutritionGrid}>
  <View style={styles.nutritionItemCard}>
    <Ionicons 
      name="flame" 
      size={28} 
      color="#FF6B35" 
      style={styles.nutritionIcon} 
    />
    <Text style={styles.nutritionLabel}>Calories</Text>
    <AnimatedNutritionValue 
      value={scannedProduct.calories} 
      suffix=" kcal" 
      duration={1000} 
      style={styles.nutritionValue}
    />
  </View>
  
  {scannedProduct.nutrients && (
    <>
      <View style={styles.nutritionItemCard}>
        <Ionicons 
          name="barbell" 
          size={28} 
          color="#4CAF50" 
          style={styles.nutritionIcon} 
        />
        <Text style={styles.nutritionLabel}>Protein</Text>
        <AnimatedNutritionValue 
          value={showPerServing ? scannedProduct.nutrientsPerServing?.protein ?? 0 : scannedProduct.nutrients.protein} 
          suffix="g" 
          duration={2000}
          style={styles.nutritionValue}
        />
      </View>
      
      <View style={styles.nutritionItemCard}>
        <Ionicons 
          name="leaf-outline" 
          size={28} 
          color="#2196F3" 
          style={styles.nutritionIcon} 
        />
        <Text style={styles.nutritionLabel}>Carbs</Text>
        <AnimatedNutritionValue 
          value={getAdjustedValue(scannedProduct.nutrients.carbs, selectedPortion.factor, currentPortion.servingCount)} 
          suffix="g" 
          duration={2000}
          style={styles.nutritionValue}
        />
      </View>
      
      <View style={styles.nutritionItemCard}>
        <Ionicons 
          name="water-outline" 
          size={28} 
          color="#FF9800" 
          style={styles.nutritionIcon} 
        />
        <Text style={styles.nutritionLabel}>Fat</Text>
        <AnimatedNutritionValue 
          value={showPerServing ? scannedProduct.nutrientsPerServing?.fat ?? 0 : scannedProduct.nutrients.fat} 
          suffix="g" 
          duration={2000}
          style={styles.nutritionValue}
        />
      </View>
    </>
  )}
                      </View>
                    ) : (
                      <View style={styles.nutritionGrid}>
  {[
    {
      label: 'Calories',
      per100gValue: scannedProduct.caloriesPer100g ?? 0,
      perServingValue: scannedProduct.caloriesPerServing ?? 0,
      icon: 'flame',
      color: '#FF6B35',
      suffix: ' kcal',
    },
    {
      label: 'Fat',
      per100gValue: scannedProduct.nutrients?.fat ?? 0,
      perServingValue: scannedProduct.nutrientsPerServing?.fat ?? 0,
      icon: 'pizza',
      color: '#FF9800',
      suffix: 'g',
    },
    {
      label: 'Carbs',
      per100gValue: scannedProduct.nutrients?.carbs ?? 0,
      perServingValue: scannedProduct.nutrientsPerServing?.carbs ?? 0,
      icon: 'leaf',
      color: '#2196F3',
      suffix: 'g',
    },
    {
      label: 'Protein',
      per100gValue: scannedProduct.nutrients?.protein ?? 0,
      perServingValue: scannedProduct.nutrientsPerServing?.protein ?? 0,
      icon: 'fitness',
      color: '#4CAF50',
      suffix: 'g',
    },
    {
      label: 'Sugar',
      per100gValue: scannedProduct.nutrients?.sugar ?? 0,
      perServingValue: scannedProduct.nutrientsPerServing?.sugar ?? 0,
      icon: 'ice-cream',
      color: '#9C27B0',
      suffix: 'g',
    },
    {
      label: 'Fiber',
      per100gValue: scannedProduct.nutrients?.fiber ?? 0,
      perServingValue: scannedProduct.nutrientsPerServing?.fiber ?? 0,
      icon: 'barbell',
      color: '#607D8B',
      suffix: 'g',
    },
  ].map((item, index) => {
    // Calculate the adjusted value based on current portion
    const adjustedValue = calculatePortionNutrition(
      item.per100gValue, 
      'per100g'  // Always use per100g as base since we have both values
    );
    
    return (
      <View key={index} style={styles.nutritionItemCard}>
        <Ionicons 
          name={item.icon as any} 
          size={24} 
          color={item.color} 
          style={styles.nutritionIcon} 
        />
        <Text style={styles.nutritionLabel}>{item.label}</Text>
        <AnimatedNutritionValue 
          key={`${item.label}-${currentPortion.type}-${currentPortion.customSize}-${currentPortion.servingCount}`} // Force re-render on portion change
          value={adjustedValue} 
          suffix={item.suffix} 
          duration={800}
        />
      </View>
    );
  })}
</View>
                    )}
                  </View>
                  
                  {/* PortionEditor Component */}
                  <PortionEditor
                    visible={showPortionEditor}
                    onClose={() => setShowPortionEditor(false)}
                    onApply={handlePortionApply}
                    productData={scannedProduct}
                    initialPortionType={currentPortion.type}
                    initialServingCount={currentPortion.servingCount}
                    selectedPortion={selectedPortion}
                    onSelectPortion={setSelectedPortion}
                  />

                  {scannedProduct.ingredients && <View style={styles.ingredientsSection}><Text style={styles.sectionTitle}>🥬 Ingredients</Text><Text style={styles.ingredientsText}>{scannedProduct.ingredients}</Text></View>}
                </View>
                <TouchableOpacity 
  style={[styles.saveButton, scannedProduct.isVietnameseFood && styles.vietnameseSaveButton]} 
  onPress={() => { 
    // Create a new product object with portion-adjusted values
    const adjustedProduct = createPortionAdjustedProduct(scannedProduct, currentPortion);
    
    saveProductToFirebase(adjustedProduct); 
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

