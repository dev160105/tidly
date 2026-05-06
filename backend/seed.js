const mongoose = require('mongoose');
require('dotenv').config();

const Member = require('./models/Member');
const Task = require('./models/Task');
const Group = require('./models/Group');
const Activity = require('./models/Activity');
const bcrypt = require('bcryptjs');

const today = new Date();
const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
const inTwoDays = new Date(today); inTwoDays.setDate(today.getDate() + 2);
const inFourDays = new Date(today); inFourDays.setDate(today.getDate() + 4);
const fmt = (d) => d.toISOString();

const members = [
  { id: 'user-1', name: 'Dev Dalsania', email: 'dalsaniadev16@gmail.com', initials: 'DD', color: '#7C6AF5', score: 82, tasksCompleted: 12, tasksAssigned: 3, isCurrentUser: true },
  { id: 'user-2', name: 'Yash Vadaria', email: 'yashv@gmail.com', initials: 'YV', color: '#3ECFA0', score: 78, tasksCompleted: 10, tasksAssigned: 2 },
  { id: 'user-3', name: 'Swayam Patel', email: 'swayamp2005@gmail.com', initials: 'SP', color: '#F5874A', score: 61, tasksCompleted: 7, tasksAssigned: 3 },
  { id: 'user-4', name: 'Raj Patel', email: 'rajp@gmail.com', initials: 'RP', color: '#F5C84A', score: 44, tasksCompleted: 5, tasksAssigned: 2 }
];

const group = {
  id: 'group-1', name: '525 Wellington St', address: '525 Wellington St, Montreal, QC', memberIds: ['user-1', 'user-2', 'user-3', 'user-4'], createdAt: '2026-01-01T00:00:00.000Z', weekNumber: 18
};

const tasks = [
  { id: 'task-1', title: 'Take out trash', icon: 'trash-2', assigneeId: 'user-1', dueDate: fmt(today), dueTime: '20:00', status: 'pending', priority: 'high', repeat: 'weekly', category: 'outdoor', points: 5, createdBy: 'user-2', groupId: 'group-1' },
  { id: 'task-2', title: 'Vacuum living room', icon: 'wind', assigneeId: 'user-1', dueDate: fmt(today), status: 'pending', priority: 'medium', repeat: 'weekly', category: 'living', points: 8, createdBy: 'user-1', groupId: 'group-1' },
  { id: 'task-3', title: 'Wash dishes', icon: 'droplets', assigneeIds: ['user-2', 'user-3'], assigneeId: 'user-2', dueDate: fmt(yesterday), status: 'overdue', priority: 'high', repeat: 'daily', category: 'kitchen', points: 4, createdBy: 'user-1', groupId: 'group-1' },
  { id: 'task-4', title: 'Grocery run', icon: 'shopping-cart', assigneeId: 'user-2', dueDate: fmt(tomorrow), status: 'done', priority: 'medium', repeat: 'weekly', category: 'shopping', points: 10, completedAt: fmt(today), createdBy: 'user-2', groupId: 'group-1' },
  { id: 'task-5', title: 'Clean windows', icon: 'square', assigneeId: 'user-3', dueDate: fmt(inTwoDays), status: 'pending', priority: 'low', repeat: 'monthly', category: 'living', points: 12, createdBy: 'user-3', groupId: 'group-1' },
  { id: 'task-6', title: 'Scrub bathroom', icon: 'shower-head', assigneeId: 'user-1', dueDate: fmt(inFourDays), status: 'pending', priority: 'medium', repeat: 'weekly', category: 'bathroom', points: 15, createdBy: 'user-1', groupId: 'group-1' },
  { id: 'task-7', title: 'Do laundry', icon: 'shirt', assigneeId: 'user-4', dueDate: fmt(tomorrow), status: 'pending', priority: 'medium', repeat: 'weekly', category: 'laundry', points: 8, createdBy: 'user-4', groupId: 'group-1' },
  { id: 'task-8', title: 'Mop floors', icon: 'layout', assigneeId: 'user-4', dueDate: fmt(yesterday), status: 'overdue', priority: 'medium', repeat: 'biweekly', category: 'living', points: 10, createdBy: 'user-1', groupId: 'group-1' }
];

const activities = [
  { id: 'act-1', type: 'completed', memberId: 'user-2', taskTitle: 'Grocery run', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), groupId: 'group-1' },
  { id: 'act-2', type: 'added', memberId: 'user-3', taskTitle: 'Clean windows', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), groupId: 'group-1' },
  { id: 'act-3', type: 'missed', memberId: 'user-4', taskTitle: 'Mop floors', timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(), groupId: 'group-1' },
  { id: 'act-4', type: 'completed', memberId: 'user-1', taskTitle: 'Clean kitchen counters', timestamp: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(), groupId: 'group-1' },
  { id: 'act-5', type: 'completed', memberId: 'user-3', taskTitle: 'Empty dishwasher', timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), groupId: 'group-1' }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB...');

    await Member.deleteMany({});
    await Task.deleteMany({});
    await Group.deleteMany({});
    await Activity.deleteMany({});
    console.log('Cleared existing data...');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    const membersWithPassword = members.map(m => ({ ...m, password: hashedPassword }));

    await Member.insertMany(membersWithPassword);
    await Task.insertMany(tasks);
    await Group.create(group);
    await Activity.insertMany(activities);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
