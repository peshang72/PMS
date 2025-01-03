const Patient = require("../models/patient");

const dashboardGet = (req, res) => {
  res.render("dashboard");
};

const registrationGet = (req, res) => {
  res.render("registration");
};

const registrationPost = async (req, res) => {
  const patientData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber,
    secondaryPhoneNumber: req.body.secondaryContact,
    dateOfBirth: req.body.dateOfBirth,
    isMale: req.body.gender === "male",
    bloodType: req.body.bloodType,
    address: req.body.address,
    // Add any other fields as necessary
  };

  const patient = new Patient(patientData);
  try {
    await patient.save();
    res.redirect("/");
  } catch (error) {
    console.error("Error saving patient:", error);
    res.status(500).send("Error saving patient");
  }
};

const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.render("patients", { patients });
  } catch (error) {
    res.status(500).send("Error fetching patients");
  }
};

module.exports = {
  dashboardGet,
  registrationGet,
  registrationPost,
  getPatients,
};
