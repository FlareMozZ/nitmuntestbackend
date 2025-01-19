const express = require('express')
const rateLimit = require('express-rate-limit');

const mongoose = require('mongoose')
const port = process.env.PORT || 5000;
//const dotenv = require("dotenv");
require('dotenv').config()
const helmet = require("helmet");
const cookieParser = require('cookie-parser')
const bodyParser = require("body-parser");
const app = express()
const fs = require('fs');
const authRoute = require('./routes/auth.js')
const registrationsRoute = require("./routes/registrations");
const mailer = require("./routes/nodemailer");
//const port = https://nitmun-xiii-backend.onrender.com

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 30, // Limit each IP to 100 requests per `window` (15 minutes)
    standardHeaders: 'draft-8', // Use the combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiter to all requests


var cors = require('cors')
app.use(cookieParser())
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(limiter);
//dotenv.config();
//const {MONGOURI}= require('./keys.js')
//const {MONGOURI} = process.env.MONGOURI
//console.log(MONGOURI);

mongoose.connect(process.env.MONGOURI,{
    useNewUrlParser : true , useUnifiedTopology: true
});
mongoose.connection.on('connected',()=>{
    console.log('connected to DB');
})
mongoose.connection.on('error',()=>{
    console.log('not connected to DB');
})


// mongoose.connect('mongodb://localhost/lc', { useNewUrlParser : true , useUnifiedTopology: true}, ()=>
// {
//     console.log('connected to DB')
// })
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json())


app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json());
app.use(helmet())
app.use(cors())

app.use('/api',authRoute)
app.use("/api", registrationsRoute);
app.use("/api", mailer);



app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})