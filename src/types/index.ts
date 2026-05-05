export type TaskStatus = 'pending' | 'done' | 'overdue';
export type TaskPriority = 'low' | 'medium' | 'high';
export type RepeatInterval = 'never' | 'daily' | 'weekly' | 'biweekly' | 'monthly';

export interface Member {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  initials: string;
  color: string;
  score: number;
  tasksCompleted: number;
  tasksAssigned: number;
  isCurrentUser?: boolean;
}

export interface Task {
  id: string;
  title: string;
  icon: string;
  assigneeId: string;
  assigneeIds?: string[];  // for shared tasks
  dueDate: string;  // ISO string
  dueTime?: string; // HH:MM
  status: TaskStatus;
  priority: TaskPriority;
  repeat: RepeatInterval;
  category: TaskCategory;
  points: number;
  completedAt?: string;
  createdBy: string;
  groupId: string;
}

export type TaskCategory =
  | 'kitchen'
  | 'bathroom'
  | 'living'
  | 'outdoor'
  | 'laundry'
  | 'shopping'
  | 'other';

export interface Group {
  id: string;
  name: string;
  address: string;
  memberIds: string[];
  createdAt: string;
  weekNumber: number;
}

export interface PresetTask {
  id: string;
  title: string;
  icon: string;
  category: TaskCategory;
  defaultPoints: number;
  defaultRepeat: RepeatInterval;
}

export interface ActivityItem {
  id: string;
  type: 'completed' | 'added' | 'missed' | 'settled';
  memberId: string;
  taskTitle: string;
  timestamp: string;
  groupId: string;
}

export interface NotificationSetting {
  morningDigest: boolean;       // silent, 8am
  oneHourWarning: boolean;      // alert
  overdueReminder: boolean;     // alert, every 2h
}

export type RootStackParamList = {
  Main: undefined;
  AddTask: undefined;
  TaskDetail: { taskId: string };
  MemberDetail: { memberId: string };
  Settings: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Tasks: undefined;
  Members: undefined;
  Alerts: undefined;
  Profile: undefined;
};
