import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import app from '../lib/firebase';

const storage = getStorage(app);

// Add image compression before upload
async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      // Calculate new dimensions (max 800px width/height)
      const maxSize = 800;
      let width = img.width;
      let height = img.height;
      
      if (width > height && width > maxSize) {
        height *= maxSize / width;
        width = maxSize;
      } else if (height > maxSize) {
        width *= maxSize / height;
        height = maxSize;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        'image/jpeg',
        0.8
      );
    };
    img.onerror = () => reject(new Error('Failed to load image'));
  });
}

export const storageService = {
  async uploadActivityImage(userId: string, file: File): Promise<string> {
    try {
      // Compress image before upload
      const compressedImage = await compressImage(file);
      
      // Create a reference with a unique name
      const storageRef = ref(
        storage, 
        `users/${userId}/activities/${Date.now()}_${file.name}`
      );
      
      // Upload compressed image
      await uploadBytes(storageRef, compressedImage);
      
      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  }
};
