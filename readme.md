# HTMX

Today, we'll be learning about HTMX, a library that allows you to add dynamic behavior to your website without writing any JavaScript. HTMX is a small library that allows you to send requests from the browser to the server and replace only part of a user's interface. It's a great way to add a more app-like experience to your website without writing any additional JavaScript.

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

app.listen(3000, function () {
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

But, very importantly, it has all of the JavaScript included from the HTMX CDN. This is what allows us to use HTMX in our app. We're not going to have to write any JavaScript in the browser ourselves--HTMX will handle all of that for us. We just have to use their HTML attributes, as you'll see in a moment.

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
router.get("/", async function (req, res) {
  res.render("index", { todos: [] });
});
```

As you can see, we're rendering the `index` view with an empty array of todos. We need to fetch the todos from the database and use EJS to render them to the page.

Let's update the route to fetch the todos from the database and render them to the page. Don't forget to change the empty array you're rendering to the actual todos you're fetching from the database.

``` js
router.get("/", async function (req, res) {
  const todos = await Todo.find({});
  res.render("index", { todos: todos });
});
```

Back in our `index.ejs`, we need to render the todos to the page. We can do this by looping through the `todos` array and rendering the `todo.ejs` view for each todo.

Right now, the todo list container looks like this:

``` ejs
<div id="todo-list"></div>
```

We need to update it to render the todos. Here's how you can do it:

``` ejs
<div id="todo-list">
    <% todos.forEach((todo) => { %>
        <%- include('todo', { todo: todo}) %>
    <% }); %>
</div>
```

What this code does is loop through the `todos` array and render the `todo.ejs` view for each todo. The `todo` object is passed to the view as a variable.

This is known as Component Architecture--we're breaking down our UI into smaller components that can be reused. More complex frameworks like React and Vue use this concept extensively, but it's helpful to modularize your UI no matter what framework you're using.

Restart your server and **reload the page**. You should see the todos rendered to the UI.

### Writing Our First HTMX Code: Toggling Todos

Now that we have our todos rendering to the page, let's add some interactivity to our app. We'll start by adding the ability to toggle a todo from complete to incomplete and back.

We'll use HTMX to send a request to the server when a user clicks on a todo. The server will then update the todo in the database and send back the updated todo to the client. HTMX will then update the UI with the new todo.

Right now, our `todo.ejs` view looks like this:

``` ejs
<span>
  <%= todo.text %>
</span>
```

We need to add an `hx-put` attribute to the `span` element. This attribute tells HTMX to send a PUT request to the server when the element is clicked. By setting it to `/toggle/<%= todo._id %>`, we're telling HTMX to send a PUT request to `/toggle/:id`. We'll set up a route in our Express app to handle this request.

Add that `hx-put` attribute to the `span` element in `todo.ejs` now:

``` ejs
<span
  hx-put="/toggle/<%= todo._id%>"
>
  <%= todo.text %>
</span>
```

The next step is to set up a route in our Express app to handle the PUT request. We'll update the `viewsRouter.js` file to add a new route that toggles a todo's `isComplete` property.

```js
router.put("/toggle/:id", async function (req, res) {
  const todo = await Todo.findById(req.params.id);
  todo.isComplete = !todo.isComplete;
  await todo.save();
});
```

Now we'll tell HTMX to send back some HTML (via EJS) to the client, but we will _not_ be rendering a new page. Instead, we'll be sending back _just_ the part of the page that needs to be updated. This is a key feature of HTMX--it allows you to update parts of the page without reloading the entire page.

Let's add one more line, rendering the `todo` partial with our updated todo object.

```js
router.put("/toggle/:id", async function (req, res) {
  const todo = await Todo.findById(req.params.id);
  todo.isComplete = !todo.isComplete;
  await todo.save();
  res.render("todo", { todo: todo });
});
```

Now, when a user clicks on a todo, HTMX will send a PUT request to the server, the server will update the todo in the database, and then send back the updated todo to the client. HTMX will then update the UI with the new todo.

But we do need to make one more change: we need to tell HTMX where to update the UI with the new todo. We can do this by adding an `hx-target` attribute to the `span` element. This attribute tells HTMX to take the new HTML sent back by the server and apply it to that target. We'll set it to the container div for the current todo (the `div` at the top of `todo.ejs`), which we get using the id `todo-container-[id]`, where `[id]` is the ID from MongoDB for that todo.

In `todo.js`, the `span` should now be:

``` ejs
<span
  hx-put="/toggle/<%= todo._id%>"
  hx-target="#todo-container-<%= todo._id %>"
  hx-swap="outerHTML"
>
  <%= todo.text %>
</span>
```

These three attributes together tell HTMX that when the `span` element is clicked, it should send a PUT request to `/toggle/:id` (`hx-put`), update the element with the `id` specified in `hx-target` with the new HTML sent back by the server, and replace the _entire element_ with the new HTML (`hx-swap="outerHTML"`).

Reload the page and try clicking on todos. You should see each todo's text change from normal to strikethrough and back. Each time, a network request is sent to the server, the todo is updated in the database, and the UI is updated with the new todo.

Note that our URL doesn't change in the browser when we click on a todo. This is because HTMX is handling the requests and responses in the browser, and it's not rendering new pages, but, rather, updating the existing one.

Watch the output from Morgan in your terminal to see the PUT requests being made.

### Adding New Todos

Now that we have the ability to toggle todos, let's add the ability to add new todos to our app.

We'll use HTMX to send a POST request to the server when a user submits the form at the top of the page. The server will then create a new todo in the database and send back the new todo to the client. HTMX will then update the UI with the new todo.

Add this form to the `index.ejs` file, above the todo list container.

``` ejs
<form hx-post="/add" hx-target="#todo-list" hx-swap="beforeend">
  <input type="text" name="text" placeholder="Add a new todo..." required />
  <button type="submit">Add</button>
</form>
```

This form has an `hx-post` attribute that tells HTMX to send a POST request to the server when the form is submitted. The `hx-target` attribute tells HTMX to update the element with the `id` specified--in this case, the todo list container--with the new HTML sent back by the server. For the `hx-swap` attribute, we previously used `outerHTML`, which replaces the entire target element. Here, we're using `beforeend`, which appends the new HTML to the end of the target element.

In our case, that means that the `ul` with the todos will be updated with the new `todo` at the end of the list.

Here's the route in `viewsRouter.js` that handles the POST request:

``` js
router.post("/add", async function (req, res) {
  if (req.body.text) {
    const todo = await Todo.create({ text: req.body.text, isComplete: false });
    res.render("todo", { todo: todo });
  } else {
    res.send("");
  }
});
```

It uses EJS to render the `todo` partial with the new todo object. If the request body doesn't have a `text` property, it sends back an empty string, which means that nothing will be added to the page. Note also that the `isComplete` property is set to `false` by default--if a todo was already completed, it wouldn't be a thing we needed to do!

### Deleting A Todo

Right now, we have a delete button on each `todo` (in `todo.js`), but it doesn't do anything:

``` ejs
<button>
  Delete
</button>
```

Let's add some HTMX attributes to it so that, when clicked, it will send a DELETE request and remove the todo from the database and the UI.

``` ejs
<button
  hx-delete="/delete/<%= todo._id %>"
  hx-target="#todo-container-<%= todo._id %>"
  hx-swap="outerHTML"
>
  Delete
</button>
```

This is extremely similar to the `hx-put` attribute we used earlier. The `hx-delete` attribute tells HTMX to send a DELETE request to the server when the button is clicked. The `hx-target` attribute tells HTMX to update the element with the `id` specified with the new HTML sent back by the server. The `hx-swap` attribute tells HTMX to replace the entire element with the new HTML.

Let's take a look at what the corresponding route in `viewsRouter.js` looks like:

``` js
router.delete("/delete/:id", async function (req, res) {
  await Todo.findByIdAndDelete(req.params.id);
});
```

The first line in our callback function deletes the todo from the database. Let's add a line to replace the deleted todo on the UI with some HTML. What should we send back to the client when a todo is deleted? An empty string, because we don't want to show anything in place of the deleted todo.

```js
router.delete("/delete/:id", async function (req, res) {
  await Todo.findByIdAndDelete(req.params.id);
  res.send(""); // replace with nothing, aka delete it
});
```

Now clicking the delete button on a todo will send a DELETE request to the server, the server will delete the todo from the database, and then send back an empty string to the client. HTMX will then update the UI by replacing its `hx-target` element (the todo) with what it got back (an empty string), removing the todo from the UI.

### Editing A Todo's Text

The last feature we'll add to our app is the ability to edit a todo's text.

Let's work in the opposite order with this one. First, let's create a route handler in `viewsRouter.js` that will handle the PUT request when a user edits a todo's text.

First, it will grab the todo from the database:

``` js
router.get("/edit-text/:id", async function (req, res) {
  const todo = await Todo.findById(req.params.id);
});
```

Then, we'll render the `edit.ejs` view with the todo object. This will replace the current todo with an input field where the user can edit the todo's text.

``` js
router.get("/edit-text/:id", async function (req, res) {
  const todo = await Todo.findById(req.params.id);
  res.render("edit", { todo: todo });
});
```

Let's update `todo.ejs` so that its edit button sends a GET request to `/edit-text/:id` when clicked. We'll also add an `hx-target` attribute pointing to the `div` element that contains the todo. And finally, an `hx-swap` setting of `"outerHTML" tells HTMX to replace that `div` in its entirety with the new HTML sent back by the server.

``` ejs
<button
  hx-get="/edit-text/<%= todo._id %>"
  hx-target="#todo-container-<%= todo._id %>"
  hx-swap="outerHTML"
>
  Edit
</button>
```

We use a GET request here because we're not changing anything in the database--we're just rendering a new view with the todo's text in an input field. When they submit the form, that's when we'll send our PUT request to update the todo's text in the database.

So now we have a route that renders the `edit.ejs` view with the todo object. Let's create the `edit.ejs` view now.

What we want is an input box populated with the current todo's text, and a submit button that will send a PUT request to the server to update the todo's text in the database (and replace the `edit.ejs` view with the `todo.ejs` view).

Edit the (blank) `edit.ejs` view to look like this:

``` ejs
<form hx-put="/update-text/<%= todo._id %>" hx-swap="outerHTML">
  <input type="text" name="text" value="<%= todo.text %>" required>
  <button type="submit">Save</button>
</form>
```

Now when you click the Edit button, you'll see the todo's text in an input field.

What we need now is a route handler to do something with a PUT to `/update-text/:id`. Let's add a route that updates the todo's text in the database and renders the `todo.ejs` view with the updated todo object.

Back in `viewsRouter.js`, add the following code:

``` js
router.put("/update-text/:id", async function (req, res) {
  const todo = await Todo.findByIdAndUpdate(
    req.params.id,
    { text: req.body.text },
    { new: true }
  );
});
```

Now we need to render the `todo.ejs` view with the updated todo object. This will replace the `edit.ejs` view with the updated `todo.ejs` view.

``` js
router.put("/update-text/:id", async function (req, res) {
  const todo = await Todo.findByIdAndUpdate(
    req.params.id,
    { text: req.body.text },
    { new: true }
  );

  res.render("todo", { todo: todo });
});
```

Give it a try. Click the Edit button on a todo, change the text, and click Save. The todo's text should update in the UI.

### Conclusion

HTMX is a powerful library that allows you to add dynamic behavior to your website without writing any JavaScript for the browser. All of the `document.createElement` and `document.querySelector` and `fetch` calls are being handled by the library. It's a great way to add a more app-like experience to your website without writing any additional JavaScript. For many web apps, and perhaps _most_ web apps, HTMX is all you need!
