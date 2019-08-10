/**
 * Contains the connection logic to MongoDB
 */

const mongoose = require('mongoose');
require('dotenv/config');

// Telling Mongoose to use the native js promises
mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost:27017/todoTasks", {
        useNewUrlParser: true
    }).then(() => {
        console.log("DB Connected successfull");
    })
    .catch(e => {
        console.log("Error : ", e);
    });

// To prevent deprectation warnings (from MongoDB native driver)
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);


module.exports = {
    mongoose
};