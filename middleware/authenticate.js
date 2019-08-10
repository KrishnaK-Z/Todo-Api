const jwt = require('jsonwebtoken');
const { User } = require('../database/models');

// Authenticate the JWT token
let authenticate = (request, response, next) => {
    let token = request.header('x-access-token');

    jwt.verify(token, User.getJWTSecret(), (error, decoded) => {
        if (error) {
            response.status(401).send(error);
        } else {
            request.user_id = decoded._id;
            next();
        }
    })
}

module.exports = authenticate;