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

const todosRouter = require("./routes/todosRouter");
const viewsRouter = require("./routes/viewsRouter");
const connectToMongoDb = require("./database/connectToMongoDb");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use(logger("dev"));

app.use("/", viewsRouter);
app.use("/api", todosRouter);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
  connectToMongoDb();
});
```

As you can see, we have a simple Express app set up to serve EJS templates and the setup for an API for managing todos. We also have a MongoDB database connection function set up for us.

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
- Start or restart your server to see if you get a "MongoDB connected..." message.
