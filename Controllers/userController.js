const { json } = require('express');
const users = require('../Models/userSchema')
//import jwt token
const jwt = require('jsonwebtoken')
 
//register logic

exports.register=async(req,res)=>{
    console.log("inside register function");

    const {username,email,password} = req.body
    
    try{
        //if check the email is already in db -> User already registered
    const existingUser = await users.findOne({email})
    if(existingUser){
        res.status(401).json("User already registered")
    }
    //If the email is not present in db -> new user data will save to the database
    else{
        const newUser = await users({
            username,email,password,github:"",link:"",profile:"" 
        })
        await newUser.save()//save new User data to database
        res.status(200).json("user registration successful")
    }
    }
    catch(err){
        res.status(500).json("server error: "+err.message)
    }
}


//login logic
exports.login=async(req,res)=>{
    const {email,password} = req.body
    
    try{
    const user = await users.findOne({email,password})
    if(user){
        //token generation
        const token = jwt.sign({userId:user._id},"superkey2024")
        console.log(token);
        res.status(200).json({user,token})
        
    }
    
    else{
        res.status(404).json("Invalid login")
    }
    }
    catch(err){
        res.status(500).json("server error: "+err.message)
    }
}

