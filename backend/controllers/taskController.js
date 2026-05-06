const Task = require('../models/Task');
const Activity = require('../models/Activity');

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({}).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();

    // Create activity log
    const activity = new Activity({
      id: `act-${Date.now()}`,
      type: 'added',
      memberId: req.body.createdBy,
      taskTitle: req.body.title,
      timestamp: new Date().toISOString(),
      groupId: req.body.groupId
    });
    await activity.save();

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.completeTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { memberId } = req.body;

    const task = await Task.findOneAndUpdate(
      { id: id },
      { status: 'done', completedAt: new Date().toISOString() },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Create activity log
    const activity = new Activity({
      id: `act-${Date.now()}`,
      type: 'completed',
      memberId: memberId || task.assigneeId || 'unknown',
      taskTitle: task.title,
      timestamp: new Date().toISOString(),
      groupId: task.groupId
    });
    await activity.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
