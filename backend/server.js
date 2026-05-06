const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const taskRoutes = require('./routes/tasks');
const memberRoutes = require('./routes/members');
const activityRoutes = require('./routes/activity');
const authRoutes = require('./routes/auth');
const auth = require('./middleware/authMiddleware');

app.use('/api/auth', authRoutes);
app.use('/api/tasks', auth, taskRoutes);
app.use('/api/members', auth, memberRoutes);
app.use('/api/activity', auth, activityRoutes);

// Database connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
