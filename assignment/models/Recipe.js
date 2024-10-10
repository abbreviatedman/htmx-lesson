const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  cookingTime: {
    type: Number,
    required: true,
  },

  prepTime: {
    type: Number,
    required: true,
  },

  servings: {
    type: Number,
    required: true,
  },

  ingredients: [String],
  instructions: [String],
});

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
