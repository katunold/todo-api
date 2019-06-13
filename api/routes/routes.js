const express = require('express');
const TodoService = require('../services/TodoService');

const router = express.Router();

router.get('/todo', (req, res, next) => {
    const { db } = req;
    const todoService = new TodoService(db);
    todoService
        .listTodo()
        .then(todo => res.status(200).json({todo}))
        .catch(next);
});

router.post('/todo', (req, res, next) => {
    const { db, body } = req;
    const todoService = new TodoService(db);

    todoService
        .createTodo(body)
        .then(todo => res.status(201).json(todo))
        .catch(next);
});

router.patch('/todo/:todoId', function (req, res, next) {
    const { db, body } = req;
    const { todoId } = req.params;
    const todoService = new TodoService(db);

    todoService
        .patchTodo(todoId, body)
        .then(todo => res.status(200).json({ todo }))
        .catch(next);
});

module.exports = router;
