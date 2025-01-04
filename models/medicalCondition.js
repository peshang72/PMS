const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const medicalConditionSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    medications: [{
        type: Schema.Types.ObjectId,
        ref: 'Medications',
    }],
});

const MedicalCondition = mongoose.model('MedicalCondition', medicalConditionSchema);

module.exports = MedicalCondition;
