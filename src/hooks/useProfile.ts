import { useState, useEffect } from 'react';
import { useAuthState } from './useAuthState';
import { settingsService } from '../services/settings.service';

interface UserProfile {
  name: string;
  designation: string;
  company: string;
  mobile: string;
  email: string;
}

export const useProfile = () => {
  const { user } = useAuthState();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      let userProfile = await settingsService.getUserProfile(user.uid);
      
      if (!userProfile) {
        userProfile = await settingsService.initializeUserProfile(user.uid, user.email || '');
      }
      
      setProfile(userProfile as UserProfile);
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      await settingsService.updateUserProfile(user.uid, {
        name: data.name || profile?.name || '',
        designation: data.designation || profile?.designation || '',
        company: data.company || profile?.company || '',
        mobile: data.mobile || profile?.mobile || ''
      });
      
      setProfile(prev => prev ? { ...prev, ...data } : null);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    refresh: loadProfile
  };
};
