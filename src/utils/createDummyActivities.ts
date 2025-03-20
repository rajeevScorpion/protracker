import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { subDays, subMonths, setHours, setMinutes } from 'date-fns';

const categories = [
  'Development',
  'Design',
  'Research',
  'Documentation',
  'Client Call'
];

const activities = [
  {
    title: "API Integration Workshop",
    category: "Development",
    details: "Implemented REST API endpoints and documentation",
    date: subMonths(new Date(), 11), // 11 months ago
    duration: 180 // 3 hours
  },
  {
    title: "UI Design Review",
    category: "Design",
    details: "Review and update design system components",
    date: subMonths(new Date(), 9), // 9 months ago
    duration: 120 // 2 hours
  },
  {
    title: "Market Research Analysis",
    category: "Research",
    details: "Competitor analysis and market trends",
    date: subMonths(new Date(), 8), // 8 months ago
    duration: 240 // 4 hours
  },
  {
    title: "Technical Documentation",
    category: "Documentation",
    details: "System architecture documentation",
    date: subMonths(new Date(), 7), // 7 months ago
    duration: 150 // 2.5 hours
  },
  {
    title: "Project Planning Meeting",
    category: "Client Call",
    details: "Q2 project planning and roadmap discussion",
    date: subMonths(new Date(), 6), // 6 months ago
    duration: 90 // 1.5 hours
  },
  {
    title: "Code Review Session",
    category: "Development",
    details: "Team code review and best practices discussion",
    date: subMonths(new Date(), 5), // 5 months ago
    duration: 120 // 2 hours
  },
  {
    title: "UX Research",
    category: "Research",
    details: "User interviews and feedback analysis",
    date: subMonths(new Date(), 4), // 4 months ago
    duration: 180 // 3 hours
  },
  {
    title: "API Documentation Update",
    category: "Documentation",
    details: "Updated API documentation with new endpoints",
    date: subMonths(new Date(), 3), // 3 months ago
    duration: 120 // 2 hours
  },
  {
    title: "Client Requirements Discussion",
    category: "Client Call",
    details: "Requirement gathering and project scope",
    date: subMonths(new Date(), 2), // 2 months ago
    duration: 60 // 1 hour
  },
  {
    title: "Frontend Development",
    category: "Development",
    details: "Implemented new dashboard features",
    date: subMonths(new Date(), 1), // 1 month ago
    duration: 300 // 5 hours
  },
  {
    title: "Design System Updates",
    category: "Design",
    details: "Updated component library",
    date: subDays(new Date(), 20), // 20 days ago
    duration: 240 // 4 hours
  },
  {
    title: "Performance Testing",
    category: "Development",
    details: "System performance optimization",
    date: subDays(new Date(), 14), // 14 days ago
    duration: 180 // 3 hours
  },
  {
    title: "Sprint Planning",
    category: "Client Call",
    details: "Next sprint planning and task allocation",
    date: subDays(new Date(), 7), // 7 days ago
    duration: 120 // 2 hours
  },
  {
    title: "Bug Fixes",
    category: "Development",
    details: "Fixed reported issues and testing",
    date: subDays(new Date(), 3), // 3 days ago
    duration: 240 // 4 hours
  },
  {
    title: "Release Documentation",
    category: "Documentation",
    details: "Prepared release notes and documentation",
    date: subDays(new Date(), 1), // Yesterday
    duration: 120 // 2 hours
  }
];

export const createDummyActivities = async (userId: string) => {
  try {
    const activitiesRef = collection(db, `users/${userId}/activities`);
    for (const activity of activities) {
      const date = activity.date;
      const startTime = setHours(setMinutes(date, 0), 10); // Start at 10:00
      const endTime = setHours(setMinutes(date, 0), 10 + (activity.duration / 60)); // Add duration

      const activityData = {
        title: activity.title,
        category: activity.category,
        details: activity.details,
        images: [],
        startTime: Timestamp.fromDate(startTime),
        endTime: Timestamp.fromDate(endTime),
        date: Timestamp.fromDate(date),
        duration: activity.duration,
        createdAt: Timestamp.fromDate(date),
        updatedAt: Timestamp.fromDate(date)
      };

      await addDoc(activitiesRef, activityData);
    }

    return true;
  } catch (error) {
    console.error('Error creating dummy activities:', error);
    throw new Error('Failed to create dummy activities');
  }
};
