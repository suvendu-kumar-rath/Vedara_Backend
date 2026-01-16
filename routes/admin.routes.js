

const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");
const { checkRole, checkUserAuth } = require('../middlewares/auth.middleware');

router.post("/login", adminController.login);
router.post("/users", checkUserAuth, checkRole('admin'), adminController.createUser);

module.exports = router;