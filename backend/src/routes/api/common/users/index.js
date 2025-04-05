const router= require('express').Router()
const mongoose = require('mongoose')
const Organizations = mongoose.model('Organizations')
const MessageCreds = mongoose.model('MessageCreds')
const { check, validationResult } = require('express-validator')
const responseHandler = require('@helpers/responseHandler')
const {checkIfUserExists,sendOtp} =require('./utils')
router.get('/checkuserexists', async (req, res) => {
  const username = req.query.username;
  
  const orgId = req.query.orgId
    // Check if org exists
    const orgObj = await Organizations.findById(orgId)
    if (!orgObj) return responseHandler.handleErrorResponse(res, 404, 'Organization not found')
    const messageObj =await MessageCreds.findById(orgObj?.messageId)
    if (!messageObj) return responseHandler.handleErrorResponse(res, 404, 'Message not found')
    const mobile = messageObj.countryCode + username
      // Check if user exists
  if (!username) return res.json({ success: false, message: 'Mobile number is not provided' });
  const userExists = await checkIfUserExists(username,orgObj);
  if (!userExists?.success) return res.json({ success: false, message: 'User does not exist' });
  // Update the user
  const data = await sendOtp(mobile,messageObj.messageUrl,messageObj.templateId,messageObj.messageKey);
  if (data?.success) {
    return res.json({ success: true, message: `Otp sent to Mobile ${mobile}` });
  }
  return res.json({ success: false, message: 'Unable to verify mobile' });
})
module.exports = router