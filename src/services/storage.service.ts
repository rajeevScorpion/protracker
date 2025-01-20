import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';

export const storageService = {
  async uploadActivityImage(userId: string, file: File): Promise<string> {
    try {
      // Create a reference to the file location
      const storageRef = ref(
        storage, 
        `users/${userId}/activities/${Date.now()}_${file.name}`
      );
      
      // Upload the file
      const snapshot = await uploadBytes(storageRef, file);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  },

  async uploadActivityImages(userId: string, files: File[]): Promise<string[]> {
    try {
      const uploadPromises = files.map(file => this.uploadActivityImage(userId, file));
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading images:', error);
      throw new Error('Failed to upload images');
    }
  }
};
