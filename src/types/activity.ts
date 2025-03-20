export interface Activity {
  id?: string;
  userId: string;
  title: string;
  category: string;
  date: string;
  startTime: string;
  endTime: string;
  details: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}
