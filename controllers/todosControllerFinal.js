const Todo = require("../models/Todo");

const getTodos = async function () {
  try {
    const todos = await Todo.find({});

    return todos;
  } catch (error) {
    throw error;
  }
};

const createTodo = async function (text) {
  try {
    const todo = await Todo.create({ text, isComplete: false });

    return todo;
  } catch (error) {
    throw error;
  }
};

const toggleTodo = async function (id) {
  try {
    const todo = await Todo.findById(id);
    todo.isComplete = !todo.isComplete;
    await todo.save();

    return todo;
  } catch (error) {
    throw error;
  }
};

const updateText = async function (id, text) {
  try {
    const todo = await Todo.findByIdAndUpdate(id, { text }, { new: true });

    return todo;
  } catch (error) {
    throw error;
  }
};

const deleteTodo = async function (id) {
  try {
    const todo = await Todo.findByIdAndDelete(id);

    return todo;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getTodos,
  createTodo,
  toggleTodo,
  updateText,
  deleteTodo,
};
