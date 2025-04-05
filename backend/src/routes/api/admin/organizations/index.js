const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Organization = mongoose.model('Organizations');
const MessageCred = mongoose.model('MessageCreds');
const { check, validationResult } = require('express-validator');
const responseHandler = require('../../../../helpers/responseHandler');
const createOrganization =async (req, res) => {
    try {
        const { name, dealerName, password, arkapiurl,messageId } = req.body;
        // check if organization already exists
        const existingOrganization = await Organization.findOne({name:name})
        if (existingOrganization) {
            return responseHandler.handleErrorResponse(res, 422, 'Organization already exists');
        }
        const newOrganization = new Organization({
            name,
            dealerName,
            password,
            arkapiurl,
            messageId,
        });
        await newOrganization.save();
        return responseHandler.handleSuccessCreated(res, 'Organization created successfully');
    } catch (error) {
        console.error('Error creating organization:', error);
        return responseHandler.handleErrorResponse(res, 500, 'Internal server error');
    }
}
const editOrganization =async (req, res) => {
    try {
        const { name, dealerName, password, arkapiurl, messageId } = req.body;

        // check org exist with id 
        const organization = await Organization.findById(req.params.id);
        if (!organization) {
            return responseHandler.handleErrorResponse(res, 404, 'Organization not found');
        }
        const updateObj={}
        if(name) updateObj.name=name
        if(dealerName) updateObj.dealerName=dealerName
        if(password) updateObj.password=password
        if(arkapiurl) updateObj.arkapiurl=arkapiurl
        if(messageId) {
            const messageObj= await MessageCred.findById(messageId)
            if(!messageObj) return responseHandler.handleErrorResponse(res, 422, 'Message not found')
            updateObj.messageId=messageId
        }
        const organizationUpdate = await Organization.findByIdAndUpdate(req.params.id, updateObj, { new: true });
        if (!organizationUpdate) {
            return responseHandler.handleErrorResponse(res, 404, 'Organization not found');
        }
        return responseHandler.handleSuccessResponse(res, 'Organization updated successfully');
    } catch (error) {
        console.error('Error updating organization:', error);
        return responseHandler.handleErrorResponse(res, 500, 'Internal server error');
    }
}


const deleteOrganization =async (req, res) => {
    try {
        const organization = await Organization.findByIdAndDelete(req.params.id);
        if (!organization) {
            return responseHandler.handleErrorResponse(res, 404, 'Organization not found');
        }
        return responseHandler.handleSuccessResponse(res, 'Organization deleted successfully');

    } catch (error) {
        return responseHandler.handleErrorResponse(res, 500, 'Internal server error');
    }
}


router.post('/create',[
    check('name').exists().withMessage('name is required')
        .isLength({ min: 4 }).withMessage('name must be at least 4 characters long'),
    check('dealerName')
        .exists().withMessage('dealerName is required')
        .isLength({ min: 4 }).withMessage('dealerName must be at least 4 characters long'),
    check('password').exists().withMessage('password is required')
        .isLength({ min: 4 }).withMessage('password must be at least 4 characters long'),
    check('arkapiurl').exists().withMessage('arkapiurl is required')
        .isLength({ min: 4 }).withMessage('arkapiurl must be at least 4 characters long'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return responseHandler.handleErrorResponse(res, 422, errors.array());
        }
        next();
    }
], createOrganization);
router.put('/:id', editOrganization);
router.delete('/:id', deleteOrganization);

module.exports = router;