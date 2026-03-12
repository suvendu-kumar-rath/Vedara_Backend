const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");
const { checkRole, checkUserAuth } = require('../middlewares/auth.middleware');

router.post("/loginforall", adminController.login);
router.post("/users", checkUserAuth, checkRole('admin'), adminController.createUser);
router.post("/leads", checkUserAuth, checkRole(['admin','lead']), adminController.addLead);
router.get("/leads", checkUserAuth, checkRole(['admin','lead']), adminController.getLeads);
router.post("/leads/:id/notes", checkUserAuth, checkRole(['admin','lead']), adminController.addLeadNote);
router.get("/leads/:id/notes", checkUserAuth, checkRole(['admin','lead']), adminController.getLeadNotes);

router.post("/leads/:id/convert", checkUserAuth, checkRole(['admin','lead']), adminController.convertLeadToClient);
router.post("/quotations", checkUserAuth, checkRole(['admin','lead']), adminController.createQuotation);
router.get("/quotations", checkUserAuth, checkRole(['admin','lead']), adminController.getQuotations);
router.get("/dashboard", checkUserAuth, checkRole(['admin','lead']), adminController.getDashboard);
router.get("/employees", checkUserAuth, checkRole('admin'), adminController.getEmployees);
router.put("/users/:id/role", checkUserAuth, checkRole('admin'), adminController.updateUserRole);
router.delete("/users/:id", checkUserAuth, checkRole('admin'), adminController.deleteUser);
router.get("/leads/convertedclient", checkUserAuth, checkRole(['admin','lead']), adminController.ConvertedClient);
router.delete("/clients/:id", checkUserAuth, checkRole('admin'), adminController.deleteClient);

module.exports = router;


