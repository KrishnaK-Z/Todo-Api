const { User } = require('../database/models');

// Verify Refresh Token Middleware (which will be verifying the session)
let verifySession = (request, response, next) => {
    const refreshToken = request.header('x-refresh-token');

    const _id = request.header('_id');

    User.findByIdAndToken(_id, refreshToken).then(user => {
        if (!user) {
            return Promise.reject({
                'error': 'User not found'
            });
        }

        // therefore the refresh token exists in the database - but we still have to check if it has expired or not
        request.user_id = user._id;
        request.userObject = user;
        request.refreshToken = refreshToken;

        let isSessionValid = false;

        user.session.forEach(sess => {
            if (sess.token === refreshToken) {
                // check if the session has expired
                if (User.hasRefreshTokenExpired(sess.expiresAt) === false) {
                    // refresh token has not expired
                    isSessionValid = true;
                }
            }
        });

        if (isSessionValid) {
            next();
        } else {
            return Promise.reject({
                'error': 'Refresh token has expired or the session is invalid'
            });
        }

    }).catch(error => {
        response.status(400).json(error);
    })

}

module.exports = verifySession;