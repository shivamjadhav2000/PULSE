const responseHandler = require('@helpers/responseHandler');
const jwt = require('jsonwebtoken');
const checkAdmin = (req, res, next) => {
    // check header has the bearer token if so then deocde it and get the user from it other wise return 403
    const token = req.headers['authorization'];
    if (!token) {
        return responseHandler.handleErrorResponse(res, 403, 'No token provided');
    }
    const tokenParts = token.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return responseHandler.handleErrorResponse(res, 403, 'Invalid token format');
    }
    const tokenValue = tokenParts[1];
    jwt.verify(tokenValue, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return responseHandler.handleErrorResponse(res, 403, 'Failed to authenticate token');
        }

        req.user = decoded;
        console.log('Decoded user:', decoded); // Log the decoded user information
        next();
    });
}
module.exports = checkAdmin;