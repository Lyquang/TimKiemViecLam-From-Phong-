const jwt = require('jsonwebtoken')
require('dotenv').config();
const verifyToken = (token,secretKey) =>
{
    return jwt.verify(token,secretKey);
}
const authenticate = (request,response,next) => {
    const token = request.header('authorization');
    if (!token) return response.status(401).send('Access Denied');

    try {
        verifyToken(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        return response.status(400).send('Invalid Token');
    }
}

const recruiterAuth = (request,response,next) => {
    if (!request.body.user || !request.body.user.role || request.body.user.role !== 'recruiter') return response.status(401).send('Access Denied');
    authenticate(request,response,next);
}
module.exports = { authenticate, recruiterAuth };