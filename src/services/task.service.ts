import { 
  collection, 
  addDoc,
  query,
  orderBy,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  getFirestore, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import app from '../lib/firebase';

const db = getFirestore(app);

export const taskService = {
  async createTask(userId: string, taskData: {
    title: string;
    category: string;
    dueDate: string;
    priority: 'low' | 'medium' | 'high';
  }) {
    try {
      const tasksRef = collection(db, `users/${userId}/tasks`);
      const task = {
        title: taskData.title,
        category: taskData.category,
        dueDate: Timestamp.fromDate(new Date(taskData.dueDate)),
        priority: taskData.priority,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(tasksRef, task);
      console.log('Task created:', docRef.id);
      
      return {
        id: docRef.id,
        title: taskData.title,
        category: taskData.category,
        dueDate: taskData.dueDate,
        priority: taskData.priority,
        status: 'pending' as const
      };
    } catch (error) {
      console.error('Error creating task:', error);
      throw new Error('Failed to create task');
    }
  },

  async getTasks(userId: string) {
    try {
      console.log('Fetching tasks for user:', userId);
      const tasksRef = collection(db, `users/${userId}/tasks`);
      const q = query(tasksRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const tasks = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          category: data.category,
          dueDate: data.dueDate instanceof Timestamp 
            ? data.dueDate.toDate().toISOString().split('T')[0]
            : data.dueDate,
          status: data.status,
          priority: data.priority
        };
      });

      console.log('Fetched tasks:', tasks);
      return tasks;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw new Error('Failed to fetch tasks');
    }
  },

  async updateTaskStatus(userId: string, taskId: string, status: 'pending' | 'completed') {
    try {
      const taskRef = doc(db, `users/${userId}/tasks/${taskId}`);
      await updateDoc(taskRef, {
        status,
        updatedAt: serverTimestamp()
      });
      console.log('Task status updated:', taskId, status);
    } catch (error) {
      console.error('Error updating task status:', error);
      throw new Error('Failed to update task status');
    }
  },

  async deleteTask(userId: string, taskId: string) {
    try {
      const taskRef = doc(db, `users/${userId}/tasks/${taskId}`);
      await deleteDoc(taskRef);
      console.log('Task deleted:', taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw new Error('Failed to delete task');
    }
  }
};
