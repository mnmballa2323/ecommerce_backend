const jwt = require('jsonwebtoken');
const config = require('../../../config')


// const Auth = async (req, res, next) => {
//     try {
//         // Check if the authorization header exists
//         if (!req.headers.authorization) {
//             console.log('Authorization header missing');
//             throw new Error('Authorization header missing');
//         }

//         // Split the header and extract the token
//         const parts = req.headers.authorization.split(' ');
//         if (parts.length !== 2 || parts[0] !== 'Bearer') {
//             console.log('Invalid authorization header format');
//             throw new Error('Invalid authorization header format');
//         }

//         const token = parts[1];
//         console.log('Token:', token);

//         // Retrieve the user details for the logged-in user
//         const decodedToken = await jwt.verify(token, env.JWT_SECRET);
//         console.log('Decoded Token:', decodedToken);

//         req.user = decodedToken;

//         next();
//     } catch (error) {
//         console.log('Error:', error.message);
//         res.status(401).json({ error: 'Authentication Failed!' });
//     }
// };


// /** authentication middleware */

const Auth = async (req, res, next) => {
    try {

        // access authorize header to validate request
        const token = req.headers.authorization.split(" ")[1];
       
       
        // retrive the user details fo the logged in user
        const decodedToken = await jwt.verify(token, config.jwt_secret);
       
        req.user = decodedToken;

        next()

    } catch (error) {
        res.status(401).json({ error: "Authentication Failed!" })
    }
}
function localVariables(req, res, next) {
    req.app.locals = {
        OTP: null,
        resetSession: false
    }
    next()
}
// module.exports = Auth;
module.exports = {
    Auth,
    localVariables
};