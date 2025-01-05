const moment = require("moment");
const Patient = require("../models/patient");
const Appointment = require("../models/appointment");
const Medication = require("../models/medication");
const MedicalCondition = require("../models/medicalCondition");
const {
  calculateAge,
  getGender,
  getFullName,
} = require("../utils/patientUtils");

const dashboardGet = async (req, res) => {
  try {
    const patients = await Patient.find();
    const totalAge = patients.reduce((sum, patient) => {
      return sum + calculateAge(patient.dateOfBirth);
    }, 0);
    const averageAge = patients.length
      ? Math.round(totalAge / patients.length)
      : 0;

    res.render("dashboard", { patients, averageAge });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).send("Error fetching dashboard data");
  }
};

const registrationGet = (req, res) => {
  res.render("registration");
};

const registrationPost = async (req, res) => {
  try {
    // Generate random medical conditions
    const possibleConditions = [
      "Hypertension",
      "Diabetes",
      "Asthma",
      "Arthritis",
    ];
    const selectedConditions = [];
    for (let conditionName of possibleConditions) {
      let condition = await MedicalCondition.findOne({ name: conditionName });
      if (!condition) {
        condition = new MedicalCondition({ name: conditionName });
        await condition.save();
      }
      selectedConditions.push(condition._id);
    }

    // Generate random medications
    const possibleMedications = [
      "Aspirin",
      "Ibuprofen",
      "Paracetamol",
      "Amoxicillin",
    ];
    const selectedMedications = [];
    for (let medicationName of possibleMedications) {
      let medication = await Medication.findOne({ name: medicationName });
      if (!medication) {
        medication = new Medication({ name: medicationName });
        await medication.save();
      }
      selectedMedications.push(medication._id);
    }

    // Generate appointments
    const appointments = [];
    const numAppointments = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < numAppointments; i++) {
      const date = new Date();
      date.setDate(date.getDate() + Math.floor(Math.random() * 30));
      const appointment = new Appointment({
        date: date,
        time: date,
        doctor: ["Dr. Wrya", "Dr. Kamal", "Dr. Farhang", "Dr. Govand"][
          Math.floor(Math.random() * 4)
        ],
        room: ["F14", "F16", "S15", "WH2"][Math.floor(Math.random() * 4)],
      });
      await appointment.save();
      appointments.push(appointment._id);
    }

    const patientData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber,
      secondaryPhoneNumber: req.body.secondaryContact,
      dateOfBirth: req.body.dateOfBirth,
      isMale: req.body.gender === "male",
      bloodType: req.body.bloodType,
      address: req.body.address,
      medicalCondition: selectedConditions,
      medications: selectedMedications,
      appointments: appointments,
    };

    const patient = new Patient(patientData);
    await patient.save();

    // Update the collections to link the patient
    await MedicalCondition.updateMany(
      { _id: { $in: selectedConditions } },
      { $addToSet: { patients: patient._id } }
    );

    await Medication.updateMany(
      { _id: { $in: selectedMedications } },
      { $addToSet: { patients: patient._id } }
    );

    await Appointment.updateMany(
      { _id: { $in: appointments } },
      { $set: { patient: patient._id } }
    );

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
    const patient = await Patient.findById(req.params.id)
      .populate("medicalCondition", "name")
      .populate("medications", "name")
      .populate("appointments", "date time doctor room");

    const enrichedPatient = {
      ...patient.toObject(),
      age: calculateAge(patient.dateOfBirth),
      gender: getGender(patient.isMale),
      medications: patient.medications.map((med) => med.name),
      medicalCondition: patient.medicalCondition.map((mc) => mc.name),
      appointments: patient.appointments.map((appointment) => ({
        date: moment(appointment.date).utc().format("YYYY-MM-DD"),
        time: moment(appointment.time).utc().format("HH:mm"),
        doctor: appointment.doctor,
        room: appointment.room,
        // Add other relevant appointment details here
      })),
    };
    res.render("profile", { patient: enrichedPatient });
  } catch (error) {
    console.error("Error fetching patient profile:", error);
    res.status(500).send(error);
  }
};

const searchPatients = async (req, res) => {
  try {
    const query = req.query.q;
    const patients = await Patient.find({
      $or: [
        { firstName: new RegExp(query, "i") },
        { lastName: new RegExp(query, "i") },
        { phoneNumber: new RegExp(query, "i") },
        // Search by concatenated first and last name
        {
          $expr: {
            $regexMatch: {
              input: { $concat: ["$firstName", " ", "$lastName"] },
              regex: query,
              options: "i",
            },
          },
        },
      ],
    });
    const enrichedPatients = patients.map((patient) => ({
      ...patient.toObject(),
      age: calculateAge(patient.dateOfBirth),
      gender: getGender(patient.isMale),
    }));
    res.render("patients", { patients: enrichedPatients });
  } catch (error) {
    res.status(500).send("Error searching patients");
  }
};

const filterGet = (req, res) => {
  res.render("filter");
};

const filterPatients = async (req, res) => {
  try {
    const { name, age, gender, bloodType } = req.body;
    const query = {};

    if (name) {
      query.$or = [
        { firstName: new RegExp(name, "i") },
        { lastName: new RegExp(name, "i") },
      ];
    }
    if (age) {
      const currentDate = new Date();
      const startBirthDate = new Date(
        currentDate.setFullYear(currentDate.getFullYear() - age - 1)
      );
      const endBirthDate = new Date(
        currentDate.setFullYear(currentDate.getFullYear() + 1)
      );
      query.dateOfBirth = { $gte: startBirthDate, $lt: endBirthDate };
    }
    if (gender) {
      query.isMale = gender === "male";
    }
    if (bloodType) {
      query.bloodType = bloodType;
    }

    const patients = await Patient.find(query);
    const enrichedPatients = patients.map((patient) => ({
      ...patient.toObject(),
      age: calculateAge(patient.dateOfBirth),
      gender: getGender(patient.isMale),
    }));
    res.render("filteredPatients", { patients: enrichedPatients });
  } catch (error) {
    console.error("Error filtering patients:", error);
    res.status(500).send("Error filtering patients");
  }
};

const getEditPatientProfile = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).send("Patient not found");
    }
    res.render("editProfile", { patient });
  } catch (error) {
    console.error("Error fetching patient for edit:", error);
    res.status(500).send("Error fetching patient for edit");
  }
};

const postEditPatientProfile = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phoneNumber,
      secondaryPhoneNumber,
      dateOfBirth,
      gender,
      bloodType,
      address,
    } = req.body;
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      {
        firstName,
        lastName,
        phoneNumber,
        secondaryPhoneNumber,
        dateOfBirth,
        isMale: gender === "male",
        bloodType,
        address,
      },
      { new: true }
    );

    if (!patient) {
      return res.status(404).send("Patient not found");
    }

    res.redirect(`/patients/${patient._id}`);
  } catch (error) {
    console.error("Error updating patient profile:", error);
    res.status(500).send("Error updating patient profile");
  }
};

module.exports = {
  dashboardGet,
  registrationGet,
  registrationPost,
  getPatients,
  getPatientProfile,
  searchPatients,
  filterGet,
  filterPatients,
  getEditPatientProfile,
  postEditPatientProfile,
};
