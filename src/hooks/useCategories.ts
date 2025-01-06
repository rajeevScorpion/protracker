import { useState, useEffect, useCallback } from 'react';
import { useAuthState } from './useAuthState';
import { settingsService } from '../services/settings.service';

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
      setCategories(fetchedCategories);
    } catch (err) {
      console.error('Error loading categories:', err);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, [user, type]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const addCategory = async (name: string) => {
    if (!user || !name.trim()) return;
    
    try {
      const newCategory = await settingsService.addCategory(user.uid, type, name.trim());
      setCategories(prev => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      console.error('Error adding category:', err);
      throw err;
    }
  };

  const updateCategory = async (id: string, name: string) => {
    if (!user || !name.trim()) return;
    
    try {
      await settingsService.updateCategory(user.uid, type, id, name.trim());
      setCategories(prev => 
        prev.map(cat => cat.id === id ? { ...cat, name: name.trim() } : cat)
      );
    } catch (err) {
      console.error('Error updating category:', err);
      throw err;
    }
  };

  const deleteCategory = async (id: string) => {
    if (!user) return;
    
    try {
      await settingsService.deleteCategory(user.uid, type, id);
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
