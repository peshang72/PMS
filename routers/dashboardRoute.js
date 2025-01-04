const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

router.get("/", dashboardController.dashboardGet);
router.get("/registration", dashboardController.registrationGet);
router.post("/registration", dashboardController.registrationPost);
router.get("/patients", dashboardController.getPatients);
router.get("/patients/:id", dashboardController.getPatientProfile);

module.exports = router;
