const express = require('express');
const router = express.Router();
const { Todo, Thing } = require('../database/models');

const authenticate = require('../middleware/authenticate');

/**
 * Get /todo/
 * To get all the todos respective of user
 * pass data through the JSON request body
 */
router.get('/', authenticate, (request, response) => {
    Todo.find({
            _userId: request.user_id
        })
        .then(todos => {
            response.status(200).json({
                success: true,
                result: todos
            });
        })
        .catch(error => {
            response.status(404).json({
                success: false,
                result: error
            });
        });
});

/**
 * Create a todo
 */
router.post('/', authenticate, (request, response) => {
    let title = request.body.title;

    let newTodo = new Todo({
        title,
        _userId: request.user_id
    });

    newTodo.save().then(todo => {
        response.status(200).json({
            success: true,
            result: todo
        });
    }).catch(error => {
        response.status(404).json({
            sucess: false,
            result: error
        });
    });
});

/**
 * To update the list
 */
router.patch('/:id', authenticate, (request, response) => {

    Todo.findOneAndUpdate({ _id: request.params.id }, {
            $set: request.body
        }).then(() => {
            response.status(200).json({
                success: true
            });
        })
        .catch(error => {
            response.json({
                sucess: false,
                result: error
            });
        })
});

/**
 * To Delete the list
 */
router.delete('/:id', authenticate, (request, response) => {
    Todo.findOneAndRemove({
            _id: request.params.id,
            _userId: request.user_id
        })
        .then(todo => {
            response.json({
                success: true,
                result: todo
            });
            deleteThingsFromTodo(todo._id);
        })
        .catch(error => {
            response.json({
                success: false,
                result: error
            });
        });
});

/**
 * To get all the things for a todo
 */
router.get('/:todoId/things', authenticate, (request, response) => {
    Thing.find({
            _todoId: request.params.todoId
        })
        .then(things => {
            response.json({
                success: true,
                result: things
            });
        })
        .catch(error => {
            response.json({
                success: false,
                result: error
            });
        })
});

/**
 * To get a particular thing in a particular todo
 */
router.get('/:todoId/things/:id', authenticate, (request, response) => {
    Thing.find({
            _todoId: request.params.todoId,
            _id: request.params.id
        })
        .then(things => {
            response.json({
                success: true,
                result: things
            });
        })
        .catch(error => {
            response.json({
                success: false,
                result: error
            });
        })
});

/**
 * To add a new thing
 */
router.post('/:todoId/things', authenticate, (request, response) => {
    Todo.findOne({
        _id: request.params.todoId,
        _userId: request.user_id
    }).then(todo => {
        if (todo) { return true; }
        return false;
    }).then(canCreateThing => {
        if (canCreateThing) {
            let newThing = new Thing({
                thing: request.body.thing,
                _todoId: request.params.todoId
            });
            newThing.save().then(thing => {
                response.status(200).json({
                    success: true,
                    result: thing
                });
            }).catch(error => {
                response.send(404).json({
                    sucess: false,
                    result: error
                });
            });
        }
    })
});

/**
 * to update a thing
 */
router.patch('/:todoId/things/:thingId', authenticate, (request, response) => {
    Todo.findOne({
        _id: request.params.todoId,
        _userId: request.user_id
    }).then(todo => {
        if (todo) {
            return true;
        }
        return false;
    }).then(canUpdate => {
        if (canUpdate) {
            Thing.findOneAndUpdate({
                    _id: request.params.thingId,
                    _todoId: request.params.todoId
                }, {
                    $set: request.body
                }).then((thing) => {
                    response.json({
                        success: true,
                        result: thing
                    });
                })
                .catch(error => {
                    response.json({
                        sucess: false,
                        result: error
                    });
                });
        } else {
            response.sendStatus(404);
        }
    }).catch(error => {
        response.json({
            sucess: false,
            result: error
        });
    });;

});

/**
 * To delete a thing
 */
router.delete('/:todoId/things/:thingId', authenticate, (request, response) => {
    Todo.findOne({
        _id: request.params.todoId,
        _userId: request.user_id
    }).then(todo => {
        if (todo) {
            return true;
        }
        return false;

    }).then(canDeleteThings => {
        if (canDeleteThings) {
            Thing.findOneAndRemove({
                    _id: request.params.thingId,
                    _todoId: request.params.todoId
                })
                .then(thing => {
                    response.json({
                        success: true,
                        result: thing
                    });
                })
                .catch(error => {
                    response.json({
                        success: false,
                        result: error
                    });
                });
        }
    })
});

/**
 * Helpher Methods
 */
let deleteThingsFromTodo = (_todoId) => {
    Todo.deleteMany({
        _todoId
    }).then(() => {
        console.log("Tasks from " + _todoId + " were deleted!");
    })
}

module.exports = router;
