const express = require('express');

const router = express.Router();

router.get("/", async (_, res) => {
  res.render("index", { todos: [] });
});

module.exports = router;
