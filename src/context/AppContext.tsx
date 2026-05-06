import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, Member, Group, ActivityItem } from '../types';
import { MOCK_GROUP } from '../constants/mockData';

interface AppContextType {
  tasks: Task[];
  members: Member[];
  group: Group;
  activity: ActivityItem[];
  currentUser: Member | null;
  completeTask: (taskId: string) => void;
  addTask: (task: Task) => void;
  notificationSettings: {
    morningDigest: boolean;
    oneHourWarning: boolean;
    overdueReminder: boolean;
  };
  toggleNotification: (key: 'morningDigest' | 'oneHourWarning' | 'overdueReminder') => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

const API_URL = 'http://127.0.0.1:5000/api';

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [notificationSettings, setNotificationSettings] = useState({
    morningDigest: true,
    oneHourWarning: true,
    overdueReminder: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, membersRes, activityRes] = await Promise.all([
          fetch(`${API_URL}/tasks`),
          fetch(`${API_URL}/members`),
          fetch(`${API_URL}/activity`)
        ]);

        const tasksData = await tasksRes.json();
        const membersData = await membersRes.json();
        const activityData = await activityRes.json();

        setTasks(tasksData);
        setMembers(membersData);
        setActivity(activityData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const currentUser = members.length > 0 ? members.find(m => m.isCurrentUser) || members[0] : null;

  const completeTask = async (taskId: string) => {
    // Optimistic update
    setTasks(prev => prev.map(t =>
      t.id === taskId
        ? { ...t, status: 'done' as const, completedAt: new Date().toISOString() }
        : t
    ));

    try {
      const res = await fetch(`${API_URL}/tasks/${taskId}/complete`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId: currentUser?.id })
      });
      if (!res.ok) throw new Error('Failed to complete task');

      // Refresh activity feed after completing
      const activityRes = await fetch(`${API_URL}/activity`);
      setActivity(await activityRes.json());
    } catch (error) {
      console.error(error);
    }
  };

  const addTask = async (task: Task) => {
    // Optimistic update
    setTasks(prev => [task, ...prev]);

    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
      });
      if (!res.ok) throw new Error('Failed to add task');

      // Refresh activity feed after adding
      const activityRes = await fetch(`${API_URL}/activity`);
      setActivity(await activityRes.json());
    } catch (error) {
      console.error(error);
    }
  };

  const toggleNotification = (key: 'morningDigest' | 'oneHourWarning' | 'overdueReminder') => {
    setNotificationSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <AppContext.Provider value={{
      tasks, members, group: MOCK_GROUP, activity, currentUser,
      completeTask, addTask, notificationSettings, toggleNotification, isLoading
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
};
