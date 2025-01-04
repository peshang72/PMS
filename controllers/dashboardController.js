const Patient = require("../models/patient");
const { calculateAge, getGender } = require("../utils/patientUtils");

const dashboardGet = async (req, res) => {
  const patients = await Patient.find();
  res.render("dashboard", { patients });
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
    const enrichedPatients = patients.map((patient) => ({
      ...patient.toObject(),
      age: calculateAge(patient.dateOfBirth),
      gender: getGender(patient.isMale),
    }));
    res.render("patients", { patients: enrichedPatients });
  } catch (error) {
    res.status(500).send("Error fetching patients");
  }
};

const getPatientProfile = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    const enrichedPatient = {
      ...patient.toObject(),
      age: calculateAge(patient.dateOfBirth),
      gender: getGender(patient.isMale),
    };
    res.render("profile", { patient: enrichedPatient });
  } catch (error) {
    res.status(500).send("Error fetching patient profile");
  }
};

module.exports = {
  dashboardGet,
  registrationGet,
  registrationPost,
  getPatients,
  getPatientProfile,
};
