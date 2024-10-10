const express = require("express");

const Todo = require("../models/Todo");

const router = express.Router();

router.get("/", async function (_, res) {
  const todos = await Todo.find({});
  res.render("indexFinal", { todos: todos });
});

router.post("/add", async function (req, res) {
  if (req.body.text) {
    const todo = await Todo.create({ text: req.body.text, isComplete: false });
    res.render("todoFinal", { todo: todo });
  } else {
    res.send("");
  }
});

router.put("/toggle/:id", async function (req, res) {
  const todo = await Todo.findById(req.params.id);
  todo.isComplete = !todo.isComplete;
  await todo.save();
  res.render("todoFinal", { todo: todo });
});

router.get("/edit-text/:id", async function (req, res) {
  const todo = await Todo.findById(req.params.id);
  res.render("editFinal", { todo: todo });
});

router.put("/update-text/:id", async function (req, res) {
  const todo = await Todo.findByIdAndUpdate(
    req.params.id,
    { text: req.body.text },
    { new: true }
  );

  res.render("todoFinal", { todo: todo });
});

router.delete("/delete/:id", async function (req, res) {
  await Todo.findByIdAndDelete(req.params.id);
  res.send(""); // replace with nothing
});

module.exports = router;
