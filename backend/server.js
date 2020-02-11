const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const todoRoutes = express.Router();
const PORT = 4000;
const dotenv = require('dotenv');

dotenv.config({ path: '../config.env' });

let Todo = require("./todo.model");

app.use(cors());
app.use(bodyParser.json());
// app.use(bodyParser.json({ type: 'application/*+json' }))

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(
  DB,
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const connection = mongoose.connection;

// zrbIOsuXHZBHKHOZ

connection.once("open", function() {
  console.log("MongoDB database connection established successfully");
});

todoRoutes.route("/").get(function(req, res) {
  Todo.find(function(err, todos) {
    if (err) {
      console.log(err);
    } else {
      res.json(todos);
    }
  });
});

todoRoutes.route("/:id").get(function(req, res) {
  let id = req.params.id;
  Todo.findById(id, function(err, todo) {
    res.json(todo);
  });
});

todoRoutes.route("/update/:id").post(function(req, res) {
  Todo.findById(req.params.id, function(err, todo) {
    if (!todo) res.status(404).send("data is not found");
    else todo.todo_description = req.body.todo_description;
    todo.todo_responsible = req.body.todo_responsible;
    todo.todo_priority = req.body.todo_priority;
    todo.todo_completed = req.body.todo_completed;

    todo
      .save()
      .then(todo => {
        res.json("Todo updated!");
      })
      .catch(err => {
        res.status(400).send("Update not possible");
      });
  });
});

// todoRoutes.route("/delete/:id").delete(function(req, res) {
//     // console.log(req.params.id)
//   Todo.findByIdAndDelete(req.params.id, function(err, todo) {
//     if (!todo) res.status(404).send("data is not found");
//     else
//     res.json("Todo deleted!");
//   }).catch(err => {
//     res.status(400).send("delete not possible");
//   });
// });

todoRoutes
    .route('/delete/:id')
    .delete( (req, res) => {
        // console.log("request: ", req)
        // console.log("response: ", res)
        Todo.findById(req.params.id)
            .then(todo => todo.remove().then(() => res.json({ success: true })))
            .catch(err => res.status(404).json({ success: false }));
    });

todoRoutes.route("/add").post(function(req, res) {
  console.log(req.body);
  let todo = new Todo(req.body);
  todo
    .save()
    .then(todo => {
      res.status(200).json({ todo: "todo added successfully" });
    })
    .catch(err => {
      res.status(400).send("adding new todo failed");
    });
});

app.use("/todos", todoRoutes);

app.listen(PORT, function() {
  console.log("Server is running on Port: " + PORT);
});
