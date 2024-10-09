const express = require('express');

const {
  getTodos,
  createTodo,
  toggleTodo,
  updateText,
  deleteTodo,
} = require('../controllers/todosController')

const router = express.Router();

const handleSuccess = function (res, payload) {
  res.status(200).json({message: 'success', payload})
}

const handleFailure = function (res, error, message) {
  console.log({message, error})
  res.status(500).json({message, error})
}

router.get('/', async function (_, res) {
  try {
    const todos = await getTodos();
    handleSuccess(res, todos);
  } catch (error) {
    handleFailure(res, error, 'Failure getting todos.');
  }
})

router.post('/', async function (req, res) {
  try {
    handleSuccess(res, await createTodo(req.body.text));
  } catch (error) {
    handleFailure(res, error, 'Failure creating a todo.');
  }
})

router.put('/:id', async function (req, res) {
  try {
    handleSuccess(res, await updateText(req.params.id, req.body.text))
  } catch (error) {
    handleFailure(res, error, 'failure updating todo')
  }
})

router.delete('/:id', async function (req, res) {
  try {
    handleSuccess(res, await deleteTodo(req.params.id))
  } catch (error) {
    handleFailure(res, error, 'failure deleting todo')
  }
})

module.exports = router;
