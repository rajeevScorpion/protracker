import { useState, useEffect, useCallback } from 'react';
import { useAuthState } from './useAuthState';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
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

  const updateCategory = async (id: string, name: string) => {
    if (!user || !name.trim()) return;
    
    try {
      const categoryRef = doc(db, 'categories', id);
      await updateDoc(categoryRef, {
        name: name.trim(),
        updatedAt: new Date()
      });
      
      setCategories(prev => 
        prev.map(cat => 
          cat.id === id ? { ...cat, name: name.trim() } : cat
        )
      );
    } catch (err) {
      console.error('Error updating category:', err);
      throw err;
    }
  };

  const deleteCategory = async (id: string) => {
    if (!user) return;
    
    try {
      const categoryRef = doc(db, 'categories', id);
      await deleteDoc(categoryRef);
      
      setCategories(prev => prev.filter(cat => cat.id !== id));
    } catch (err) {
      console.error('Error deleting category:', err);
      throw err;
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
