# HTMX

Today, we'll be learning about HTMX, a library that allows you to add dynamic behavior to your website without writing any JavaScript. HTMX is a small library that allows you to send requests from the browser to the server and replace only part of user's interface. It's a great way to add a more app-like experience to your website without writing any additional JavaScript.

### What We're Building

We'll be building a simple todo app that allows users to add and delete todos, to mark todos as complete, and to edit their text.

### Starting Point

Here's our `index.js` so far:

```js
const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");

const viewsRouter = require("./routes/viewsRouter");
const connectToMongoDb = require("./database/connectToMongoDb");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use(logger("dev"));

app.use("/", viewsRouter);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
  connectToMongoDb();
});
```

As you can see, we have a simple Express app set up to serve EJS templates. We also have a MongoDB database connection function set up for us.

Here's our Todo model:

```js
const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },

  isComplete: Boolean,
});

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
```

We have two properties of our todo tasks: `text`, a string, and `isComplete`, a boolean.

We also have a couple of views set up for us. Here's our `index.ejs`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>HTMX To-Do List</title>
    <script src="https://unpkg.com/htmx.org"></script>
    <style>
      body {
        font-family: Arial, sans-serif;
      }
      .todo-item {
        margin: 10px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .completed {
        text-decoration: line-through;
        color: gray;
      }
      button {
        margin-left: 10px;
      }
    </style>
  </head>
  <body>
    <h1>To-Do List</h1>
    <div id="todo-list"></div>
  </body>
</html>
```

Our main page has only two elements in the `body`: a heading and a container for our todos.

And then we have a view for a single todo in `todo.ejs`:

``` ejs
<div id="todo-container-<%= todo._id %>" class="todo-item <%= todo.isComplete ? 'completed' : '' %>">
  <span>
    <%= todo.text %>
  </span>
  <div>
    <button>
      Edit
    </button>
    <button>
      Delete
    </button>
  </div>
</div>
```

This one has some template code in it. If you render this file with a todo, it will give you the todo's text, (non-functional) edit and delete buttons, and a class of `completed` if the todo's `.isComplete` property is `true`, which will make it apparent through styling that the todo is done.

### Setting Up Your Database

Before we can really get going, we need data to work with.

- Go to Compass and create a new database called `htmx-todo-app` with a `todos` collection.
- Now grab your connection string and save it to a `.env` file as a value for the `MONGODB_URI` environment variable.
- At the end of the connection string, where it ends with `.net/`, add the database to connect to: `htmx-todo-app`
- Add the JSON data from `models/todos.json` to your `todos` collection in Compass.
- Start or restart your server to see if you get a "MongoDB connected..." message.

### Looking At The Final Version

Now that we have the data working, let's take a look at the final version of the app.

Change the import of the `viewsRouter` in `index.js` to `viewsRouterFinal`:

```js
const viewsRouter = require("./routes/viewsRouterFinal");
```

Now run the server and go to `http://localhost:3000` to see the final version of the app. Let's try out all the features.

As you're doing so, note that the page doesn't reload when you add, delete, or edit a todo. This is because HTMX is handling the requests and responses in the browser, and it's not rendering new pages, but, rather, updating the existing one.

Try the following out:

- Add a new todo by filling out the form at the top.
- Toggle a todo from complete and back by clicking on it.
- Edit a todo by clicking the "Edit" button and changing the text.
- Delete a todo by clicking the "Delete" button.

Check compass afterwards to see if the changes you made in the app are reflected in the database. If you wish, you can reset the data by deleting all the todos in Compass and adding the JSON data from `todos.json` again.

When you're done, **don't forget** to change the import back to `viewsRouter` in `index.js`.

### Rendering Our Todos

Currently, our `viewRouter.js` file has only one route, and it's incomplete:

``` js
router.get("/", async (req, res) => {
  res.render("index", { todos: [] });
});
```

As you can see, we're rendering the `index` view with an empty array of todos. We need to fetch the todos from the database and use EJS to render them to the page.

Let's update the route to fetch the todos from the database and render them to the page:

``` js
router.get("/", async (req, res) => {
  const todos = await Todo.find({});
  res.render("index", { todos });
});
```

