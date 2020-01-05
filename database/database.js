const mongoose = require('mongoose');

// Telling Mongoose to use the native js promises
mongoose.Promise = global.Promise;

module.exports = mongoose;
