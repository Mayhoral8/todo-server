const express =  require('express')
const app = express()
const routes = express.Router()
const {check} = require('express-validator')
const checkAuth = require('../middleware/check-auth.js')
const {postLogic, getLogic, updateLogic, deleteLogic} = require('../controller/placesController.js')


routes.get('/:id',  getLogic)

routes.use(checkAuth)
const validateMiddleware = [ check('title').not().isEmpty(), check('time').not().isEmpty()]
routes.post('/',validateMiddleware, postLogic)
routes.patch('/:id', validateMiddleware, updateLogic)
routes.delete('/:id', deleteLogic)

module.exports = routes