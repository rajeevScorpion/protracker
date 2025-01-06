import { 
  collection, 
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';

interface Category {
  id: string;
  name: string;
}

interface UserProfile {
  name: string;
  designation: string;
  company: string;
  mobile: string;
  email: string;
}

export const settingsService = {
  async getUserProfile(userId: string) {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  },

  async updateUserProfile(userId: string, profileData: Partial<UserProfile>) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...profileData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  async initializeUserProfile(userId: string, email: string) {
    try {
      const userRef = doc(db, 'users', userId);
      const profile = {
        name: '',
        designation: '',
        company: '',
        mobile: '',
        email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      await setDoc(userRef, profile);
      return profile;
    } catch (error) {
      console.error('Error initializing user profile:', error);
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
  },

  async addCategory(userId: string, type: 'activity' | 'task', name: string) {
    try {
      const categoriesRef = collection(db, 'categories');
      const newDocRef = doc(categoriesRef);
      
      const categoryData = {
        userId,
        type,
        name,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await setDoc(newDocRef, categoryData);
      
      return {
        id: newDocRef.id,
        name
      };
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  },

  async updateCategory(userId: string, type: 'activity' | 'task', categoryId: string, name: string) {
    try {
      const categoryRef = doc(db, 'categories', categoryId);
      await updateDoc(categoryRef, {
        name,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  async deleteCategory(userId: string, type: 'activity' | 'task', categoryId: string) {
    try {
      const categoryRef = doc(db, 'categories', categoryId);
      await deleteDoc(categoryRef);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }
};
