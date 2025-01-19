const mongoose = require("mongoose")

const paymentSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true,
    },
    amount:{
        type: Number,
        required: true,
    },
    paidto:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        max: 50,
        unique: true
    },
    phoneNumber:{
        type: Number,
        required: true,
        min: 10,
        unique: true
    },
    institute:{
        type: String, 
        required: true,
    },
    committeeAlloted: {
        type: String,
        default: "",
       },
    portfolioAlloted:{
        type: String,
        default: "",  
       },
    Date:{
        type: String,
        default: ""
       },
    committee1:{
        type: String,
        required:true
    },
    preference1:{
        type: String,
        required: true,
    },
    committee2:{
        type: String,
        required:true
    },
    preference2:{
        type: String,
        required: true,
    },
    committee3:{
        type: String,
        required:true
    },
    preference3:{
        type: String,
        required: true,
    },
}, {timestamps: true})

module.exports = mongoose.model('Payment', paymentSchema)