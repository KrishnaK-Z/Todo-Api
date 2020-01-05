const express = require('express');
const cors = require('cors');
const app = express();

const {
    init: databaseInit,
    middleware: databaseMiddleware,
} = require('../database/databaseInit');

databaseInit().catch( (error) => { console.error(error); } );

// Route handlers controller for the end point
const todoRouteHandler = require('../routes/todo');
const userRouteHandler = require('../routes/user');

// Request as JSON Object
app.use(express.json());

// Request as string or array
app.use(express.urlencoded({
    extended: false
}));

// CORS Middleware applied to for every endpoint to allow the haeders
app.use(cors({ origin: true }));
// app.use(function(request, response, next) {
//     response.header("Access-Control-Allow-Origin", "*");
//     response.header("Access-Control-Allow-Methods", "GET, POST, HEAD, PUT, OPTIONS, PATCH, DELETE");
//     response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");
//
//     response.header(
//         'Access-Control-Expose-Headers',
//         'x-access-token, x-refresh-token'
//     );
//     next();
// });

/**
 * Todo routes handler
 */
app.use('/todo', todoRouteHandler);

/**
 * User routes handler
 */
app.use('/user', userRouteHandler);

module.exports = app;
