const express = require("express").Router();
const date = require('date-and-time')
const registrations = require("../models/Registrations");
const payments = require("../models/Payment");
const router = require("./auth");
const bodyParser = require("body-parser");
// const {reqauth, checkuser} = require('../middleware/authpass')
router.use(bodyParser.urlencoded({extended:false}));

//https://in.pinterest.com/pin/76561262407011321/


const { validateRecaptcha } = require('../middleware/authpass'); // Import the middleware

router.post("/register", validateRecaptcha, async (req, res) => { 
    try {
        const newRegistration = new registrations({
            name: req.body.name,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            institute: req.body.institute,
            year: req.body.year,
            roll: req.body.roll,
            hall: req.body.hall,
            committee1: req.body.committee1,
            preference1: req.body.preference1,
            committee2: req.body.committee2,
            preference2: req.body.preference2,
            committee3: req.body.committee3,
            preference3: req.body.preference3,
            experience: req.body.experience,
            captcha: req.body.captcha // Ensure captcha is included
        });

        const registration = await newRegistration.save();
        console.log(registration);
        res.status(200).send(registration);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.post("/nodemailer" , async(req,res) =>{
    res.send({
        message:"successs......"
    })
})

router.get("/registration", async(req,res) =>{
    
        try {
          const Registrations = await registrations.find();
          console.log(Registrations);
          res.status(200).json(Registrations);
        } catch (err) {
          res.status(500).json(err);
        }
   
      
      
})
//alloting portfolio
router.post("/updateportfolio/:id", async(req,res)=>{
    try{
          await registrations.findOneAndUpdate({_id:req.params.id},{
          
            
        
            $set:{portfolioAlloted: req.body.portfolioAlloted} 
           
        }).then(()=>{
            console.log('portfolio updated')
          
           //res.redirect("/api/dashboard")
        }).catch(err=>{console.log(err)})
        
    } catch(err){
        return res.status(500).json(err)
    }
})


//alloting committee
router.post("/updatecommittee/:id", async(req,res)=>{
    try{
         await registrations.findOneAndUpdate({_id:req.params.id},{
          
            
            $set:{committeeAlloted: req.body.committeeAlloted}
           
        }).then(()=>{
          
            console.log("committee alloted")

          // res.redirect("/api/dashboard")
        }).catch(err=>{console.log(err)})
        
    } catch(err){
        return res.status(500).json(err)
    }
})


// dashboard
router.get("/dashboard" ,async(req,res)=>{

        const committee = req.query.committee;
        
    try{    
             const participants = committee ? 
             await registrations.find({
             allotment: committee,
             })
             :
             await registrations.find()
         let committeeList = [];
         participants.map(participant=>{
             committeeList.push(participant)
         })
         
         console.log(participants)
         res.status(200).json(committeeList)
        // if(committee){
        //  res.render('dashboard',{title: 'root',committeeList:committeeList ,committee:committee});
        // }
        // else{
        // res.render('root',{title: 'dashboard',committeeList:committeeList });
        // }
    }catch(err){
        res.status(500).json(err)
    }
    
    
})


//payment procedure

router.post("/payments/:id", async (req,res) => {
    try{
        
        await registrations.findOneAndUpdate({_id:req.params.id},{
          
            
            $set:{Paymentupdate: true,
                savePayment: false
                } 
           
        }).then(()=>{
           console.log(req.params.id)
        }).catch(err=>{console.log(err)})
        const now = new Date();
        const participant = await registrations.findById(req.params.id)
        const newPayment = new payments({
            name: participant.name,
            amount: req.body.amount,
            paidto: req.body.paidto,
            email: participant.email,
            phoneNumber: participant.phoneNumber,
            institute: participant.institute,
            committeeAlloted: participant.committeeAlloted,
            portfolioAlloted: participant.portfolioAlloted,
            Date: date.format(now,'DD/MM/YY HH:mm:ss'),
            committee1: participant.committee1,
            preference1: participant.preference1,
            committee2: participant.committee2,
            preference2: participant.preference2,
            committee3: participant.committee3,
            preference3: participant.preference3
        });
        
        const payment = await newPayment.save();
        res.json(payment)
    } catch(err){
        res.status(500).json(err);
    }
    
})

//payment status

router.post("/updatepaid/:id", async(req,res)=>{
    try{
         await registrations.findOneAndUpdate({_id:req.params.id},{
          
            
            $set:{paid: true} 
           
        }).then(()=>{
            console.log(req.body.paid)
           console.log("updated")
           console.log(req.params.id)
           res.redirect("/api/dashboard")
        }).catch(err=>{console.log(err)})
        
    } catch(err){
        return res.status(500).json(err)
    }
})

//to display all payments made

router.get("/payments", async(req,res)=>{
    try{    
         const paymentDetails = await payments.find()
         let paymentList = [];
         paymentDetails.map(payment=>{
             paymentList.push(payment)
         })
         console.log("below is the paqyment recoed....")
         res.status(200).json(paymentList)
    //    res.status(200).json(paymentList).render('payment',{title: 'payment',paymentList:paymentList });
    }catch(err){
        res.status(500).json(err)
    }
})



module.exports = router