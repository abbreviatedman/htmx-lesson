const express = require('express');

const {
  getTodos,
  createTodo,
  toggleTodo,
  updateText,
  deleteTodo,
} = require('../controllers/todosController')

const router = express.Router();

router.get("/", async (_, res) => {
  const todos = await getTodos();
  res.render("index", { todos: todos });
});

router.post("/add", async (req, res) => {
  if (req.body.text) {
    const todo = await createTodo(req.body.text);
    res.render("todo", { todo: todo });
  } else {
    res.status(204).send('');
  }
});

router.put("/toggle/:id", async (req, res) => {
  const todo = await toggleTodo(req.params.id);
  res.render("todo", { todo: todo });
});

router.get("/edit-text/:id", async (req, res) => {
  const todo = await getTodo(req.params.id);
  res.render("edit", { todo: todo });
});

router.put("/update-text/:id", async (req, res) => {
  const todo = await updateText(req.params.id, req.body.text);
  res.render("todo", { todo: todo });
});

router.delete("/delete/:id", async (req, res) => {
  await deleteTodo(req.params.id);
  res.send(""); // replace with nothing
});

module.exports = router;
