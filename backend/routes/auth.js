const express = require ('express');
const Admin = require('../models/Admin');
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
// const {JWT_SECRET}=require('../keys')

const generateToken = (user) => {
    return jwt.sign({ userId: user._id, username: user.username }, process.env.KEY, { expiresIn: '24h' });
};

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    jwt.verify(token, process.env.KEY, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      req.user = user;
      next();
    });
  };

const maxAge = 3 * 24 * 3600;
// const createtokens = (id) => {
//     console.log(id)
//     return jwt.sign({ id }, JWT_SECRET, {
//         expiresIn: maxAge
//     })
// }



router.post("/signup", async (req, res) => {
    try {
 
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        const newAdmin = new Admin({
            username: req.body.username,
            password: hashedPassword,
        });
        const admin = await newAdmin.save();

        console.log(admin);
        res.send(admin)
    } catch (err) {
        res.json(err);
    }

})


router.post("/login",async (req,res,next)=>{

    const {username,password}= req.body;

    if(!username||!password){
         return res.status(422).json({error:"add username or password"})
    }else{
    const data = await Admin.findOne({username:username})

    if(data){
        const passwordMatch = await bcrypt.compare(password, data.password);
        if(passwordMatch){
        console.log("user found")
        const token = generateToken(data);
        console.log("cookie saved0")
        res.status(200).json({ token ,message:"user found",status:200});
        }else{
            console.log("invalid password")
            res.json({message:"invalid password" ,status:400});
        }
    }else{
        console.log("invalid user")
        res.json({message:"invalid user" ,status:400});
    }
}
})

module.exports = router
