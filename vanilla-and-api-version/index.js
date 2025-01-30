const express = require("express");
const logger = require("morgan");
const path = require('path');

const connectToMongoDb = require("./database/connectToMongoDb");
const Todo = require('./models/Todo');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(logger("dev"));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (_, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/todos', async (_, res) => {
  const todos = await Todo.find({});
  res.json(todos);
});

app.post('/add', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    isComplete: false
  });

  res.json(todo);
});

app.patch('/toggle/:id', async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  todo.isComplete = !todo.isComplete;
  await todo.save();
  res.json(todo);
});

app.delete('/delete/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: 'Todo deleted' });
});

app.patch('/update-text/:id', async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  todo.text = req.body.text;
  await todo.save();
  res.json(todo);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
  connectToMongoDb();
});
