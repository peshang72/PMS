const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const medicalConditionSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    medications: [{
        type: Schema.Types.ObjectId,
        ref: 'Medication',
    }],
    patients: [{
        type: Schema.Types.ObjectId,
        ref: 'Patient',
    }],
}, {
    timestamps: true,
    collection: 'Medical-Conditions',
});

const MedicalCondition = mongoose.model('MedicalCondition', medicalConditionSchema);

module.exports = MedicalCondition;
