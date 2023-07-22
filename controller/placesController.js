const mongoose = require('mongoose')
const express = require('express')
const app = express()
const {Places, User} = require('../models/schema')
const { validationResult } = require('express-validator')




const postLogic = async (req, res, next)=>{
    console.log(req.body.title, req.body.time)
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        const response = res.status(422).json({success: false, message: 'check input field'})
        return next(response)
    }
    const id = req.params.id
    const {title, description, category, time, creator} = req.body
 
    const createdPlace = new Places({
        title,
        description,
        category,
        time,
        creator
    })
    let user;

    try{
        user = await User.findById(creator)

    }catch(err){
       res.status(500).json({success: false, message: 'failed to fetch user'})
       return next(err)
    }

    if(!user){
        const response = res.status(400).json({success: false, message: 'could not find user for selected iD'})
        return next(response)
    }

    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
      await createdPlace.save({sessionStorage: sess});
       user.places.push(createdPlace)
      await user.save({sessionStorage: sess})
      await sess.commitTransaction();
    } catch(err){
       return next(res.status(400).json({success: false, message: 'failed to create a new task'})       )
    }
    
    res.status(201).json({success: true, message: 'place created!'})

    // console.log(req.body)
    
   

    // res.status(401).send('please provide name')
}

const getLogic = async (req, res, next)=>{
    const userId = req.params.id
    let tasks
    try{
        tasks = await Places.find({creator: userId})
        res.status(200).json({success: true, message: tasks.map((task)=> task.toObject({getters: true}))})

    }catch(err){
        res.status(404).json({success: false, message:'could not fetch data'})
        return next(err)
    }
    // return res.json({success: true, data})
}

const updateLogic = async (req, res, next)=>{
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        res.status(422).json({success: false, message: 'check input field'})
    }
    
    const {title, description} = req.body
    const id = req.params.id
    console.log(id)
    let place;
    try{
         place = await Places.findById(id)
    }catch(err){
        res.json({success: false, message: 'operation failed'})
        return  next(err)
    }
    if(!place){
        res.status(400).json({success: false, message: 'No place was found for the selected ID'})
    }else{
        place.title = title
        place.description = description
        console.log(place)
        try{
            await place.save()
        }catch(err){
            res.json({success: false, message: 'could not update place'})
            return  next(err)
        }     
        res.status(201).json({success: true, updatePlace: place.toObject({getters: true})})
    }
}

const deleteLogic = async (req, res, next)=>{
    let place;
    const id = req.params.id
    try{
        place = await Places.findById(id).populate('creator')
    }catch(err){
      res.status(400).json({success: false, message: 'could not complete find operation'})
       
    }
    if(!place){
        res.status(400).json({success: false, message: 'could not find a place with that ID'})
    } else {   
        try{
            const sess = await mongoose.startSession();
            sess.startTransaction
            await place.deleteOne({sessionStorage: sess})
            place.creator.places.pull(place)
            await place.creator.save({sessionStorage: sess})
            sess.commitTransaction       
        }catch(err){
            res.json({success: false, message: 'could not delete place'})
            return next(err)
        }
        res.status(201).json({success: true})
    }
}


// const postLogic = (req, res)=>{
//     const id = req.params.id
//     const {name} = req.body
//     // console.log(req.body)
//     const authPerson = data.find((data)=>{
//         return data.id === id
//     })
//     if(name && authPerson){
//         const newData = [...data, req.body]
//         // console.log(newDA)
//         return res.status(201).json(newData)
//     }
//     if(!id){
//         res.status(401).json({success: false, message: 'user id doesn\'t exist'})
//     }if(!name){
//         res.status(401).json({success: false, message:'please provide name'})
//     }

//     res.status(401).send('please provide name')
// }
module.exports = {postLogic, getLogic, updateLogic, deleteLogic}