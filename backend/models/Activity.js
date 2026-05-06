const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  type: { type: String, enum: ['completed', 'added', 'missed', 'settled'], required: true },
  memberId: { type: String, required: true },
  taskTitle: { type: String, required: true },
  timestamp: { type: String, required: true },
  groupId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);
