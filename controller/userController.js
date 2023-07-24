const {config} = require('dotenv')
const file = require('fs')
const {User} = require('../models/schema')
const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const HttpError = require('../models/error-model')
const {storage, uploadBytes, ref, getDownloadURL, listAll} = require('../utilities/firebase-config')

config()





const getUsers = async (req, res, next)=>{
    let users;
   try{
         users = await User.find({}, '-password')
   }catch(err){
        const error = new HttpError(
            'could not get users'
        )
        return next(error)
   }
   res.status(200).json({success: true, message: users.map((user)=> user.toObject({getters: true}))})
   
}

const getUser = async (req, res, next)=>{
    const id = req.params.id
  
   let users;
   try{
        users = await User.findById(id)
    }catch(err){ 
         res.status(500).json({success: false, message: 'user Id does not exist'})  
    }
    if(!users){
        res.status(400).json({success: false, message: 'user not found'})
    } else{

        return res.status(200).json({success: true, message: users.toObject({getters: true})})
    } 
       
   
}


const signUp = async (req, res, next)=>{
    const {name, email, password, firebaseImgUrl} = req.body
    console.log(firebaseImgUrl)
    console.log()
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).json({success: false, message: 'check input field'})
    }
    let hashedPassword;
    try{
        hashedPassword = await bcrypt.hash(password, 12)
    }catch(err){
        return next(res.status(500).json({success: false, message: 'Could not create user, please try again'}))
    }

    let result;
  
    let existingUser;

    try{
        existingUser = await User.findOne({email: email})
    }catch(err){
      return res.status(500).json({success: false, message: 'Could not execute request, check connection'})
    }
    if(existingUser){
       return res.status(400).json({success: false, message: 'User already exists'})
    }

        const createdUser = new User({
            name,
            email,
            password: hashedPassword,
            image: req.file.path,
            firebaseImgUrl,
            places: []
        })
        
            
        try{
            result = await createdUser.save()
            if(!result){
            
                return res.status(400).json({success: false, message: 'server error, please check connection'})
            }
        }catch(err){
            return res.status(400).json({success: false, message: 'could not create user'})
        }
            
     let token
        try{       
            token = jwt.sign({userId: createdUser.id, email: createdUser.email},process.env.JWT_KEY, {expiresIn: '1h'})
        }catch(err){
            return next(res.status(500).json({success: false, message: 'Could not create user, please try again'}))
        }
        return res.status(201).json({success: true, userId: createdUser.id, name: createdUser.name, email: createdUser.email, token:token, image: createdUser.firebaseImgUrl})
    
   
}
    
const login = async (req, res, next)=>{
    const {email, password} = req.body
    let existingUser;
    try{
        existingUser = await User.findOne({email: email})
    }catch(err){
        return next (res.status(500).json({success: false, message: 'finding user operation failed'}))
    }
    if(!existingUser){         
        return res.status(401).json({success: false, message: 'Wrong Credentials'})      
    }else{
        let isValidPassword = false;
        try{
            isValidPassword = await bcrypt.compare(password, existingUser.password)
        }catch(err){
            return next(res.status(500).json({success: false, message: 'Could not log you in, check your credentials and try again'}))
        }
        if(!isValidPassword){
        return res.status(401).json({success: false, message: 'Wrong Credentials'})      
        }

    }
    let token
    try{       
        token = jwt.sign({userId: existingUser.id, email: existingUser.email}, process.env.JWT_KEY, {expiresIn: '1h'})
    }catch(err){
        return next(res.status(500).json({success: false, message: 'Logging In Failed, please try again'}))
    }

        return res.status(201).json({success: true, userId: existingUser.id, name: existingUser.name, image: existingUser.firebaseImgUrl, token:token})
   
}

// const updateUser = async(req, res, next)=>{
//     const id = req.params.id

    
//    let user;
//    try{
//         user = await User.findById(id)
//     }catch(err){ 
//          res.status(500).json({success: false, message: 'user Id does not exist'})  
//     }
//     if(!user){
//         res.status(400).json({success: false, message: 'user not found'})
//     } else{
//         user.image = req.body.imageUrl

//         try{
//             await user.save()
//         }catch(err){
//                 res.status(501).json({success: false, message: 'could not update user image'})
//         }
//         return res.status(200).json({success: true, message: user.toObject({getters: true})})
//     } 
       
// }

module.exports = {getUsers, getUser, signUp, login}