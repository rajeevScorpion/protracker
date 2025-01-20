import { 
  collection, 
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';

export const activityService = {
  async getActivities(userId: string, filters = {}) {
    try {
      const activitiesRef = collection(db, `users/${userId}/activities`);
      const q = query(activitiesRef, orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
        startTime: doc.data().startTime.toDate(),
        endTime: doc.data().endTime.toDate()
      }));
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw new Error('Failed to fetch activities');
    }
  },

  async createActivity(userId: string, formData: any, imageFiles: File[]) {
    try {
      // Upload images first
      const imageUrls = await Promise.all(
        imageFiles.map(async (file) => {
          const storageRef = ref(storage, `users/${userId}/activities/${Date.now()}_${file.name}`);
          const snapshot = await uploadBytes(storageRef, file);
          return getDownloadURL(snapshot.ref);
        })
      );

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
      const docRef = await addDoc(activitiesRef, activityData);
      return { id: docRef.id, ...activityData };
    } catch (error) {
      console.error('Error creating activity:', error);
      throw error;
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
