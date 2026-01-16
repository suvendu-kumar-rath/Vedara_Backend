const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const helpers = require('../utils/helper');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.error(400, false, 'Email and password required');
    }
    const normalizedEmail = String(email).trim().toLowerCase();
    const valid =
      normalizedEmail === 'vedara@gmail.com' &&
      String(password) === 'Vedara123';
    if (!valid) {
      return res.error(401, false, 'Invalid credentials');
    }
    const payload = { id: 'admin', email: 'vedara@gmail.com', role: 'admin' };
    const token = jwt.sign(payload, process.env.APP_SUPER_SECRET_KEY, { expiresIn: '30d' });
    return res.success(200, true, 'Login successful', { token, user: payload });
  } catch (err) {
    return res.error(500, false, 'Login failed', err.message);
  }
};

exports.createUser = async (req, res) => {
  try {
    const { username, email, mobile, password, role } = req.body;
    if (!username || !email || !mobile || !role) {
      return res.error(400, false, 'Missing required fields');
    }

    const normalizedRole = String(role).trim().toLowerCase();
    const roleMap = { designer: 'designer', sales: 'sales', 'lead manager': 'sales' };
    const chosenRole = roleMap[normalizedRole];
    if (!chosenRole) {
      return res.error(400, false, 'Invalid role. Allowed: designer, sales');
    }

    const rawPassword = password && String(password).trim().length > 0
      ? String(password)
      : helpers.createRandomString(8);

    const hashed = helpers.hash(rawPassword);
    if (!hashed) {
      return res.error(500, false, 'Password hashing failed');
    }

    const user = await User.create({
      username: String(username).trim(),
      email: String(email).trim().toLowerCase(),
      mobile: String(mobile).trim(),
      password: hashed,
      role: chosenRole,
    });

    return res.success(201, true, 'User created', {
      id: user.id,
      username: user.username,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      generatedPassword: password ? undefined : rawPassword,
    });
  } catch (err) {
    if (err && err.name === 'SequelizeUniqueConstraintError') {
      return res.error(409, false, 'Email or mobile already exists');
    }
    return res.error(500, false, 'User creation failed', err.message);
  }
};