import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Task, Member, Group, ActivityItem } from '../types';
import { MOCK_TASKS, MOCK_MEMBERS, MOCK_GROUP, MOCK_ACTIVITY } from '../constants/mockData';

interface AppContextType {
  tasks: Task[];
  members: Member[];
  group: Group;
  activity: ActivityItem[];
  currentUser: Member;
  completeTask: (taskId: string) => void;
  addTask: (task: Task) => void;
  notificationSettings: {
    morningDigest: boolean;
    oneHourWarning: boolean;
    overdueReminder: boolean;
  };
  toggleNotification: (key: 'morningDigest' | 'oneHourWarning' | 'overdueReminder') => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [members] = useState<Member[]>(MOCK_MEMBERS);
  const [activity, setActivity] = useState<ActivityItem[]>(MOCK_ACTIVITY);
  const [notificationSettings, setNotificationSettings] = useState({
    morningDigest: true,
    oneHourWarning: true,
    overdueReminder: false,
  });

  const currentUser = members.find(m => m.isCurrentUser)!;

  const completeTask = (taskId: string) => {
    setTasks(prev => prev.map(t =>
      t.id === taskId
        ? { ...t, status: 'done' as const, completedAt: new Date().toISOString() }
        : t
    ));
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const newActivity: ActivityItem = {
        id: `act-${Date.now()}`,
        type: 'completed',
        memberId: currentUser.id,
        taskTitle: task.title,
        timestamp: new Date().toISOString(),
        groupId: task.groupId,
      };
      setActivity(prev => [newActivity, ...prev]);
    }
  };

  const addTask = (task: Task) => {
    setTasks(prev => [task, ...prev]);
    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      type: 'added',
      memberId: currentUser.id,
      taskTitle: task.title,
      timestamp: new Date().toISOString(),
      groupId: task.groupId,
    };
    setActivity(prev => [newActivity, ...prev]);
  };

  const toggleNotification = (key: 'morningDigest' | 'oneHourWarning' | 'overdueReminder') => {
    setNotificationSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <AppContext.Provider value={{
      tasks, members, group: MOCK_GROUP, activity, currentUser,
      completeTask, addTask, notificationSettings, toggleNotification,
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
