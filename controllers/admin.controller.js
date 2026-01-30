const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Lead = require('../models/leads.model');
const Client = require('../models/clients.model');
const Quotation = require('../models/quatation.model');
const helpers = require('../utils/helper');


const adminController = {};

  //Admin login
adminController.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.error(400, false, 'Email and password required');
    }
    const normalizedEmail = String(email).trim().toLowerCase();
    const valid = normalizedEmail === 'vedara@gmail.com' && String(password) === 'Vendor123';
    if (!valid) {
      return res.error(401, false, 'Invalid credentials');
    }
    const [admin] = await User.findOrCreate({
      where: { email: 'vedara@gmail.com' },
      defaults: {
        username: 'Admin',
        email: 'vedara@gmail.com',
        password: helpers.hash('Vendor123'),
        mobile: '9999999999',
        role: 'admin'
      }
    });
    const payload = { id: admin.id, email: admin.email, role: 'admin' };
    const token = jwt.sign(payload, process.env.APP_SUPER_SECRET_KEY, { expiresIn: '30d' });
    return res.success(200, true, 'Login successful', { token, user: payload });
  } catch (err) {
    return res.error(500, false, 'Login failed', err.message);
  }
};

  //for admin only ---create an user
adminController.createUser = async (req, res) => {
  try {
    const { username, email, mobile, password, role } = req.body;
    if (!username || !email || !mobile || !role) {
      return res.error(400, false, 'Missing required fields');
    }
    const normalizedRole = String(role).trim().toLowerCase();
    const roleMap = { designer: 'designer', sales: 'leadManager',  };
    const chosenRole = roleMap[normalizedRole];
    if (!chosenRole) {
      return res.error(400, false, 'Invalid role');
    }
    const rawPassword = password && String(password).trim().length > 0 ? String(password) : helpers.createRandomString(8);
    const hashed = helpers.hash(rawPassword);
    if (!hashed) {
      return res.error(500, false, 'Password hashing failed');
    }
    const user = await User.create({
      username: String(username).trim(),
      email: String(email).trim().toLowerCase(),
      mobile: String(mobile).trim(),
      password: hashed,
      role: chosenRole
    });
    return res.success(201, true, 'User created', {
      id: user.id,
      username: user.username,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      generatedPassword: password ? undefined : rawPassword
    });
  } catch (err) {
    if (err && err.name === 'SequelizeUniqueConstraintError') {
      return res.error(409, false, 'Email or mobile already exists');
    }
    return res.error(500, false, 'User creation failed', err.message);
  }
};
//for admin and leadManager to create an Lead
adminController.addLead = async (req, res) => {
  try {
    const { name, phone, email, source, status, assigned_to, budgetRange, propertyType, city, notes } = req.body;
    if (!name || (!phone && !email)) {
      return res.error(400, false, 'Missing required fields');
    }
    let assignedTo = assigned_to ? Number(assigned_to) : undefined;
    if (!assignedTo && req.user && req.user.id) {
      assignedTo = req.user.id;
    }
    const allowedStatuses = ['new','contacted','converted','discarded'];
    const normalizedStatus = status ? String(status).trim().toLowerCase() : 'new';
    const finalStatus = allowedStatuses.includes(normalizedStatus) ? normalizedStatus : 'new';
    const lead = await Lead.create({
      name: String(name).trim(),
      phone: phone ? String(phone).trim() : null,
      email: email ? String(email).trim().toLowerCase() : null,
      source: source ? String(source).trim() : null,
      status: finalStatus,
      budget_range: budgetRange ? String(budgetRange).trim() : null,
      property_type: propertyType ? String(propertyType).trim() : null,
      city: city ? String(city).trim() : null,
      notes: notes ? String(notes).trim() : null,
      assigned_to: assignedTo || null
    });
    return res.success(201, true, 'Lead created', {
      id: lead.id,
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      source: lead.source,
      status: lead.status,
      budget_range: lead.budget_range,
      property_type: lead.property_type,
      city: lead.city,
      notes: lead.notes,
      assigned_to: lead.assigned_to
    });
  } catch (err) {
    return res.error(500, false, 'Lead creation failed', err.message);
  }
};
//get all Leads................................................
adminController.getLeads = async (req, res) => {
  try {
    const { status, assigned_to } = req.query;
    const allowedStatuses = ['new','contacted','converted','discarded'];
    const where = {};
    if (status && allowedStatuses.includes(String(status).trim().toLowerCase())) {
      where.status = String(status).trim().toLowerCase();
    }
    if (assigned_to) {
      where.assigned_to = Number(assigned_to);
    }
    const leads = await Lead.findAll({ where, order: [['createdAt', 'DESC']] });
    return res.success(200, true, 'Leads fetched', { items: leads });
  } catch (err) {
    return res.error(500, false, 'Failed to fetch leads', err.message);
  }
};
//for admin and leadManager to convert an Lead to Client
adminController.convertLeadToClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, email, address } = req.body;
    if (!id) {
      return res.error(400, false, 'Lead id required');
    }
    const lead = await Lead.findByPk(Number(id));
    if (!lead) {
      return res.error(404, false, 'Lead not found');
    }

    const client = await Client.create({
      name: name ? String(name).trim() : lead.name,
      phone: phone ? String(phone).trim() : lead.phone,
      email: email ? String(email).trim().toLowerCase() : lead.email,
      address: address ? String(address).trim() : null
    });

    if (lead.status !== 'converted') {
      lead.status = 'converted';
      await lead.save();
    }

    return res.success(201, true, 'Lead converted to client', {
      client: { id: client.id, name: client.name, phone: client.phone, email: client.email, address: client.address },
      lead: { id: lead.id, status: lead.status }
    });
  } catch (err) {
    return res.error(500, false, 'Conversion failed', err.message);
  }
};

adminController.createQuotation = async (req, res) => {
  try {
    const { clientId, projectId, baseAmount, validUntil, discountPercent, notes } = req.body;
    if (!clientId || !baseAmount) {
      return res.error(400, false, 'clientId and baseAmount are required');
    }
    const client_id = Number(clientId);
    const project_id = projectId ? Number(projectId) : null;
    const base_amount = Number(baseAmount);
    const discount_percent = discountPercent ? Number(discountPercent) : 0;
    if (!Number.isFinite(base_amount) || base_amount <= 0) {
      return res.error(400, false, 'baseAmount must be a positive number');
    }
    if (!Number.isFinite(discount_percent) || discount_percent < 0 || discount_percent > 100) {
      return res.error(400, false, 'discountPercent must be between 0 and 100');
    }
    const final_amount = Number((base_amount * (1 - discount_percent / 100)).toFixed(2));

    let valid_until = null;
    if (validUntil) {
      const s = String(validUntil).trim();
      const parts = s.split('-');
      if (parts.length === 3) {
        const [dd, mm, yyyy] = parts;
        valid_until = new Date(`${yyyy}-${mm}-${dd}`);
      } else {
        const d = new Date(s);
        if (!isNaN(d.getTime())) valid_until = d; else valid_until = null;
      }
    }

    const quotation = await Quotation.create({
      client_id,
      project_id,
      base_amount,
      discount_percent,
      final_amount,
      valid_until,
      notes: notes ? String(notes).trim() : null,
      status: 'sent'
    });

    return res.success(201, true, 'Quotation created', {
      id: quotation.id,
      client_id: quotation.client_id,
      project_id: quotation.project_id,
      base_amount: quotation.base_amount,
      discount_percent: quotation.discount_percent,
      final_amount: quotation.final_amount,
      valid_until: quotation.valid_until,
      notes: quotation.notes,
      status: quotation.status
    });
  } catch (err) {
    return res.error(500, false, 'Quotation creation failed', err.message);
  }
};

module.exports = adminController;