import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  ScrollView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { NavigationProp } from '@react-navigation/native';
import { styles } from '../styles/EditProfileStyles';
// Firebase imports
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../backend/config/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
//image picker
import * as ImagePicker from 'expo-image-picker';
//change password
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';

//calculateCalories 
import { calculateBMR, calculateTDEE } from '../utils/calculateCalories';
//uploadImageToCloudinary
import { uploadImageToCloudinary } from '../utils/uploadImageToCloudinary';

type RootStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
  UserInfo: undefined;
  Home: undefined;
  Profile: undefined;
  EditProfile: undefined;
};

type EditProfileScreenProps = {
  navigation: NavigationProp<RootStackParamList, 'EditProfile'>;
};

interface UserData {
  fullName?: string;
  email?: string;
}

interface UserInfo {
  age: number;
  gender: 'male' | 'female';
  height: number;
  weight: number;
  activityFactor: number;
  avatarUrl?: string;
}

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation }) => {
  const [userData, setUserData] = useState<UserData>({ fullName: '', email: '' });
  const [userInfo, setUserInfo] = useState<UserInfo>({
    age: 0,
    gender: 'male',
    height: 0,
    weight: 0,
    activityFactor: 1,
    avatarUrl: '',
  });
  const [image, setImage] = useState<string | null>(null);
  const [imageChanged, setImageChanged] = useState<boolean>(false);
  const [showPicker, setShowPicker] = useState(false);
  const [showActivityPicker, setShowActivityPicker] = useState(false);
    // Activity factor options with descriptions
  const activityFactorOptions = [
    { value: 1, label: 'Sedentary (little/no exercise)' },
    { value: 2, label: 'Light activity (1-3 days/week)' },
    { value: 3, label: 'Moderate activity (3-5 days/week)' },
    { value: 4, label: 'Very active (6-7 days/week)' },
    { value: 5, label: 'Extremely active (2 times/day)' }
  ];
  const [isLoading, setIsLoading] = useState(false);

  //change password state 
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  useEffect(() => {
    requestPermissions();
    loadUserData();
  }, []);

  const requestPermissions = async () => {
    try {
      // Request media library permissions
      const mediaLibraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      // Request camera permissions
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      
      if (mediaLibraryStatus.status !== 'granted') {
        Alert.alert(
          'Permission Required', 
          'We need permission to access your photo library to update your profile picture.'
        );
      }
      
      if (cameraStatus.status !== 'granted') {
        console.log('Camera permission not granted');
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
    }
  };

  const loadUserData = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.log('User not logged in');
      Alert.alert('Error', 'User not authenticated');
      return;
    }
    
    try {
      const userDocRef = doc(db, 'user', user.uid);
      const userDoc = await getDoc(userDocRef);
      const userDataFromFirestore: UserData = userDoc.exists() ? userDoc.data() as UserData : {};

      const userInfoRef = doc(db, 'userInfo', user.uid);
      const userInfoDoc = await getDoc(userInfoRef);
      const userInfoData = userInfoDoc.exists() ? userInfoDoc.data() as UserInfo : null;

      setUserData({
        fullName: userDataFromFirestore.fullName ?? '',
        email: userDataFromFirestore.email || user.email || '',
      });
      
      setUserInfo({
        age: userInfoData?.age || 0,
        gender: userInfoData?.gender || 'male',
        height: userInfoData?.height || 0,
        weight: userInfoData?.weight || 0,
        activityFactor: userInfoData?.activityFactor || 1,
        avatarUrl: userInfoData?.avatarUrl || '',
      });
      
      setImage(userInfoData?.avatarUrl || null);
    } catch (error) {
      Alert.alert('Error', 'Failed to load user data');
    }
  };

  const uploadImageAsync = async (uri: string): Promise<string | null> => {
    try {
      const userId = auth.currentUser?.uid;
      if(!userId) throw new Error('User not authenticated');
      
      const response = await fetch(uri); 
      if (!response.ok) throw new Error('Failed to fetch image');
      const blob = await response.blob();
  
      const storage = getStorage();
      const timestamp = Date.now();
      const imageRef = ref(storage, `avatars/${userId}_${timestamp}.jpg`);
      
      await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(imageRef);
      return downloadURL;
    } catch (error) {
      console.error('Image upload failed:', error);
      console.log('Full Firebase error:', JSON.stringify(error));
      Alert.alert('Error', 'Failed to upload image. Please try again.');
      return null;
    }
  };  

  const pickImage = async () => {
    try {
      // Show action sheet to choose between camera and library
      Alert.alert(
        'Select Image',
        'Choose an option',
        [
          { text: 'Camera', onPress: openCamera },
          { text: 'Photo Library', onPress: openImageLibrary },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } catch (error) {
      console.error('Error in pickImage:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const openCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      handleImageResult(result);
    } catch (error) {
      console.error('Error opening camera:', error);
      Alert.alert('Error', 'Failed to open camera');
    }
  };

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

  const handleImageResult = (result: ImagePicker.ImagePickerResult) => {
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      console.log('Selected image:', selectedImage.uri);  
      setImage(selectedImage.uri);                         
      setImageChanged(true);
    }
  };
  
  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    // Basic validation
    if (!userData.fullName?.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return;
    }

    if (userInfo.age <= 0 || userInfo.height <= 0 || userInfo.weight <= 0) {
      Alert.alert('Error', 'Please enter valid age, height, and weight');
      return;
    }
    
    setIsLoading(true);
    try {
      let uploadedImageUrl = userInfo.avatarUrl;

      // Upload image if it was changed
      if (imageChanged && image) {
        console.log('Uploading new image...');
        const uploaded = await uploadImageToCloudinary(image);
        if (uploaded) {
          uploadedImageUrl = uploaded;
          console.log('Image uploaded successfully:', uploaded);
        } else {
          throw new Error('Image upload failed');
        }
      }

      //calculate BMR and TDEE
      const bmr = calculateBMR(userInfo.gender, userInfo.weight, userInfo.height, userInfo.age);
      const tdee = calculateTDEE(bmr, userInfo.activityFactor);

      // Update user data
      const userDocRef = doc(db, 'user', user.uid);
      await updateDoc(userDocRef, {
        fullName: userData.fullName.trim(),
        email: userData.email,
      });

      // Update user info
      const userInfoRef = doc(db, 'userInfo', user.uid);
      await updateDoc(userInfoRef, {
        age: userInfo.age,
        gender: userInfo.gender,
        height: userInfo.height,
        weight: userInfo.weight,
        activityFactor: userInfo.activityFactor,
        avatarUrl: uploadedImageUrl,
        bmr, 
        tdee,
        updatedAt: new Date().toISOString(),
      });

      // Reset image changed flag
      setImageChanged(false);
      
      Alert.alert('Success', 'Profile updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving user data:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!user || !user.email) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }
  
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }
  
    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
  
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential); // must reauth before updating password
  
      await updatePassword(user, newPassword); // actual password update
      Alert.alert('Success', 'Password changed successfully');
      setShowPasswordForm(false); 
    } catch (error: any) {
      console.error('Change password error:', error);
      if (error.code === 'auth/wrong-password') {
        Alert.alert('Error', 'Incorrect current password');
      } else if (error.code === 'auth/requires-recent-login') {
        Alert.alert('Error', 'Please log in again and retry');
      } else {
        Alert.alert('Error', error.message || 'Failed to change password');
      }
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
          <Image
            source={{ uri: image || 'https://via.placeholder.com/80' }}
            style={styles.avatar}
          />
          <Text style={styles.changePhoto}>
            {image ? 'Change Photo' : 'Upload Photo'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={userData.fullName || ''}
          onChangeText={(text) => setUserData({ ...userData, fullName: text })}
          placeholder="Enter your full name"
        />

        <Text style={styles.label}>Email (read-only)</Text>
        <TextInput
          style={[styles.input, styles.disabled]}
          value={userData.email || ''}
          editable={false}
        />

        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          value={userInfo.age > 0 ? userInfo.age.toString() : ''}
          onChangeText={(text) => setUserInfo({ ...userInfo, age: parseInt(text) || 0 })}
          keyboardType="numeric"
          placeholder="Enter your age"
        />

        <Text style={styles.label}>Gender</Text>
        <TouchableOpacity 
          style={styles.genderButton} 
          onPress={() => setShowPicker(true)}
        >
          <Text style={styles.genderButtonText}>
            {userInfo.gender ? userInfo.gender.charAt(0).toUpperCase() + userInfo.gender.slice(1) : 'Select Gender'}
          </Text>
          <Text style={styles.dropdownIcon}>▼</Text>
        </TouchableOpacity>

        {showPicker && (
          <Modal transparent={true} visible={showPicker} animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Gender</Text>
                <TouchableOpacity 
                  style={styles.optionButton}
                  onPress={() => {
                    setUserInfo({ ...userInfo, gender: 'male' });
                    setShowPicker(false);
                  }}
                >
                  <Text style={styles.optionText}>Male</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.optionButton}
                  onPress={() => {
                    setUserInfo({ ...userInfo, gender: 'female' });
                    setShowPicker(false);
                  }}
                >
                  <Text style={styles.optionText}>Female</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setShowPicker(false)}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}

        <Text style={styles.label}>Height (cm)</Text>
        <TextInput
          style={styles.input}
          value={userInfo.height > 0 ? userInfo.height.toString() : ''}
          onChangeText={(text) => setUserInfo({ ...userInfo, height: parseInt(text) || 0 })}
          keyboardType="numeric"
          placeholder="Enter your height in cm"
        />

        <Text style={styles.label}>Weight (kg)</Text>
        <TextInput
          style={styles.input}
          value={userInfo.weight > 0 ? userInfo.weight.toString() : ''}
          onChangeText={(text) => setUserInfo({ ...userInfo, weight: parseInt(text) || 0 })}
          keyboardType="numeric"
          placeholder="Enter your weight in kg"
        />


    // Replace the TextInput with this custom picker
    <Text style={styles.label}>Activity Factor</Text>
    <TouchableOpacity 
      style={styles.activityButton} 
      onPress={() => setShowActivityPicker(true)}
    >
      <View style={styles.activityButtonContent}>
        <Text style={styles.activityButtonText}>
          {userInfo.activityFactor > 0 
            ? `${activityFactorOptions.find(opt => opt.value === userInfo.activityFactor)?.label || 'Custom'} (${userInfo.activityFactor})`
            : 'Select Activity Level'
          }
        </Text>
        <Text style={styles.activityDescription}>
          {userInfo.activityFactor > 0 
            ? activityFactorOptions.find(opt => opt.value === userInfo.activityFactor)?.description || 'Custom value'
            : 'Choose your activity level'
          }
        </Text>
      </View>
      <Text style={styles.dropdownIcon}>▼</Text>
    </TouchableOpacity>

    {showActivityPicker && (
      <Modal transparent={true} visible={showActivityPicker} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.activityModalContent}>
            <Text style={styles.modalTitle}>Select Activity Level</Text>
            <Text style={styles.modalSubtitle}>Choose the option that best describes your activity level</Text>
            
            {activityFactorOptions.map((option) => (
              <TouchableOpacity 
                key={option.value}
                style={[
                  styles.activityOptionButton,
                  userInfo.activityFactor === option.value && styles.selectedOption
                ]}
                onPress={() => {
                  setUserInfo({ ...userInfo, activityFactor: option.value });
                  setShowActivityPicker(false);
                }}
              >
                <View style={styles.activityOptionContent}>
                  <Text style={[
                    styles.activityOptionLabel,
                    userInfo.activityFactor === option.value && styles.selectedOptionText
                  ]}>
                    {option.label}
                  </Text>
                  <Text style={[
                    styles.activityOptionValue,
                    userInfo.activityFactor === option.value && styles.selectedOptionText
                  ]}>
                    Factor: {option.value}
                  </Text>
                  <Text style={[
                    styles.activityOptionDescription,
                    userInfo.activityFactor === option.value && styles.selectedOptionDescText
                  ]}>
                    {option.description}
                  </Text>
                </View>
                {userInfo.activityFactor === option.value && (
                  <Ionicons name="checkmark" size={20} color="#007AFF" />
                )}
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowActivityPicker(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )}
    //password change 
            <TouchableOpacity
      style={styles.menuItem}
      onPress={() => setShowPasswordForm(!showPasswordForm)}
    >
      <Ionicons name="key" size={24} color="#FF6B35" />
      <Text style={styles.menuText}>Change Password</Text>
    </TouchableOpacity>

    // Password Change Form
    {showPasswordForm && (
    <View style={{ paddingVertical: 10 }}>
      <Text style={styles.label}>Current Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />

      <Text style={styles.label}>New Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <Text style={styles.label}>Confirm New Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleChangePassword}>
        <Text style={styles.saveButtonText}>Update Password</Text>
      </TouchableOpacity>
    </View>
  )}


        <TouchableOpacity 
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]} 
          onPress={handleSave}
          disabled={isLoading}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;