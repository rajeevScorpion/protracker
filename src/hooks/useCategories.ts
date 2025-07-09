import { useState, useEffect, useCallback } from 'react';
import { useAuthState } from './useAuthState';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const useCategories = (type: 'activity' | 'task') => {
  const { user } = useAuthState();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const categoriesRef = collection(db, 'categories');
      const q = query(
        categoriesRef,
        where('userId', '==', user.uid),
        where('type', '==', type)
      );
      
      const snapshot = await getDocs(q);
      const fetchedCategories = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name
      }));
      
      console.log(`Loaded ${type} categories:`, fetchedCategories);
      setCategories(fetchedCategories);
    } catch (err) {
      console.error('Error loading categories:', err);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, [user, type]);

  useEffect(() => {
    if (user) {
      loadCategories();
    }
  }, [loadCategories, user]);

  const addCategory = async (name: string) => {
    if (!user || !name.trim()) return;
    
    try {
      const categoriesRef = collection(db, 'categories');
      const newCategory = {
        name: name.trim(),
        userId: user.uid,
        type,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const docRef = await addDoc(categoriesRef, newCategory);
      const category = { id: docRef.id, name: name.trim() };
      setCategories(prev => [...prev, category]);
      return category;
    } catch (err) {
      console.error('Error adding category:', err);
      throw err;
    }
  };

import { addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore'; // Import firestore methods
import { settingsService } from '../services/settings.service'; // Import settingsService

// ... (keep existing imports and code)

export const useCategories = (type: 'activity' | 'task') => {
  const { user } = useAuthState();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const fetchedCategories = await settingsService.getCategories(user.uid, type);

      console.log(`Loaded ${type} categories:`, fetchedCategories);
      setCategories(fetchedCategories);
    } catch (err) {
      console.error('Error loading categories:', err);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, [user, type]);

  useEffect(() => {
    if (user) {
      loadCategories();
    }
  }, [loadCategories, user]);

  const addCategory = async (name: string) => {
    if (!user || !name.trim()) return null;

    try {
      const newCategoryData = await settingsService.addCategory(user.uid, type, name.trim());
      const category = { id: newCategoryData.id, name: newCategoryData.name };
      setCategories(prev => [...prev, category]);
      return category;
    } catch (err) {
      console.error('Error adding category:', err);
      setError(`Failed to add ${type} category`);
      return null;
    }
  };

  const updateCategory = async (id: string, name: string) => {
    if (!user || !name.trim()) return;

    try {
      await settingsService.updateCategory(user.uid, type, id, name.trim());
      setCategories(prev =>
        prev.map(cat => (cat.id === id ? { ...cat, name: name.trim() } : cat))
      );
    } catch (err) {
      console.error('Error updating category:', err);
      setError(`Failed to update ${type} category`);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!user) return;

    try {
      await settingsService.deleteCategory(user.uid, type, id);
      setCategories(prev => prev.filter(cat => cat.id !== id));
    } catch (err) {
      console.error('Error deleting category:', err);
      setError(`Failed to delete ${type} category`);
    }
  };

  return {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    refresh: loadCategories
  };
};
