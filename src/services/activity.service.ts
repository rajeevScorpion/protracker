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
  async createActivity(userId: string, formData: any, imageFiles: File[]) {
    try {
      let imageUrls: string[] = [];
      if (imageFiles.length > 0) {
        imageUrls = await Promise.all(
          imageFiles.map(file => storageService.uploadActivityImage(userId, file))
        );
      }

      const startDateTime = new Date(formData.date);
      const [startHours, startMinutes] = formData.startTime.split(':');
      startDateTime.setHours(parseInt(startHours, 10), parseInt(startMinutes, 10));

      const endDateTime = new Date(formData.date);
      const [endHours, endMinutes] = formData.endTime.split(':');
      endDateTime.setHours(parseInt(endHours, 10), parseInt(endMinutes, 10));

      const activityData = {
        title: formData.title,
        category: formData.category,
        details: formData.details || '',
        images: imageUrls,
        startTime: Timestamp.fromDate(startDateTime),
        endTime: Timestamp.fromDate(endDateTime),
        date: Timestamp.fromDate(new Date(formData.date)),
        duration: Math.round((endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60)),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const activitiesRef = collection(db, `users/${userId}/activities`);
      await addDoc(activitiesRef, activityData);
    } catch (error) {
      console.error('Error creating activity:', error);
      throw new Error('Failed to create activity');
    }
  },

  async getActivities(userId: string, filters: {
    search?: string;
    category?: string;
    dateRange?: { start: Date | null; end: Date | null };
    limit?: number;
  } = {}) {
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
        return {
          id: doc.id,
          ...data,
          startTime: data.startTime.toDate(),
          endTime: data.endTime.toDate(),
          date: data.date.toDate(),
          duration: data.duration || 0,
          images: data.images || []
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

  async deleteActivity(userId: string, activityId: string) {
    try {
      const activityRef = doc(db, `users/${userId}/activities/${activityId}`);
      await deleteDoc(activityRef);
    } catch (error) {
      console.error('Error deleting activity:', error);
      throw new Error('Failed to delete activity');
    }
  }
};
