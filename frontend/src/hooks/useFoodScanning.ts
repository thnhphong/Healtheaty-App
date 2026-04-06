import { useState, useCallback, useRef, useEffect } from 'react';
import { Alert, Animated } from 'react-native';
import { CameraView } from 'expo-camera';
import { productService } from '../services/productService';
import { ScannedProduct, VietnameseFoodPrediction } from '../types/product';
import { uploadImageToCloudinary } from '../utils/uploadImageToCloudinary';

export type ScanMode = 'photo' | 'barcode';

export const useFoodScanning = (isMounted: boolean) => {
  const cameraRef = useRef<CameraView>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [scanMode, setScanMode] = useState<ScanMode>('photo');
  const [scannedProduct, setScannedProduct] = useState<ScannedProduct | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [vietnameseFoodPredictions, setVietnameseFoodPredictions] = useState<VietnameseFoodPrediction[]>([]);
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  // Animation logic
  useEffect(() => {
    if (!isMounted || scanMode !== 'barcode') return;
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(scanLineAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [scanMode, isMounted]);

  const resetCamera = useCallback(() => {
    if (!isMounted) return;
    setImageUri(null);
    setScannedProduct(null);
    setShowProductModal(false);
    setIsScanning(false);
    setVietnameseFoodPredictions([]);
    setIsLoading(false);
    setCameraReady(false);
    setTimeout(() => {
      if (isMounted) setCameraReady(true);
    }, 200);
  }, [isMounted]);

  const takePhoto = useCallback(async () => {
    if (!cameraRef.current || !cameraReady || !isMounted) return;
    try {
      setIsLoading(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        exif: false,
      });
      if (photo && photo.uri && isMounted) {
        setImageUri(photo.uri);
      }
    } catch (error) {
      console.error('takePhoto error:', error);
      Alert.alert("Error", "Failed to take photo.");
    } finally {
      if (isMounted) setIsLoading(false);
    }
  }, [cameraReady, isMounted]);

  const analyzeFoodImage = useCallback(async () => {
    if (!imageUri) return;
    try {
      setIsLoading(true);
      const apiResult = await productService.analyzeVietnameseFood(imageUri, isMounted);
      if (apiResult.success && apiResult.top_predictions.length > 0 && isMounted) {
        setVietnameseFoodPredictions(apiResult.top_predictions);
        const detectedProduct = productService.createVietnameseFoodProduct(
          apiResult.top_predictions[0],
          apiResult.top_predictions,
          imageUri
        );
        setScannedProduct(detectedProduct);
        setShowProductModal(true);
      }
    } catch (error: any) {
      console.log('Vietnamese Food API failed, using fallback...');
      const uploadedImageUrl = await uploadImageToCloudinary(imageUri);
      if (uploadedImageUrl && isMounted) {
          setScannedProduct({
            productName: 'Vietnamese Food Item',
            calories: 250,
            servingSize: '1 phần',
            imageUrl: uploadedImageUrl,
            isFromPhoto: true,
          });
          setShowProductModal(true);
      }
    } finally {
      if (isMounted) setIsLoading(false);
    }
  }, [imageUri, isMounted]);

  const handleBarCodeScanned = useCallback(async ({ data }: { data: string }) => {
    if (isScanning || !isMounted) return;
    setIsScanning(true);
    setIsLoading(true);
    try {
      const product = await productService.fetchProductByBarcode(data);
      if (product && isMounted) {
        setScannedProduct(product);
        setShowProductModal(true);
      }
    } finally {
      if (isMounted) {
          setIsLoading(false);
          setTimeout(() => setIsScanning(false), 2000);
      }
    }
  }, [isScanning, isMounted]);

  return {
    cameraRef,
    imageUri, setImageUri,
    isLoading, cameraReady, setCameraReady,
    scanMode, setScanMode,
    scannedProduct, setScannedProduct,
    showProductModal, setShowProductModal,
    isScanning,
    scanLineAnim,
    resetCamera,
    takePhoto,
    analyzeFoodImage,
    handleBarCodeScanned,
  };
};
