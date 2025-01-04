const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const medicationSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    patients: [{
        type: Schema.Types.ObjectId,
        ref: 'Patient',
    }],
    medicalConditions: [{
        type: Schema.Types.ObjectId,
        ref: 'MedicalCondition',
    }],
}, {
    timestamps: true,
    collection: 'Medications',
});

const Medication = mongoose.model('Medication', medicationSchema);

module.exports = Medication;
