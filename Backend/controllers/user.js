const bcrypt= require('bcrypt')
var jwt = require('jsonwebtoken');
require('dotenv').config()
const User= require('../models/user')

exports.postSignup = async(req ,res,next)=>{

    try {
        const {name, email, password , phone } = req.body ;

        if(!name || !email || !password || !phone){
            return res.status(400).json({message:'add all fields'})
        }

        const user = await User.findAll({where:{email}});
        if(user.length>0){
            return res.status(409).json({message:'user already exist'})
        }
        console.log( typeof(phone))

        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, async(err, hash)=>{
            console.log(hash)
            await User.create({ name , email ,password:hash , phone})
            return res.status(201).json({message:'successfully created new user'})
        });
        
    
    } catch (err) {
        res.status(500).json(err);
    }
    
}


exports.postLogin = async(req,res,next)=>{
    
    const {email,password} = req.body ;

    try {
        if(!email || !password){
            return res.status(400).json({message:'enter all fields'})
        }
        let user = await User.findOne({where:{email}});
        if(!user){
            return res.status(404).json({message:'User not found'})
        }
        bcrypt.compare(password, user.password, (err, matchPassUser)=>{
            if(!matchPassUser){
             return res.status(401).json({message:'User not authorized'})
            }
            return res.status(200).json({message:'login sucess' ,token:generateAccessToken(user.id) ,name:user.name})
         });
        

    } catch (err) {
        return res.status(500).json(err)
    }
}

function generateAccessToken(id){
    return jwt.sign({ userId : id }, process.env.JWT_SECRET_KEY);
}
