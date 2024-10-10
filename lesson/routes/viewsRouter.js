const express = require('express');

const Recipe = require("../models/Recipe");

const router = express.Router();

router.get("/", async (req, res) => {
  res.render("index", { recipes: [] });
});

module.exports = router;
