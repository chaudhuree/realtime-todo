const express =require("express");

const router = express.Router();

// middlewares
const {authenticated,admin}= require("../middleware/authentication.js") ;
const {testUser}= require("../middleware/testUser.js") ;

const {
  getTodos,
  getTodo,
  getTodosWithPagination,
  createTodo,
  updateTodo,
  deleteTodo,
  deleteAllTodos,
  getCompletedTodos,
  getIncompletedTodos,
  toggleCompleted
} =require("../controllers/todo.js");

router.get("/todos", authenticated, getTodos);
router.get("/todos/pagination", authenticated, getTodosWithPagination);
router.get("/todos/completed", authenticated, getCompletedTodos);
router.get("/todos/incompleted", authenticated, getIncompletedTodos);

router.post("/todos", authenticated, createTodo);
router.delete("/todos", authenticated, deleteAllTodos);

router.get("/todo/:id", authenticated, getTodo);
router.put("/todo/:id", authenticated, updateTodo);
router.put("/todo/completed/:id", authenticated, toggleCompleted);
router.delete("/todo/:id", authenticated, deleteTodo);

module.exports= router;