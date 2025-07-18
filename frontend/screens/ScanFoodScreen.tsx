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
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../../backend/config/firebase';
import { collection, addDoc, doc, setDoc, arrayUnion } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { styles } from '../styles/ScanFoodScreen';
import AnimatedNutritionValue from '../components/ui/AnimatedNutritionValue';
import { foodCalorieDatabase } from '../data/foodCalorieDatabase';
import { uploadImageToCloudinary } from '../utils/uploadImageToCloudinary';
import { ROBOFLOW_API_KEY } from '@env';

// Types
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
  categories?: string;
  servingSize: string;
  nutriScore?: string;
  isFromPhoto?: boolean;
}

interface RoboflowPrediction {
  class: string;
  confidence: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface RoboflowResponse {
  outputs: Array<{
    predictions: RoboflowPrediction[];
  }>;
}

type ScanMode = 'photo' | 'barcode';

export default function ScanFoodScreen() {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');
  const [scanMode, setScanMode] = useState<ScanMode>('barcode');
  const [scannedProduct, setScannedProduct] = useState<ScannedProduct | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [detectedFoods, setDetectedFoods] = useState<RoboflowPrediction[]>([]);
  const [isMounted, setIsMounted] = useState(true);

  /* change details from per100g to perServing*/
  const [showPerServing, setShowPerServing] = useState(true);
  
  // Animation cho thanh quét
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  // Cleanup khi component unmount - improved
  useEffect(() => {
    setIsMounted(true);
    console.log('ScanFoodScreen mounted');
    
    return () => {
      console.log('ScanFoodScreen unmounting - cleaning up...');
      setIsMounted(false);
      
      // Stop tất cả animations
      scanLineAnim.stopAnimation();
      
      // Clear tất cả timeouts (nếu có)
      // clearTimeout(timeoutId);
      
      // Reset tất cả states
      setIsLoading(false);
      setIsScanning(false);
      setImageUri(null);
      setScannedProduct(null);
      setShowProductModal(false);
      setDetectedFoods([]);
      setCameraReady(false);
      
      console.log('ScanFoodScreen cleanup completed');
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

  // Animation cho thanh quét - chỉ chạy trong khung
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

  // Analyze food image using Roboflow Workflow API với better error handling
  const analyzeFoodWithRoboflow = async (imageUrl: string): Promise<RoboflowPrediction[]> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    try {
      console.log('Analyzing with Roboflow Workflow URL:', imageUrl);
      
      const correctEndpoint = 'https://serverless.roboflow.com/infer/workflows/healtheaty/detect-count-and-visualize';
      
      console.log(`Using correct endpoint: ${correctEndpoint}`);
      
      const response = await fetch(correctEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          api_key: ROBOFLOW_API_KEY,
          inputs: {
            "image": {
              "type": "url", 
              "value": imageUrl
            }
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!isMounted) return [];

      console.log(`Response status from correct endpoint:`, response.status);
      
      if (response.status === 401) {
        console.error('API Key unauthorized');
        throw new Error('API_KEY_INVALID');
      }
      
      if (response.status === 403) {
        console.error('Access forbidden');
        throw new Error('ACCESS_DENIED');
      }
      
      if (response.status === 404) {
        console.error('Workflow not found');
        throw new Error('WORKFLOW_NOT_FOUND');
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error from workflow:`, errorText);
        throw new Error(`WORKFLOW_ERROR_${response.status}`);
      }

      const result = await response.json();
      console.log(`Success result from workflow:`, JSON.stringify(result, null, 2));
      
      // Parse workflow response format
      let predictions = [];
      
      if (result.outputs && result.outputs.length > 0) {
        const output = result.outputs[0];
        console.log('Output structure:', JSON.stringify(output, null, 2));
        
        if (output.predictions) {
          if (Array.isArray(output.predictions)) {
            predictions = output.predictions;
          } else if (output.predictions.predictions && Array.isArray(output.predictions.predictions)) {
            predictions = output.predictions.predictions;
          } else if (typeof output.predictions === 'object') {
            predictions = [output.predictions];
          }
        } else if (output.detections) {
          predictions = Array.isArray(output.detections) ? output.detections : [output.detections];
        }
        
        console.log('Parsed predictions:', predictions);
        console.log('Count objects detected:', output.count_objects);
      }
      
      if (Array.isArray(predictions) && predictions.length > 0) {
        return predictions;
      }
      
      if (result.outputs[0]?.count_objects > 0) {
        console.log('Found objects but could not parse predictions, creating fallback...');
        return [{
          class: 'detected_food',
          confidence: 0.8,
          x: 0,
          y: 0,
          width: 100,
          height: 100
        }];
      }
      
      console.log('No predictions found, trying fallback endpoints...');
      return await tryFallbackEndpoints(imageUrl);
      
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        console.log('Request was aborted due to timeout');
        throw new Error('REQUEST_TIMEOUT');
      }
      
      console.error('Error analyzing food with Roboflow Workflow:', error);
      
      if (error.message === 'API_KEY_INVALID' || 
          error.message === 'ACCESS_DENIED' || 
          error.message === 'WORKFLOW_NOT_FOUND') {
        console.log('Using fallback food recognition...');
        return await getFallbackFoodPrediction();
      }
      
      throw error;
    }
  };

  // Fallback endpoints nếu workflow chính fail
  const tryFallbackEndpoints = async (imageUrl: string): Promise<RoboflowPrediction[]> => {
    const fallbackEndpoints = [
      'https://detect.roboflow.com/healtheaty/1',
      'https://detect.roboflow.com/healtheaty/2', 
      'https://detect.roboflow.com/food-detection/1'
    ];
    
    for (const endpoint of fallbackEndpoints) {
      try {
        console.log(`Trying fallback endpoint: ${endpoint}`);
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: `api_key=${ROBOFLOW_API_KEY}&image=${encodeURIComponent(imageUrl)}`
        });

        if (response.ok) {
          const result = await response.json();
          if (result.predictions && Array.isArray(result.predictions) && result.predictions.length > 0) {
            console.log(`Success with fallback: ${endpoint}`);
            return result.predictions;
          }
        }
      } catch (fallbackError) {
        console.log(`Fallback ${endpoint} failed:`, fallbackError.message);
        continue;
      }
    }
    
    return [];
  };

  // Fallback food prediction khi API không khả dụng
  const getFallbackFoodPrediction = async (): Promise<RoboflowPrediction[]> => {
    return [
      {
        class: 'general_food',
        confidence: 0.5,
        x: 0,
        y: 0,
        width: 100,
        height: 100
      }
    ];
  };

    const parseProductData = (product: any) => {
    const nutriments = product.nutriments || {};

    // Serving size
    const servingSize = product.serving_size || '100g';

    // Calories
    const caloriesPer100g = nutriments['energy-kcal_100g'] || nutriments['energy_100g'] * 0.23900573614 || null;
    const caloriesPerServing = nutriments['energy-kcal_serving'] || nutriments['energy_serving'] * 0.23900573614 || null;

    // Nutrients
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

      // Utility to safely convert string or number values
      const getNumericValue = (value: any): number => {
        if (typeof value === 'number') return value;
        if (typeof value === 'string') {
          const parsed = parseFloat(value);
          return isNaN(parsed) ? 0 : parsed;
        }
        return 0;
      };

      // Energy: fallback to kcal, or convert from kJ if needed
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
        categories: product.categories || '',
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


  // Save product to Firebase với better error handling
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

      // Thêm timeout cho Firebase operations
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

  // Kiểm tra xem mã vạch có nằm trong khung quét không
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
    
    // Kiểm tra xem mã vạch có nằm trong khung quét không
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

  // Take photo with camera với better error handling
  const takePhoto = useCallback(async () => {
    if (!cameraRef.current || !cameraReady || !isMounted) {
      Alert.alert("Error", "Camera is not ready");
      return;
    }

    try {
      setIsLoading(true);
      
      // Thêm timeout cho camera operation
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
        console.log('Photo taken:', photo.uri);
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

  // Pick image from library với better error handling
  const openImageLibrary = async () => {
    try {
      // Tạm dừng camera trước khi mở image picker
      setCameraReady(false);
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        allowsMultipleSelection: false, // Đảm bảo chỉ chọn 1 ảnh
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        
        if (!isMounted) return; // Check mounted state
        
        setImageUri(selectedImage.uri);
        console.log('Image selected for food recognition:', selectedImage.uri);
        
        // Tự động analyze ngay khi chọn ảnh với delay nhỏ
        setTimeout(async () => {
          if (isMounted && selectedImage.uri) {
            await analyzeFoodImageFromLibrary(selectedImage.uri);
          }
        }, 100);
      } else {
        // User cancelled - khôi phục camera
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
        // Khôi phục camera khi có lỗi
        setTimeout(() => {
          if (isMounted) {
            setCameraReady(true);
          }
        }, 100);
      }
    }
  };

  // Reset to camera view với proper cleanup
  const resetCamera = () => {
    if (!isMounted) return;
    
    console.log('Resetting camera...');
    
    // Reset states
    setImageUri(null);
    setScannedProduct(null);
    setShowProductModal(false);
    setIsScanning(false);
    setDetectedFoods([]);
    setIsLoading(false);
    
    // Stop animation trước khi reset
    scanLineAnim.stopAnimation();
    scanLineAnim.setValue(0);
    
    // Reset camera với delay để tránh conflicts
    setCameraReady(false);
    
    setTimeout(() => {
      if (isMounted) {
        console.log('Camera ready restored');
        setCameraReady(true);
        
        // Restart animation nếu ở barcode mode
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

  // Analyze food image from library
  const analyzeFoodImageFromLibrary = async (uri: string) => {
    try {
      setIsLoading(true);
      
      console.log('Uploading image to Cloudinary...');
      const uploadedImageUrl = await uploadImageToCloudinary(uri);
      
      if (!uploadedImageUrl) {
        throw new Error('Failed to upload image to Cloudinary');
      }
      
      console.log('Image uploaded to Cloudinary:', uploadedImageUrl);
      console.log('Analyzing food with Roboflow...');
      
      const predictions = await analyzeFoodWithRoboflow(uploadedImageUrl);
      
      if (predictions.length === 0) {
        Alert.alert(
          "Manual Food Entry", 
          "Could not automatically identify the food. Please enter the food name manually.",
          [
            { text: "Try Again", onPress: () => setImageUri(null) },
            { 
              text: "Enter Manually", 
              onPress: () => {
                const manualProduct: ScannedProduct = {
                  productName: 'Unknown Food - Please Edit',
                  calories: 100,
                  servingSize: '100g',
                  imageUrl: uploadedImageUrl,
                  isFromPhoto: true,
                  categories: 'General',
                };
                setScannedProduct(manualProduct);
                setShowProductModal(true);
              }
            }
          ]
        );
        return;
      }

      setDetectedFoods(predictions);
      
      // Handle fallback prediction
      if (predictions[0].class === 'general_food') {
        Alert.alert(
          "Food Detected", 
          "AI service is temporarily unavailable, but your image has been saved. Please enter food details manually.",
          [
            { text: "OK", onPress: () => {
              const manualProduct: ScannedProduct = {
                productName: 'Food Item - Please Edit Name',
                calories: 150,
                servingSize: '100g',
                imageUrl: uploadedImageUrl,
                isFromPhoto: true,
                categories: 'General',
              };
              setScannedProduct(manualProduct);
              setShowProductModal(true);
            }}
          ]
        );
        return;
      }
      
      // Lấy prediction có confidence cao nhất
      const topPrediction = predictions.reduce((prev, current) => 
        prev.confidence > current.confidence ? prev : current
      );

      console.log('Top prediction:', topPrediction);

      // Tra cứu calories từ database
      const foodName = topPrediction.class.toLowerCase();
      const calorieInfo = foodCalorieDatabase[foodName] || { 
        calories: 100, 
        servingSize: '100g',
        category: 'General'
      };

      const detectedProduct: ScannedProduct = {
        productName: topPrediction.class,
        calories: calorieInfo.calories,
        servingSize: calorieInfo.servingSize,
        imageUrl: uploadedImageUrl,
        isFromPhoto: true,
        categories: calorieInfo.category,
      };

      setScannedProduct(detectedProduct);
      setShowProductModal(true);
      
    } catch (error) {
      console.error('Error analyzing food from library:', error);
      
      if (error.message === 'API_KEY_INVALID') {
        Alert.alert(
          "Service Temporarily Unavailable", 
          "AI food recognition is currently unavailable. You can still save your food manually.",
          [
            { text: "Cancel", onPress: () => setImageUri(null) },
            { 
              text: "Continue Manually", 
              onPress: async () => {
                try {
                  const uploadedImageUrl = await uploadImageToCloudinary(uri);
                  const manualProduct: ScannedProduct = {
                    productName: 'Food Item - Please Edit',
                    calories: 100,
                    servingSize: '100g',
                    imageUrl: uploadedImageUrl || uri,
                    isFromPhoto: true,
                    categories: 'General',
                  };
                  setScannedProduct(manualProduct);
                  setShowProductModal(true);
                } catch (uploadError) {
                  Alert.alert("Error", "Could not process the image. Please try again.");
                  setImageUri(null);
                }
              }
            }
          ]
        );
      } else {
        Alert.alert(
          "Analysis Failed", 
          "Could not analyze the image. Please check your internet connection and try again.",
          [
            { text: "Try Again", onPress: () => setImageUri(null) },
            { text: "OK" }
          ]
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Analyze food image from camera
  const analyzeFoodImage = async () => {
    if (!imageUri) return;

    try {
      setIsLoading(true);
      
      console.log('Uploading camera image to Cloudinary...');
      const uploadedImageUrl = await uploadImageToCloudinary(imageUri);
      
      if (!uploadedImageUrl) {
        throw new Error('Failed to upload image to Cloudinary');
      }
      
      console.log('Camera image uploaded to Cloudinary:', uploadedImageUrl);
      
      const predictions = await analyzeFoodWithRoboflow(uploadedImageUrl);
      
      if (predictions.length === 0) {
        Alert.alert(
          "No Food Detected", 
          "Could not identify food in this image. You can still save it manually with estimated calories.",
          [
            { text: "Retake Photo", onPress: () => resetCamera() },
            { 
              text: "Save Anyway", 
              onPress: () => {
                const manualProduct: ScannedProduct = {
                  productName: 'Unknown Food',
                  calories: 100,
                  servingSize: '100g',
                  imageUrl: uploadedImageUrl,
                  isFromPhoto: true,
                  categories: 'General',
                };
                setScannedProduct(manualProduct);
                setShowProductModal(true);
              }
            }
          ]
        );
        return;
      }

      setDetectedFoods(predictions);
      
      const topPrediction = predictions.reduce((prev, current) => 
        prev.confidence > current.confidence ? prev : current
      );

      const foodName = topPrediction.class.toLowerCase();
      const calorieInfo = foodCalorieDatabase[foodName] || { 
        calories: 100, 
        servingSize: '100g',
        category: 'General'
      };

      const detectedProduct: ScannedProduct = {
        productName: topPrediction.class,
        calories: calorieInfo.calories,
        servingSize: calorieInfo.servingSize,
        imageUrl: uploadedImageUrl,
        isFromPhoto: true,
        categories: calorieInfo.category,
      };

      setScannedProduct(detectedProduct);
      setShowProductModal(true);
      
    } catch (error) {
      console.error('Error analyzing camera food:', error);
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
  

  // Switch scan mode với proper cleanup
  const switchScanMode = () => {
    console.log(`Switching from ${scanMode} to ${scanMode === 'photo' ? 'barcode' : 'photo'}`);
    
    // Stop current animation
    scanLineAnim.stopAnimation();
    scanLineAnim.setValue(0);
    
    // Switch mode
    setScanMode(scanMode === 'photo' ? 'barcode' : 'photo');
    
    // Reset camera with proper cleanup
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
          {/* Camera View - KHÔNG CÓ CHILDREN */}
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

          {/* Camera Overlay - ABSOLUTE POSITIONING */}
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
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Ionicons name="image-outline" size={28} color="white" />
                )}
              </TouchableOpacity>
            </View>

            {/* Scanning Frame */}
            <View style={styles.scanningFrame}>
              {scanMode === 'barcode' && (
                <View style={styles.scanningArea}>
                  <View style={styles.corner} />
                  <View style={[styles.corner, styles.cornerTopRight]} />
                  <View style={[styles.corner, styles.cornerBottomLeft]} />
                  <View style={[styles.corner, styles.cornerBottomRight]} />
                  
                  {/* Animated scan line chỉ hiển thị khi ở chế độ barcode */}
                  <Animated.View
                    style={[
                      styles.scanLine,
                      {
                        transform: [
                          {
                            translateY: scanLineAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, 180],
                            }),
                          },
                        ],
                      },
                    ]}
                  />
                </View>
              )}
              
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
                  Tap to identify food and get calorie information
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
            <Text style={styles.modalTitle}>
              {scannedProduct?.isFromPhoto ? 'Detected Food' : 'Product Details'}
            </Text>
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
                  {scannedProduct.brand && (
                    <Text style={styles.productBrand}>{scannedProduct.brand}</Text>
                  )}
                  {scannedProduct.barcode && (
                    <Text style={styles.productBarcode}>Barcode: {scannedProduct.barcode}</Text>
                  )}
                  
                  {/* Show confidence for AI detection */}
                  {scannedProduct.isFromPhoto && detectedFoods.length > 0 && (
                    <Text style={styles.productBarcode}>
                      Confidence: {Math.round(detectedFoods[0].confidence * 100)}%
                    </Text>
                  )}
                  
                  {/* Nutri-Score */}
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
                      Nutrition Facts ({showPerServing ? 'per serving' : 'per 100g'} - {scannedProduct.servingSize})
                    </Text>
                    <Text style={styles.nutritionItem}>
                    Calories: 
                    {showPerServing 
                      ? scannedProduct.caloriesPerServing?.toFixed(0) ?? 'N/A' 
                      : scannedProduct.caloriesPer100g?.toFixed(0) ?? 'N/A'}
                    </Text>
                    /* change the default setting calorie*/
                    <TouchableOpacity onPress={() => setShowPerServing(!showPerServing)}>
                    <Text style={{ color: 'blue', marginBottom: 10 }}>
                        {showPerServing ? 'Switch to per 100g' : 'Switch to per serving'}
                    </Text>
                    </TouchableOpacity>

                    {scannedProduct.isFromPhoto ? (
                      // Simplified nutrition for photo-detected foods
                      <View style={styles.nutritionGrid}>
                        <View style={styles.nutritionItemCard}>
                          <Ionicons name="flame" size={24} color="#FF6B35" style={styles.nutritionIcon} />
                          <Text style={styles.nutritionLabel}>Calories</Text>
                          <AnimatedNutritionValue value={scannedProduct.calories} suffix=" kcal" duration={2000} />
                        </View>
                      </View>
                    ) : (
                      // Full nutrition for barcode-scanned products
                     <View style={styles.nutritionGrid}>
                    {[
                      {
                        label: 'Calories', rawValue: showPerServing ? scannedProduct.caloriesPerServing ?? 0 : scannedProduct.caloriesPer100g ?? 0,
                        icon: 'flame', suffix: ' kcal',
                      },
                      {
                        label: 'Fat', rawValue: showPerServing ? scannedProduct.nutrientsPerServing?.fat ?? 0 : scannedProduct.nutrients?.fat ?? 0,
                        icon: 'pizza', suffix: 'g',
                      },
                      {
                        label: 'Carbs', rawValue: showPerServing ? scannedProduct.nutrientsPerServing?.carbs ?? 0 : scannedProduct.nutrients?.carbs ?? 0,
                        icon: 'leaf', suffix: 'g',
                      },
                      {
                        label: 'Protein', rawValue: showPerServing ? scannedProduct.nutrientsPerServing?.protein ?? 0 : scannedProduct.nutrients?.protein ?? 0,
                        icon: 'fitness', suffix: 'g',
                      },
                      {
                        label: 'Sugar', rawValue: showPerServing ? scannedProduct.nutrientsPerServing?.sugar ?? 0 : scannedProduct.nutrients?.sugar ?? 0,
                        icon: 'ice-cream', suffix: 'g',
                      },
                      {
                        label: 'Fiber',
                        rawValue: showPerServing ? scannedProduct.nutrientsPerServing?.fiber ?? 0 : scannedProduct.nutrients?.fiber ?? 0,
                        icon: 'barbell', suffix: 'g',
                      },
                    ].map((item, index) => (
                      <View key={index} style={styles.nutritionItemCard}>
                        <Ionicons name={item.icon as any} size={24} color="#4CAF50" style={styles.nutritionIcon} />
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