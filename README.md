1) To start the project 
    $ npm init

2) app.js (entry point)

3)  To install packages 
    $ npm install <packg-name> --save

4) start the application using 
    $ nodemon app.js

5) Mongo DB requires model
    - requires mongoose(pckg)
    - create a new schema => new mongoose.Schema({<Object>})
    - create model using schema new mongoose.Model('name', schema)
    - export the model
    - Instance method -> 

6) Middleware => has infulence on every response 
              => executes function before any request
    router.get('/path', middlewareFunc, (req, res) => {
        
    });
    - use to enable cros.
    - modify response.
    - authenticate before performing the requested action.

7) JWT -> no quering the databse to verify the database
    header + payload + signature

    - can't revoke access for the already authenticated token.

    - Refresh token -> Long lived | random string | stored in DB | used to generate the access token

    - Access token -> short lived | JWT web token | credential to access data & resource.

    - The client app will send request to API with the Refresh Token in the header.

    - If the refresh token is valid, the API genereate the access token and send to the client app in the HTTP application.

    - jsonwebtoken.sign() method to create access token