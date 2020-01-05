const mongoose = require('mongoose');

const ThingSchema = new mongoose.Schema({
    thing: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    _todoId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});

const Thing = mongoose.model('Thing', ThingSchema);

module.exports = { Thing };