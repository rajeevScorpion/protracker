import { 
  collection, 
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  deleteDoc,
  doc,
  getFirestore, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { storageService } from './storage.service';
import app from '../lib/firebase';

const db = getFirestore(app);

export const activityService = {
  // ... createActivity method remains the same ...

  async getActivities(userId: string, filters: {
    search?: string;
    category?: string;
    dateRange?: { start: Date | null; end: Date | null };
    limit?: number;
  }) {
    try {
      const activitiesRef = collection(db, `users/${userId}/activities`);
      let q = query(activitiesRef, orderBy('date', 'desc'));

      if (filters.category) {
        q = query(q, where('category', '==', filters.category));
      }

      if (filters.limit) {
        q = query(q, limit(filters.limit));
      }

      const snapshot = await getDocs(q);
      let activities = snapshot.docs.map(doc => {
        const data = doc.data();
        const images = Array.isArray(data.images) ? data.images : [];
        
        // Convert Firestore Timestamps to JavaScript Dates
        const startTime = data.startTime.toDate();
        const endTime = data.endTime.toDate();
        const date = data.date.toDate();
        
        return {
          id: doc.id,
          ...data,
          images,
          startTime,
          endTime,
          date,
          duration: Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60))
        };
      });

      if (filters.search) {
        const searchLower = filters.search.toLowerCase().trim();
        activities = activities.filter(activity => 
          activity.title.toLowerCase().includes(searchLower) ||
          (activity.details && activity.details.toLowerCase().includes(searchLower))
        );
      }

      return activities;
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw new Error('Failed to fetch activities');
    }
  },

  // ... deleteActivity method remains the same ...
};
