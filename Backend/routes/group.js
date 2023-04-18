const express =require('express');
const router = express.Router();

const userAuthenticate = require('../middleware/auth')
const groupController = require('../controllers/group')
const usergroupController = require('../controllers/usergroup')

router.get('/getgroups', userAuthenticate.authentication , groupController.getGroups  )
router.post('/create-group' , userAuthenticate.authentication , groupController.createGroup)

router.get('/fetch-users/:groupId', userAuthenticate.authentication , usergroupController.fetchUsers)

router.post('/addUser', userAuthenticate.authentication , usergroupController.addUserToGroup)

router.get('/isAdmin/:groupId', userAuthenticate.authentication , usergroupController.isAdmin)

router.post('/remove-user', userAuthenticate.authentication , usergroupController.removeUserFromGroup)

router.post('/makeAdmin', userAuthenticate.authentication , usergroupController.makeAdmin)

router.post('/removeAdmin', userAuthenticate.authentication , usergroupController.removeAdmin)


module.exports = router;