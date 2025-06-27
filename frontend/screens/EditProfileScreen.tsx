// frontend/screens/ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import { styles } from '../styles/ProfileScreenStyles';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../backend/config/firebase';
import { auth } from '../../backend/config/firebase';

import { useNavigation } from '@react-navigation/native';

type RootStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
  UserInfo: undefined;
  Home: undefined;
  Profile: undefined;
  EditProfile: undefined;
};
interface EditProfileScreenProps {
  navigation: NavigationProp<RootStackParamList, 'EditProfile'>;
}
interface UserData {
  fullName?: string;
  email?: string;
}


const EditProfileScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('To Thanh Phong'); // default value, replace with user data
  const [email] = useState('thnhphong4869@gmail.com'); // read-only
  const [image, setImage] = useState('https://i.imgur.com/your-profile-pic.png'); // replace with actual image URL

  const handleSave = () => {
    // TODO: Save name and image to Firestore / Firebase Storage
    Alert.alert('Profile updated!');
    navigation.goBack();
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Profile</Text>

      <TouchableOpacity onPress={pickImage}>
        <Image source={{ uri: image }} style={styles.avatar} />
        <Text style={styles.changePhoto}>Change Photo</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Email (read-only)</Text>
      <Text style={[styles.input, styles.disabled]}>{email}</Text>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditProfileScreen;

