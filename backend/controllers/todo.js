const Todo = require("../models/Todo");

// get all todos
exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id });
    res.status(200).json({ todos });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get todo
exports.getTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(200).json({ todo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get all todos with pagination
exports.getTodosWithPagination = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 4;
  try {
    const todos = await Todo.find({ user: req.user._id })
      .limit(limit)
      .skip(limit * (page - 1)).sort({createdAt: -1});
    const totalTodos = await Todo.countDocuments({ user: req.user._id });
    res.status(200).json({ todos, totalTodos, page, limit});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// create todo
exports.createTodo = async (req, res) => {
  const { todo } = req.body;
  if (!todo) {
    return res.status(400).json({ msg: "Please provide todo" });
  }
  try {
    const newTodo = await Todo.create({ todo, user: req.user._id });

    res.status(201).json({ newTodo });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// update todo
exports.updateTodo = async (req, res) => {
  const { todo } = req.body;
  if (!todo) {
    return res.status(400).json({ message: "Please provide todo" });
  }
  try {
    let updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { todo },
      { new: true }
    );
    if (!updatedTodo) {
      return res.status(404).json({ msg: "Todo not found" });
    }
    res.status(200).json({ updatedTodo });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// toggle completed
exports.toggleCompleted = async (req, res) => {
  try {
    let todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ msg: "Todo not found" });
    }
    todo.completed = !todo.completed;
    await todo.save();
    res.status(200).json({ todo });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// delete todo
exports.deleteTodo = async (req, res) => {
  try {
    if (!req.params.id)
      return res.status(400).json({ msg: "no todo found with this id" });
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    if (!deletedTodo) {
      return res.status(404).json({ msg: "Todo not found" });
    }
    res.status(200).json({ deletedTodo });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// delete all todos
exports.deleteAllTodos = async (req, res) => {
  try {
    await Todo.deleteMany({ user: req.user._id });
    res.status(200).json({ msg: "All todos deleted" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// get completed todos
exports.getCompletedTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id, completed: true });
    res.status(200).json({ todos });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// get incompleted todos
exports.getIncompletedTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id, completed: false });
    res.status(200).json({ todos });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
