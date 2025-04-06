const router = require('express').Router();
const responseHandler = require('@helpers/responseHandler');
const { check, validationResult } = require('express-validator');
const getLocationFromIP = require('@middleware/getLocationFromIP'); // Adjust the path as needed
router.post('/signup', 
    check('name').exists().withMessage('name is required')
        .isLength({ min: 4 }).withMessage('name must be at least 4 characters long'),
    check('departmentName')
        .exists().withMessage('departmentName is required')
        .isLength({ min: 4 }).withMessage('departmentName must be at least 4 characters long'),
    check('password').exists().withMessage('password is required')
        .isLength({ min: 4 }).withMessage('password must be at least 4 characters long'),
    check('gender').exists().withMessage('gender is required')
        .isIn(['male', 'female', 'other']).withMessage('gender must be male, female, or other'),
    check('experience').exists().withMessage('experience is required')
        .isNumeric().withMessage('experience must be a number'),
    check('userName').exists().withMessage('userName is required')
        .isLength({ min: 4 }).withMessage('userName must be at least 4 characters long'),
    check('age').exists().withMessage('age is required')
        .isNumeric().withMessage('age must be a number'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return responseHandler.handleErrorResponse(res, 422, errors.array());
        }
        next();
    },
    getLocationFromIP,

    require('./signup'));

router.post('/login',
    check('userName').exists().withMessage('userName is required')
        .isLength({ min: 4 }).withMessage('userName must be at least 4 characters long'),
    check('password').exists().withMessage('password is required')
        .isLength({ min: 4 }).withMessage('password must be at least 4 characters long'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return responseHandler.handleErrorResponse(res, 422, errors.array());
        }
        next();
    }
, getLocationFromIP
    ,require('./login'));
module.exports = router;