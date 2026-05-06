const Activity = require('../models/Activity');

exports.getActivity = async (req, res) => {
  try {
    const activity = await Activity.find({}).sort({ createdAt: -1 });
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
