import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { activityService } from '../services/activity.service';
import { auth } from '../lib/firebase';

export const useCreateActivity = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const createActivity = async (formData: {
    title: string;
    category: string;
    date: string;
    startTime: string;
    endTime: string;
    details: string;
  }, imageFiles: File[]) => {
    if (!auth.currentUser) {
      setError('User not authenticated');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await activityService.createActivity(
        auth.currentUser.uid,
        formData,
        imageFiles
      );
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create activity');
    } finally {
      setIsLoading(false);
    }
  };

  return { createActivity, isLoading, error };
};
