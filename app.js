const {config} = require('dotenv')
const path = require('path')
const os = require('os')
const express = require('express')
const app = express()
const places = require('./routes/places')
const { mongoose } = require('mongoose')


config()
const users = require('./routes/users')
const name = process.env.DB_USER
const password = process.env.DB_PASSWORD

console.log(password)
mongoose.connect(
    `mongodb+srv://${name}:${password}@cluster0.xoq86dz.mongodb.net/?retryWrites=true&w=majority`
).then(()=>{
    console.log('connected to database!')
}).catch(()=>{
    console.log('connection failed!')
})

app.use(express.static('./public'))
// Parse form
app.use(express.urlencoded({extended: false})) 
// parse json post
app.use(express.json())

app.use('/uploads/images', express.static(path.join('uploads', 'images')))

// handles CORS errors
app.use((req, res, next)=>{
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE')
next();
})

app.use('/api/tasks', places)

app.use('/api/users', users)
app.listen(5000)
// server.listen(8000)

// console.log(routes)



// module.exports = server