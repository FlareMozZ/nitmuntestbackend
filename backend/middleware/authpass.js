const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')
const {JWT_SECRET}=require('../keys')
const axios = require('axios');


const validateRecaptcha = async (req, res, next) => {
    const token = req.body.recaptchaToken;
    if (!token) {
        return res.status(400).json({ message: 'No reCAPTCHA token provided' });
    }

    try {
        const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`);
        if (response.data.success) {
            next();
        } else {
            res.status(400).json({ message: 'reCAPTCHA validation failed' });
        }
    } catch (error) {
        res.status(500).json({ message: 'reCAPTCHA validation error', error });
    }
};

const reqauth = (req,res,next)=>{
    const token = req.cookies.nitmun;
    if(token){
        jwt.verify(token,JWT_SECRET ,(err,decodedToken)=>{
            if(err){
                console.log(err.message);
                // res.redirect('/login');
            }else{
                console.log(decodedToken)
                next();
            }
        })
    }
    else{
        // res.redirect('/login')
    }
}
const checkuser = (req,res,next)=>{
     const token = req.cookies.nitmun;
     if(token){
        jwt.verify(token,JWT_SECRET,async (err,decodedToken)=>{
            if(err){
                console.log(err.message);
                res.locals.user = null;
                next();
            }else{
                console.log(decodedToken)
                let user = await Admin.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        })
    }
    else{
        res.locals.user = null;
        next();
    }
}
module.exports = { reqauth,checkuser,validateRecaptcha };