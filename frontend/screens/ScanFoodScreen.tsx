import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert
} from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/ScanFoodScreen';
const ScanFoodScreen = () => {
  const cameraRef = useRef<InstanceType<typeof Camera> | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const pickImageFromLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Requesting permissions...</Text></View>;
  }

  if (hasPermission === false) {
    return <View style={styles.container}><Text>No access to camera</Text></View>;
  }

  return (
    <View style={styles.container}>
      {!imageUri ? (
        <Camera style={styles.camera} ref={cameraRef}>
          <View style={styles.overlay} />

          <TouchableOpacity style={styles.topRightIcon} onPress={pickImageFromLibrary}>
            <Ionicons name="image-outline" size={30} color="white" />
          </TouchableOpacity>
        </Camera>
      ) : (
        <Image source={{ uri: imageUri }} style={styles.camera} />
      )}

      <View style={styles.resultCard}>
        <View style={styles.foodInfoRow}>
          <Image />
          <View>
            <Text style={styles.resultText}>Bananas are good for gastritis!</Text>
            <Text style={styles.resultSubtext}>Tap to read more about bananas and view recipes</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ScanFoodScreen;
