# HTMX

### Step 1: Initialize the Project

Open your terminal and create a new project directory:

```bash
mkdir htmx-recipe-organizer
cd htmx-recipe-organizer
```

### Step 2: Initialize a New Node.js Project

Run the following command to initialize a new Node.js project:

```bash
npm init -y
```

### Step 3: Install Dependencies

Install Express, Mongoose, EJS, and Body-Parser:

```bash
npm install express mongoose ejs body-parser
```

### Step 4: Create Recipe Database

``` json
[
    {
        "name": "Spaghetti Bolognese",
        "ingredients": [
            "400g spaghetti",
            "2 tbsp olive oil",
            "1 onion, diced",
            "2 garlic cloves, minced",
            "400g ground beef",
            "800g canned tomatoes",
            "2 tbsp tomato paste",
            "1 tsp dried oregano",
            "1 tsp dried basil",
            "Salt and pepper to taste"
        ],
        "steps": [
            "Cook spaghetti according to package instructions.",
            "Heat olive oil in a large pan over medium heat.",
            "Add diced onion and minced garlic; cook until softened.",
            "Add ground beef and cook until browned.",
            "Stir in canned tomatoes and tomato paste.",
            "Add dried oregano and basil, then season with salt and pepper.",
            "Simmer for 20 minutes, stirring occasionally.",
            "Serve sauce over spaghetti."
        ],
        "favorite": true
    },
    {
        "name": "Chicken Caesar Salad",
        "ingredients": [
            "2 chicken breasts",
            "1 romaine lettuce",
            "50g Parmesan cheese, grated",
            "100g croutons",
            "Caesar dressing"
        ],
        "steps": [
            "Grill or bake the chicken breasts until fully cooked.",
            "Chop the romaine lettuce and place it in a large bowl.",
            "Slice the cooked chicken and add to the bowl.",
            "Sprinkle grated Parmesan and croutons over the top.",
            "Drizzle with Caesar dressing and toss to combine."
        ],
        "favorite": false
    },
    {
        "name": "Classic Margherita Pizza",
        "ingredients": [
            "1 pizza dough",
            "200g tomato sauce",
            "150g mozzarella cheese, sliced",
            "Fresh basil leaves",
            "Olive oil",
            "Salt"
        ],
        "steps": [
            "Preheat oven to 220°C (430°F).",
            "Roll out pizza dough on a floured surface.",
            "Spread tomato sauce evenly over the dough.",
            "Top with mozzarella slices.",
            "Bake in preheated oven for 10-12 minutes, until crust is golden and cheese is bubbly.",
            "Remove from oven, add fresh basil leaves, and drizzle with olive oil and a pinch of salt.",
            "Serve immediately."
        ],
        "favorite": true
    },
    {
        "name": "Tacos",
        "ingredients": [
            "8 small tortillas",
            "200g ground beef",
            "1 onion, diced",
            "2 garlic cloves, minced",
            "1 tsp chili powder",
            "1 tsp cumin",
            "Salt and pepper to taste",
            "Shredded lettuce",
            "Diced tomatoes",
            "Grated cheese",
            "Sour cream",
            "Salsa"
        ],
        "steps": [
            "Cook ground beef in a pan over medium heat until browned.",
            "Add diced onion and minced garlic; cook until softened.",
            "Stir in chili powder, cumin, salt, and pepper.",
            "Warm tortillas in a dry pan or microwave.",
            "Assemble tacos with beef mixture, shredded lettuce, diced tomatoes, grated cheese, sour cream, and salsa.",
            "Serve immediately."
        ],
        "favorite": false
    },
    {
        "name": "Vegetable Stir-Fry",
        "ingredients": [
            "2 tbsp vegetable oil",
            "1 bell pepper, sliced",
            "1 carrot, julienned",
            "1 zucchini, sliced",
            "1 broccoli head, cut into florets",
            "2 tbsp soy sauce",
            "1 tbsp hoisin sauce",
            "1 garlic clove, minced",
            "Cooked rice"
        ],
        "steps": [
            "Heat vegetable oil in a large pan or wok over high heat.",
            "Add garlic and cook until fragrant.",
            "Add bell pepper, carrot, zucchini, and broccoli; stir-fry until tender-crisp.",
            "Stir in soy sauce and hoisin sauce.",
            "Serve over cooked rice."
        ],
        "favorite": false
    }
]
```

### Step 4: Create the Server File

Create a file named `index.js` in your project directory. Add the following code to set up the Express server:

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Recipe = require('./models/Recipe'); // You'll create this model in the next step.

const app = express();

mongoose.connect('mongodb://localhost:27017/recipeorganizer', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
```

### Step 6: Create the Views Directory

Create a `views` directory in your project:

```bash
mkdir views
```

### Step 7: Define the Main Template (`index.ejs`)

Create `index.ejs` with the following content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTMX Recipe Organizer</title>
    <script src="https://unpkg.com/htmx.org"></script>
    <style>
        body { font-family: Arial, sans-serif; }
        .recipe-item { margin: 10px 0; display: flex; justify-content: space-between; align-items: center; }
        .favorite { color: gold; }
        button { margin-left: 10px; }
    </style>
</head>
<body>
    <h1>Recipe Organizer</h1>
    <form hx-post="/add" hx-target="#recipe-list" hx-swap="beforeend">
        <input type="text" name="name" placeholder="Recipe name..." required>
        <input type="text" name="ingredients" placeholder="Ingredients (comma separated)" required>
        <input type="text" name="steps" placeholder="Steps (comma separated)" required>
        <button type="submit">Add</button>
    </form>
    <div id="recipe-list">
        <% recipes.forEach((recipe, index) => { %>
            <%- include('recipe', { recipe: recipe, index: index }) %>
        <% }); %>
    </div>
</body>
</html>
```

### Step 8: Define the Recipe Item Template (`recipe.ejs`)

Create `recipe.ejs` with the following content:

```html
<div class="recipe-item <%= recipe.favorite ? 'favorite' : '' %>" hx-put="/toggle/<%= index %>" hx-swap="outerHTML">
    <span><%= recipe.name %></span>
    <div>
        <button hx-get="/edit/<%= index %>" hx-target="#recipe-item-<%= index %>" hx-swap="outerHTML">Edit</button>
        <button hx-post="/delete/<%= index %>" hx-swap="outerHTML">Delete</button>
    </div>
</div>
```

### Step 9: Define the Edit Form Template (`edit.ejs`)

Create `edit.ejs` with the following content:

```html
<form hx-put="/update/<%= index %>" hx-target="#recipe-item-<%= index %>" hx-swap="outerHTML">
    <input type="text" name="name" value="<%= recipe.name %>" required>
    <input type="text" name="ingredients" value="<%= recipe.ingredients.join(', ') %>" required>
    <input type="text" name="steps" value="<%= recipe.steps.join(', ') %>" required>
    <button type="submit">Save</button>
</form>
```

### Step 10: Set Up Routes for CRUD Operations

##### Step 10.1: Add the Get Route for Displaying Recipes

Update `index.js` to include the following route:

```javascript
app.get('/', async (req, res) => {
    const recipes = await Recipe.find({});
    res.render('index', { recipes: recipes });
});
```

##### Step 10.2: Add the Post Route for Adding a Recipe

Update `index.js` to include the following route:

```javascript
app.post('/add', async (req, res) => {
    const name = req.body.name;
    const ingredients = req.body.ingredients.split(',').map(item => item.trim());
    const steps = req.body.steps.split(',').map(item => item.trim());
    if (name && ingredients.length && steps.length) {
        const newRecipe = new Recipe({ name, ingredients, steps });
        await newRecipe.save();
        res.render('recipe', { recipe: newRecipe, index: newRecipe._id });
    } else {
        res.status(204).send();
    }
});
```

##### Step 10.3: Add the Put Route for Toggling Recipe Favorite Status

Update `index.js` to include the following route:

```javascript
app.put('/toggle/:id', async (req, res) => {
    const id = req.params.id;
    const recipe = await Recipe.findById(id);
    if (recipe) {
        recipe.favorite = !recipe.favorite;
        await recipe.save();
        res.render('recipe', { recipe: recipe, index: id });
    } else {
        res.status(404).send();
    }
});
```

##### Step 10.4: Add the Get Route for Editing a Recipe

Update `index.js` to include the following route:

```javascript
app.get('/edit/:id', async (req, res) => {
    const id = req.params.id;
    const recipe = await Recipe.findById(id);
    if (recipe) {
        res.render('edit', { recipe: recipe, index: id });
    } else {
        res.status(404).send();
    }
});
```

##### Step 10.5: Add the Put Route for Updating a Recipe

Update `index.js` to include the following route:

```javascript
app.put('/update/:id', async (req, res) => {
    const id = req.params.id;
    const recipe = await Recipe.findById(id);
    const ingredients = req.body.ingredients.split(',').map(item => item.trim());
    const steps = req.body.steps.split(',').map(item => item.trim());
    if (recipe) {
        recipe.name = req.body.name;
        recipe.ingredients = ingredients;
        recipe.steps = steps;
        await recipe.save();
        res.render('recipe', { recipe: recipe, index: id });
    } else {
        res.status(404).send();
    }
});
```

##### Step 10.6: Add the Post Route for Deleting a Recipe

Update `index.js` to include the following route:

```javascript
app.post('/delete/:id', async (req, res) => {
    const id = req.params.id;
    await Recipe.findByIdAndDelete(id);
    res.status(204).send(); // No content
});
```

### Step 11: Run the Server

In your terminal, run:

```bash
node index.js
```
