const express = require('express');

const Todo = require("../models/Todo");

const router = express.Router();

router.get("/", async (req, res) => {
  res.render("index", { todos: [] });
});

module.exports = router;
