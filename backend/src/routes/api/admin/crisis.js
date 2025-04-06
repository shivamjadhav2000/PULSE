const router= require('express').Router();
const responseHandler = require('@helpers/responseHandler');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Crisis = mongoose.model('Crisis');
const DisasterEnum = {
    'none': 0,
    'Flood': 1,
    'Tornado': 2,
    'Hurricane': 3,
    'Earthquake': 4,
    'Wildfire': 5,
    'Other': 6
}
const severityTypeEnum = {
    'Advisory': 0,
    'Severe': 1,
    'Moderate': 2,
    'Watch': 3,
    'Minor': 4
}

    router.post('/create',
        check('crisisType').exists().withMessage('crisisType is required')
            .isLength({ min: 4 }).withMessage('crisisType must be at least 4 characters long'),

            check('location').exists().withMessage('location is required')
            .isObject().withMessage('location must be an object'),
          
        check('type').exists().withMessage('type is required')
            .isNumeric().withMessage('type must be a number')
            .isIn(Object.values(DisasterEnum)).withMessage('type must be one of the predefined values'),
        check('severityType').exists().withMessage('severityType is required')
            .isNumeric().withMessage('severityType must be a number')
            .isIn(Object.values(severityTypeEnum)).withMessage('severityType must be one of the predefined values'),
        check('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
        check('startedAt').optional().isISO8601().withMessage('startedAt must be a valid date'),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return responseHandler.handleErrorResponse(res, 422, errors.array());
            }
            next();
        }
        ,async (req, res) => {
            try {
                const { crisisType, location, type, severityType, isActive, startedAt } = req.body;
                const crisisData = {
                    crisisType,
                    location,
                    type,
                    severityType,
                    isActive: isActive || true,
                    startedAt: startedAt || new Date()
                };
                console.log('Received data:', crisisData); // Log the received data
                const crisis = new Crisis(crisisData);
                await crisis.save();
                const io = req.app.get('io'); // 🧠 Get io from app context
                io.emit('crisis_alert', {
                    message: '🚨'+crisisType
                });
                
                return responseHandler.handleSuccessResponse(res,'Crisis created successfully', crisis);
            } catch (error) {
                console.error('Error creating crisis:', error); // Log the error for debugging
                return responseHandler.handleErrorResponse(res, 500, 'Error creating crisis', error);
            }
        }
    );

    module.exports = router;    