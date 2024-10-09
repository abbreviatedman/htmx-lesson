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
