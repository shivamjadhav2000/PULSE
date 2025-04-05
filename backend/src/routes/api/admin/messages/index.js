const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const MessageCred = mongoose.model('MessageCreds');
const responseHandler = require('@helpers/responseHandler');
const { check, validationResult } = require('express-validator');
const createMessageCred = async (req, res) => {
    try {
        const {messageUrl, templateId, messageKey, countryCode} = req.body;
        // check if message already exists
        const existingMessageCred= await MessageCred.findOne({messageUrl:messageUrl,templateId:templateId})
        if (existingMessageCred) {
            return responseHandler.handleErrorResponse(res, 422, 'Message already exists');
        }
        const newMessageCred = new MessageCred({
            messageUrl,
            templateId,
            messageKey,
            countryCode
        });
        await newMessageCred.save();
        return responseHandler.handleSuccessCreated(res, 'Message created successfully');
    }
    catch (error) {
        console.error('Error creating message:', error);
        return responseHandler.handleErrorResponse(res, 500, 'Internal server error');
    }
}
const editMessageCred = async (req, res) => {
    try {
        const {messageUrl, templateId, messageKey, countryCode} = req.body;
        // check org exist with id 
        const messageCred = await MessageCred.findById(req.params.id);
        if (!messageCred) {
            return responseHandler.handleErrorResponse(res, 404, 'Message not found');
        }
        const updateObj={}
        if(messageUrl) updateObj.messageUrl=messageUrl
        if(templateId) updateObj.templateId=templateId
        if(messageKey) updateObj.messageKey=messageKey
        if(countryCode) updateObj.countryCode=countryCode
        const messageUpdate = await MessageCred.findByIdAndUpdate(req.params.id, updateObj, { new: true });
        if (!messageUpdate) {
            return responseHandler.handleErrorResponse(res, 404, 'Message not found');
        }
        return responseHandler.handleSuccessResponse(res, 'Message updated successfully');
    } catch (error) {
        console.error('Error updating message:', error);
        return responseHandler.handleErrorResponse(res, 500, 'Internal server error');
    }
}
const deleteMessageCred = async (req, res) => {
    try {
        const messageCred = await MessageCred.findById(req.params.id);
        if (!messageCred) {
            return responseHandler.handleErrorResponse(res, 404, 'Message not found');
        }
        await MessageCred.findByIdAndDelete(req.params.id);
        return responseHandler.handleSuccessResponse(res, 'Message deleted successfully');
    } catch (error) {
        console.error('Error deleting message:', error);
        return responseHandler.handleErrorResponse(res, 500, 'Internal server error');
    }
}

router.post('/create', [
    check('messageUrl').notEmpty().withMessage('Message URL is required'),
    check('templateId').notEmpty().withMessage('Template ID is required'),
    check('messageKey').notEmpty().withMessage('Message Key is required'),
    check('countryCode').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return responseHandler.handleErrorResponse(res, 422, errors.array()[0].msg);
    }
    await createMessageCred(req, res);
});

router.put('/:id', [
    check('messageUrl').notEmpty().withMessage('Message URL is required'),
    check('templateId').notEmpty().withMessage('Template ID is required'),
    check('messageKey').notEmpty().withMessage('Message Key is required'),
    check('countryCode').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return responseHandler.handleErrorResponse(res, 422, errors.array()[0].msg);
    }
    await editMessageCred(req, res);
});

router.delete('/:id', async (req, res) => {
    await deleteMessageCred(req, res);
});

module.exports = router;