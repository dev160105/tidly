import { Task, Member } from '../types';

export const getTaskStatusLabel = (task: Task): 'overdue' | 'today' | 'soon' | 'done' | 'upcoming' => {
  if (task.status === 'done') return 'done';
  const due = new Date(task.dueDate);
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueStart = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const diff = dueStart.getTime() - todayStart.getTime();
  const daysDiff = diff / (1000 * 60 * 60 * 24);
  if (daysDiff < 0) return 'overdue';
  if (daysDiff === 0) return 'today';
  if (daysDiff <= 2) return 'soon';
  return 'upcoming';
};

export const formatDueLabel = (task: Task): string => {
  const due = new Date(task.dueDate);
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueStart = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const diff = dueStart.getTime() - todayStart.getTime();
  const daysDiff = diff / (1000 * 60 * 60 * 24);

  if (daysDiff < -1) return `${Math.abs(Math.round(daysDiff))} days ago`;
  if (daysDiff === -1) return 'Yesterday';
  if (daysDiff === 0) return task.dueTime ? `by ${formatTime(task.dueTime)}` : 'Today';
  if (daysDiff === 1) return 'Tomorrow';
  return due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const formatTime = (time: string): string => {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
};

export const formatRelativeTime = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
};

export const getMemberById = (members: Member[], id: string): Member | undefined =>
  members.find(m => m.id === id);

export const getLeaderboard = (members: Member[]): Member[] =>
  [...members].sort((a, b) => b.score - a.score);

export const getTodayTasks = (tasks: Task[], userId?: string): Task[] => {
  return tasks.filter(t => {
    if (userId && t.assigneeId !== userId) return false;
    const label = getTaskStatusLabel(t);
    return label === 'today' || label === 'overdue';
  });
};

export const getCategoryColor = (category: string, theme: any): string => {
  const map: Record<string, string> = {
    kitchen: theme.orange,
    bathroom: theme.blue,
    living: theme.accent,
    outdoor: theme.green,
    laundry: theme.yellow,
    shopping: theme.green,
    other: theme.textSecondary,
  };
  return map[category] || theme.textSecondary;
};

export const getCategoryBg = (category: string, theme: any): string => {
  const map: Record<string, string> = {
    kitchen: theme.orangeLight,
    bathroom: theme.blueLight,
    living: theme.accentLight,
    outdoor: theme.greenLight,
    laundry: theme.yellowLight,
    shopping: theme.greenLight,
    other: theme.surface2,
  };
  return map[category] || theme.surface2;
};
