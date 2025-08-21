const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Ensure views path
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Array to store todos
let todos = [];

// Home route - display todos
app.get("/", (req, res) => {
  const filter = req.query.priority;
  let filteredTodos = todos;

  if (filter) {
    filteredTodos = todos.filter(todo => todo.priority === filter);
  }

  res.render("index", { todos: filteredTodos });
});

// Add todo
app.post("/add", (req, res) => {
  const { task, priority } = req.body;

  if (!task || task.trim() === "") {
    return res.send("<script>alert('Task cannot be empty!'); window.location='/'</script>");
  }

  todos.push({ id: Date.now(), task, priority });
  res.redirect("/");
});

// Delete todo
app.post("/delete/:id", (req, res) => {
  const id = parseInt(req.params.id);
  todos = todos.filter(todo => todo.id !== id);
  res.redirect("/");
});

// Edit todo page
app.get("/edit/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);
  if (!todo) return res.redirect("/");
  res.render("edit", { todo });
});

// Update todo
app.post("/edit/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { task, priority } = req.body;

  todos = todos.map(t => t.id === id ? { ...t, task, priority } : t);
  res.redirect("/");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
