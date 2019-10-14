const client = require('../helpers/redis');
const express = require('express');
const TodoService = require('../services/TodoService');

const router = express.Router();

router.get('/todo', (req, res, next) => {
    const { db } = req;
    const todoService = new TodoService(db);
    const todoRedisKey = 'todo:items';
    client.get(todoRedisKey, (err, todo) => {
        if (todo) {
            return res.status(200).send({ source: 'cache', data: JSON.parse(todo)});
        } else {
            todoService
              .listTodo()
              .then(todo => {
                  client.setex(todoRedisKey, 10, JSON.stringify(todo));
                  return res.status(200).json({todo})
              })
              .catch(next);
        }
    });
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
