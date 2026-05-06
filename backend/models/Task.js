const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  icon: { type: String, required: true },
  assigneeId: { type: String },
  assigneeIds: [{ type: String }],
  dueDate: { type: String, required: true },
  dueTime: { type: String },
  status: { type: String, enum: ['pending', 'done', 'overdue'], default: 'pending' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  repeat: { type: String, enum: ['never', 'daily', 'weekly', 'biweekly', 'monthly'], default: 'never' },
  category: { type: String, enum: ['kitchen', 'bathroom', 'living', 'outdoor', 'laundry', 'shopping', 'other'], default: 'other' },
  points: { type: Number, default: 0 },
  completedAt: { type: String },
  createdBy: { type: String, required: true },
  groupId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
