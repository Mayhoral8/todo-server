const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


const createPlaces = new mongoose.Schema({
    title : { type: String, required: true},
    time: {type: String, required: true},
    creator: { type: mongoose.Types.ObjectId, required: true, ref:'User'}
})


const createUser = new mongoose.Schema({
    name: { type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, minlength: 6},
    places:  [{ type: mongoose.Types.ObjectId, required: true, ref:'Place'}],
    imageUrl: {type: String, required: false},
})



const Places =  mongoose.model('Place', createPlaces)
const User = mongoose.model('User', createUser)

createUser.plugin(uniqueValidator)

module.exports = {Places, User}