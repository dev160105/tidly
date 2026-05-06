const Member = require('../models/Member');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let member = await Member.findOne({ email });
    if (member) return res.status(400).json({ msg: 'User already exists' });

    member = new Member({
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      initials: name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
      color: '#7C6AF5' // Default color
    });

    const salt = await bcrypt.genSalt(10);
    member.password = await bcrypt.hash(password, salt);

    await member.save();

    const payload = { user: { id: member.id } };
    jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: member });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const member = await Member.findOne({ email });
    if (!member) return res.status(400).json({ msg: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, member.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

    const payload = { user: { id: member.id } };
    jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: member });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const member = await Member.findOne({ id: req.user.id }).select('-password');
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
