import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { activityService } from '../services/activity.service';
import { auth } from '../lib/firebase';

export const useCreateActivity = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const createActivity = async (formData: any, imageFiles: File[]) => {
    if (!auth.currentUser) {
      setError('User not authenticated');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      if (!formData.title || !formData.category || !formData.date || 
          !formData.startTime || !formData.endTime) {
        throw new Error('Please fill in all required fields');
      }

      await activityService.createActivity(
        auth.currentUser.uid,
        formData,
        imageFiles
      );

      navigate('/history');
    } catch (err) {
      console.error('Error creating activity:', err);
      setError(err instanceof Error ? err.message : 'Failed to create activity');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { createActivity, isLoading, error };
};
