// utils/uploadImageToCloudinary.ts
export const uploadImageToCloudinary = async (imageUri: string): Promise<string | null> => {
  const cloudName = 'due9krfrv'; // Replace with your Cloudinary cloud name
  const uploadPreset = 'healtheaty_unsigned'; // Replace with your unsigned upload preset

  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'upload.jpg',
  } as any);
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.secure_url) {
      return data.secure_url;
    } else {
      console.error('Cloudinary upload error:', data);
      return null;
    }
  } catch (err) {
    console.error('Upload failed:', err);
    return null;
  }
};
