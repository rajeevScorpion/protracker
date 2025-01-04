import { 
  collection, 
  doc,
  setDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';

interface Category {
  id: string;
  name: string;
}

export const settingsService = {
  async saveCategories(userId: string, type: 'activity' | 'task', categories: Category[]) {
    try {
      console.log('Starting to save categories:', { userId, type, categories });

      // First, delete existing categories
      const categoriesRef = collection(db, 'categories');
      const q = query(
        categoriesRef,
        where('userId', '==', userId),
        where('type', '==', type)
      );
      
      const existingDocs = await getDocs(q);
      console.log('Found existing categories:', existingDocs.size);

      // Delete existing categories one by one
      for (const doc of existingDocs.docs) {
        await deleteDoc(doc.ref);
      }
      console.log('Deleted existing categories');

      // Add new categories one by one
      for (const category of categories) {
        const newDocRef = doc(categoriesRef); // Create a new document reference
        await setDoc(newDocRef, {  // Use setDoc instead of newDocRef.set
          userId,
          type,
          name: category.name,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        console.log('Added category:', category.name);
      }
      console.log('Added all new categories');

      return true;
    } catch (error) {
      console.error('Error saving categories:', error);
      throw error;
    }
  },

  async getCategories(userId: string, type: 'activity' | 'task') {
    try {
      const categoriesRef = collection(db, 'categories');
      const q = query(
        categoriesRef,
        where('userId', '==', userId),
        where('type', '==', type)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name
      }));
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }
};
