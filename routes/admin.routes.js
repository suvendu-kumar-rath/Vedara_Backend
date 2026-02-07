const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");
const { checkRole, checkUserAuth } = require('../middlewares/auth.middleware');

router.post("/loginforall", adminController.login);
router.post("/users", checkUserAuth, checkRole('admin'), adminController.createUser);
router.post("/leads", checkUserAuth, checkRole(['admin','leadManager']), adminController.addLead);
router.get("/leads", checkUserAuth, checkRole(['admin','leadManager']), adminController.getLeads);

router.post("/leads/:id/convert", checkUserAuth, checkRole(['admin','leadManager']), adminController.convertLeadToClient);
router.post("/quotations", checkUserAuth, checkRole(['admin','leadManager']), adminController.createQuotation);
router.get("/quotations", checkUserAuth, checkRole(['admin','leadManager']), adminController.getQuotations);
router.get("/employees", checkUserAuth, checkRole('admin'), adminController.getEmployees);

module.exports = router;


