const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: Date,
        required: true,
    },
    doctor: {
        type: String,
        required: true,
    },
    room: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    collection: 'Appointments',
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;