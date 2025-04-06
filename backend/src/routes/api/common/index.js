const router = require('express').Router();
const responseHandler = require('@helpers/responseHandler');
const mongoose = require('mongoose');
const Emergency = mongoose.model('Emergency');
const MedicalForm = mongoose.model('MedicalForm');
const RequestedResources = mongoose.model('RequestedResources');
const { check, validationResult } = require('express-validator');
router.post('/emergency', 
    check('userId').exists().withMessage('userId is required')
        .isLength({ min: 4 }).withMessage('userId must be at least 4 characters long'),
    check('location').exists().withMessage('location is required')
        .isObject().withMessage('location must be an object'),
    check('disasterType').exists().withMessage('disasterType is required'),
    check('severityType').exists().withMessage('severityType is required'),
    check('message').exists().withMessage('message is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return responseHandler.handleErrorResponse(res, 422, errors.array());
        }
        next();
    }
    ,async (req, res) => {
    try {
        const { userId, location, disasterType, severityType, message } = req.body;
        console.log('Received data:', req.body); // Log the received data
        const emergency = new Emergency({
            userId,
            location,
            disasterType,
            severityType,
            message
        });

        await emergency.save();
        return res.status(201).json({ message: 'Emergency created successfully', emergency });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating emergency', error });
    }
}
);
router.post('/medical', 
    check('userId').exists().withMessage('userId is required')
        .isLength({ min: 4 }).withMessage('userId must be at least 4 characters long'),
    check('location').exists().withMessage('location is required')
        .isObject().withMessage('location must be an object'),
    check('patientCount').exists().withMessage('patientCount is required')
        .isNumeric().withMessage('patientCount must be a number'),
    check('criticalCount').exists().withMessage('criticalCount is required')
        .isNumeric().withMessage('criticalCount must be a number'),
    check('disasterType').exists().withMessage('disasterType is required'),
    check('medicalResourceType').exists().withMessage('medicalResourceType is required'),
    check('message').exists().withMessage('message is required'),
    check('crisisId').exists().withMessage('crisisId is required')  
        .isLength({ min: 4 }).withMessage('crisisId must be at least 4 characters long'),
    (req, res, next) => {   
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return responseHandler.handleErrorResponse(res, 422, errors.array());
        }
        next();
    }

    ,async (req, res) => {
    try{
    const { userId, location, patientCount, criticalCount, disasterType, medicalResourceType, message, crisisId } = req.body;

    const medicalForm = new MedicalForm({
        userId,
        location,
        patientCount,
        criticalCount,
        disasterType,
        medicalResourceType,
        message,
        crisisId
    });
    console.log('Received data:', req.body); // Log the received data
    await medicalForm.save();
   return  res.status(201).json({ message: 'Medical form created successfully', medicalForm });
} catch (error) {
    res.status(500).json({ message: 'Error creating medical form', error });
}
    return responseHandler.handleSuccessResponse(res, 'Medical form submitted successfully');
}
);

router.post('/resource', 
    check('userId').exists().withMessage('userId is required')
        .isLength({ min: 4 }).withMessage('userId must be at least 4 characters long'),
    check('location').exists().withMessage('location is required')
        .isObject().withMessage('location must be an object'),
    check('type').exists().withMessage('type is required'),
    check('quantity').exists().withMessage('quantity is required')  
        .isNumeric().withMessage('quantity must be a number'),
    check('priority').exists().withMessage('priority is required'),
    check('message').exists().withMessage('message is required'),   
    check('crisisId').exists().withMessage('crisisId is required')  
        .isLength({ min: 4 }).withMessage('crisisId must be at least 4 characters long'),
    (req, res, next) => {
        console.log('Received data:', req.body); // Log the received data
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return responseHandler.handleErrorResponse(res, 422, errors.array());
        }
        next();
    }   
    ,async (req, res) => {
    try {
        const { userId, location, type, quantity, priority, message, crisisId } = req.body;
        const requestedResource = new RequestedResources({
            userId,
            location,
            type,
            quantity,
            priority,
            message,
            crisisId
        });

        await requestedResource.save();
        return res.status(201).json({ message: 'Requested resource created successfully', requestedResource });
    } catch (error) {
        console.error('Error creating requested resource:', error);
        return res.status(500).json({ message: 'Error creating requested resource', error });
    }
}
);

module.exports = router;