const mongoose = require("mongoose");

const RegistrationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: true,
        min: 10,
        unique: true
    },
    institute: {
        type: String,
        required: true,
    },
    year: {
        type: String,
    },
    roll: {
        type: String,
    },
    hall: {
        type: String,
    },
    committee1: {
        type: String,
        required: true,
    },
    preference1: {
        type: String,
        required: true,
    },
    committee2: {
        type: String,
        required: true,
    },
    preference2: {
        type: String,
        required: true,
    },
    committee3: {
        type: String,
        required: true,
    },
    preference3: {
        type: String,
        required: true,
    },
    experience: {
        type: String,
        max: 80
    },
    committeeAlloted: {
        type: String,
        default: " ",
    },
    portfolioAlloted: {
        type: String,
        default: " ",
    },
    status: {
        type: String,
        default: "To Send"
    },
    Allotedmail: {
        type: Boolean,
        default: false
    },
    Paymentupdate: {
        type: Boolean,
        default: false
    },
    savePayment: {
        type: Boolean,
        default: false
    },
    paid: {
        type: Boolean,
        default: false
    },
    captcha: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Registrations', RegistrationSchema);