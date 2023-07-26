const express = require('express')
const routes = express.Router()
const {check} = require('express-validator')
const {getUsers, getUser, signUp, login, updateUser} = require('../controller/userController')
const validateMiddleware = [check('name').not().isEmpty(), check('email').normalizeEmail().isEmail(), check('password').isLength({min: 6})]

routes.get('/:id', getUser)
routes.get('/', getUsers)
routes.post('/signup', validateMiddleware, signUp)
routes.post('/login', login)

module.exports = routes