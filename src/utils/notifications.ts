import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { Task } from '../types';
import { formatTime } from './helpers';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const registerForPushNotificationsAsync = async (): Promise<string | null> => {
  if (!Device.isDevice) return null;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    });
    await Notifications.setNotificationChannelAsync('silent', {
      name: 'silent',
      importance: Notifications.AndroidImportance.LOW,
      sound: null,
    });
  }

  return (await Notifications.getExpoPushTokenAsync()).data;
};

export const scheduleMorningDigest = async (tasks: Task[]) => {
  await Notifications.cancelScheduledNotificationAsync('morning-digest').catch(() => {});

  const todayTasks = tasks.filter(t => {
    if (t.status === 'done') return false;
    const due = new Date(t.dueDate);
    const now = new Date();
    return (
      due.getFullYear() === now.getFullYear() &&
      due.getMonth() === now.getMonth() &&
      due.getDate() === now.getDate()
    );
  });

  if (todayTasks.length === 0) return;

  const trigger = new Date();
  trigger.setHours(8, 0, 0, 0);
  if (trigger <= new Date()) trigger.setDate(trigger.getDate() + 1);

  await Notifications.scheduleNotificationAsync({
    identifier: 'morning-digest',
    content: {
      title: `☀️ Good morning! ${todayTasks.length} task${todayTasks.length > 1 ? 's' : ''} today`,
      body: todayTasks.map(t => t.title).join(', '),
      sound: false, // silent
      priority: Notifications.AndroidNotificationPriority.LOW,
    },
    trigger,
  });
};

export const scheduleTaskReminder = async (task: Task) => {
  if (!task.dueTime || task.status === 'done') return;

  const due = new Date(task.dueDate);
  const [h, m] = task.dueTime.split(':').map(Number);
  due.setHours(h, m, 0, 0);

  // 1 hour before
  const oneHourBefore = new Date(due.getTime() - 60 * 60 * 1000);
  if (oneHourBefore > new Date()) {
    await Notifications.scheduleNotificationAsync({
      identifier: `task-1h-${task.id}`,
      content: {
        title: `⏰ "${task.title}" due in 1 hour`,
        body: `Due at ${formatTime(task.dueTime)} — don't forget!`,
        sound: true,
      },
      trigger: oneHourBefore,
    });
  }

  // 2 hours before (secondary warning)
  const twoHoursBefore = new Date(due.getTime() - 2 * 60 * 60 * 1000);
  if (twoHoursBefore > new Date()) {
    await Notifications.scheduleNotificationAsync({
      identifier: `task-2h-${task.id}`,
      content: {
        title: `📋 Heads up: "${task.title}" in 2 hours`,
        body: `Assigned to you · due at ${formatTime(task.dueTime)}`,
        sound: false,
        priority: Notifications.AndroidNotificationPriority.LOW,
      },
      trigger: twoHoursBefore,
    });
  }
};

export const cancelTaskReminders = async (taskId: string) => {
  await Notifications.cancelScheduledNotificationAsync(`task-1h-${taskId}`).catch(() => {});
  await Notifications.cancelScheduledNotificationAsync(`task-2h-${taskId}`).catch(() => {});
};
