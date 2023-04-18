const express =require('express');
const router = express.Router();

const userAuthenticate = require('../middleware/auth')
const chatController = require('../controllers/chat')


router.post('/postMessage/:groupId', userAuthenticate.authentication , chatController.postMessage )

router.get('/getMessage/:groupId', userAuthenticate.authentication , chatController.getMessage )


module.exports = router;