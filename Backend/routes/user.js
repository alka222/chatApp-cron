const express =require('express');
const router = express.Router();

const userController = require('../controllers/user')
const chatController = require('../controllers/chat')

const userAuthenticate = require('../middleware/auth')

router.post('/signup', userController.postSignup )
router.post('/login', userController.postLogin )

router.post('/postMessage', userAuthenticate.authentication, chatController.postMessage)
router.get('/getMessage', userAuthenticate.authentication, chatController.getMessage)


module.exports = router;