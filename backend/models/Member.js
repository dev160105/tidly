const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatar: { type: String },
  initials: { type: String, required: true },
  color: { type: String, required: true },
  score: { type: Number, default: 0 },
  tasksCompleted: { type: Number, default: 0 },
  tasksAssigned: { type: Number, default: 0 },
  isCurrentUser: { type: Boolean, default: false },
  password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);
