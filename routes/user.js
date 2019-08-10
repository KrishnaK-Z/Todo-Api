const express = require('express');
const router = express.Router();

const { User } = require('../database/models');

/**
 * Middleware
 */

const verifySession = require('../middleware/verify.user');

/**
 * Sign up the new user
 */
router.post('/', (request, response) => {
    let body = request.body;
    let newUser = new User(body);

    newUser.save().then(() => {
        return newUser.createSession();
    }).then((refreshToken) => {
        // Session created successfully - refreshToken returned.
        // now we geneate an access auth token for the user

        return newUser.generateAccessAuthToken().then((accessToken) => {
            // access auth token generated successfully, now we return an object containing the auth tokens
            return { accessToken, refreshToken };
        });

    }).then((authTokens) => {
        // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
        response
            .header('x-refresh-token', authTokens.refreshToken)
            .header('x-access-token', authTokens.accessToken)
            .send(newUser);
    }).catch(error => {
        response.status(400).json({ error });
    })

});

/**
 * Login 
 */
router.post('/login', (request, response) => {
    let body = request.body;

    User.findUserByCredentials(body.email, body.password).then((user) => {
        return user.createSession().then((refreshToken) => {

            // Session created successfully - refreshToken returned.
            // now we geneate an access auth token for the user

            return user.generateAccessAuthToken().then((accessToken) => {
                // access auth token generated successfully, now we return an object containing the auth tokens
                return { accessToken, refreshToken };
            });

        }).then((authTokens) => {
            // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
            response
                .header('x-refresh-token', authTokens.refreshToken)
                .header('x-access-token', authTokens.accessToken)
                .send(user);
        })
    }).catch(error => {
        response.status(400).json(error);
    });

});

/**
 * Generate and returns the access token
 */
router.get('/me/access-token', verifySession, (request, response) => {
    request.userObject.generateAccessAuthToken().then(accessToken => {
        response.header('x-access-token', accessToken).json({ accessToken });
    }).catch(error => {
        response.status(400).json({ error });
    });
});


module.exports = router;