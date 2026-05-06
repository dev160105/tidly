const Member = require('../models/Member');

exports.getMembers = async (req, res) => {
  try {
    const members = await Member.find({});
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
