const express = require('express');
const router = express.Router();
const {authenticateUser,getfiles,revokeToken}=require('../auth/auth')





router.post('/autheticate',authenticateUser)
router.get('/getfiles',getfiles)
router.delete('/revokeToken',revokeToken)




module.exports = router;