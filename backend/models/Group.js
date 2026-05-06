const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  address: { type: String },
  memberIds: [{ type: String }],
  createdAt: { type: String, required: true },
  weekNumber: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('Group', groupSchema);
