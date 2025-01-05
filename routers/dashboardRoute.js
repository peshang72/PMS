const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

router.get("/", dashboardController.dashboardGet);
router.get("/registration", dashboardController.registrationGet);
router.post("/registration", dashboardController.registrationPost);
router.get("/patients", dashboardController.getPatients);
router.get("/patients/:id", dashboardController.getPatientProfile);
router.get("/search", dashboardController.searchPatients);
router.get("/filter", dashboardController.filterGet);
router.post("/filter", dashboardController.filterPatients);
router.get("/patients/:id/edit", dashboardController.getEditPatientProfile);
router.post("/patients/:id/edit", dashboardController.postEditPatientProfile);
module.exports = router;
