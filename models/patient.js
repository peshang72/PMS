const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const patientSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    secondaryPhoneNumber: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    isMale: {
        type: Boolean,
        required: true,
    },
    bloodType: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    medicalCondition: [{
        type: Schema.Types.ObjectId,
        ref: 'MedicalCondition',
    }],
    medications: [{
        type: Schema.Types.ObjectId,
        ref: 'Medication',
    }],
    appointments: [{
        type: Schema.Types.ObjectId,
        ref: 'Appointment',
    }],
}, {
    timestamps: true,
    collection: 'Patients',
});

const Patient = mongoose.model('Patients', patientSchema);
module.exports = Patient;