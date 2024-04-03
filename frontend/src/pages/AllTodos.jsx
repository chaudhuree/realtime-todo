import { FaPlus } from "react-icons/fa";
import { MdEdit, MdCancel } from "react-icons/md";
import { RiEditCircleLine } from "react-icons/ri";
import { MdDeleteOutline } from "react-icons/md";
import { useState } from "react";
import useTodo from "../context/TodoContext";
import ReactPaginate from 'react-paginate';

export default function AllTodos() {
  const [todo, setTodo] = useState("");
  const [editTodo, setEditTodo] = useState(null);
  const [updatedTodoId, setUpdatedTodoId] = useState(null);
  const {
    createTodoHandler,
    todos,
    deleteTodo,
    handleCompleted,
    updateTodo,
    totalTodos,
    completedTodos,
    setPageNo,
  } = useTodo();
  const handleSubmit = (e) => {
    e.preventDefault();
    createTodoHandler(todo);
    setTodo("");
  };
  const handleToggle = (id) => {
    handleCompleted(id);
  };

  const handleEdit = (id, updatedTodo) => {
    updateTodo(id, updatedTodo);
    setEditTodo(null);
    setUpdatedTodoId(null);
  };
  const handlePageClick = (e) => {
    setPageNo(e.selected + 1)
  }
  return (
    <div className="w-2/4 mx-auto py-10 min-h-screen">
      <header className="lg:py-9 py-6 lg:px-14 px-10 rounded-2xl border border-todo-light flex justify-center items-center ">
        <div className="flex lg:gap-40 gap-10 items-center lg:flex-row flex-col ">
          <div>
            <div className="text-todo-light">
              <h3 className="font-extrabold text-3xl">Todo Done</h3>
              <p className="text-base tracking-[4px] font-ptsans ml-1 mt-2">
                keep it up
              </p>
            </div>
          </div>
          <div className="bg-todo-red size-12 p-14 rounded-full flex justify-center items-center">
            <h2 className="text-todo-dark text-4xl font-ubuntu font-bold">
              {completedTodos}/{totalTodos}
            </h2>
          </div>
        </div>
      </header>

      <form
        onSubmit={handleSubmit}
        className="w-full my-8  flex justify-center items-center gap-5"
      >
        <input
          onChange={(e) => {
            setTodo(e.target.value);
          }}
          value={todo}
          type="text"
          placeholder="write your next task"
          className="input input-md w-[70%] rounded-xl bg-todo-dark-secondary font-quicksand text-sm text-todo-light"
        />
        <button className="bg-todo-red size-10 rounded-full flex justify-center items-center text-todo-dark">
          <FaPlus />
        </button>
      </form>

      <section className="flex flex-col justify-center gap-5">
        {todos?.map((todoItem) => (
          <div
            key={todoItem._id}
            className="flex justify-between items-center py-5 px-4 bg-todo-dark-secondary rounded-xl border border-todo-light"
          >
            <div className="flex items-center gap-5 w-3/4">
              <input
                onChange={() => handleToggle(todoItem._id)}
                checked={todoItem.completed}
                type="checkbox"
                className="checkbox checkbox-sm border-todo-green rounded-full focus:ring-todo-green focus:ring-1 rig-offset-todo-light text-todo-green"
              />

              {updatedTodoId === todoItem._id ? (
                <input
                  type="text"
                  value={editTodo || todoItem.todo}
                  onChange={(e) => setEditTodo(e.target.value)}
                  className="input border border-todo-green input-md  rounded-xl bg-todo-dark-secondary font-quicksand text-sm text-todo-light w-[70%] md:w-3/4 focus:ring-todo-green focus:ring-1 ring-offset-todo-light"
                />
              ) : (
                <p
                  className={`text-todo-light ${
                    todoItem.completed && "line-through"
                  }`}
                >
                  {todoItem.todo}
                </p>
              )}
            </div>
            <div className="flex gap-2 md:gap-5 items-center">
              {updatedTodoId === todoItem._id ? (
                <button
                  onClick={() => handleEdit(todoItem._id, editTodo)}
                  className="bg-todo-green size-7 md:size-10 rounded-full flex justify-center items-center text-todo-dark-secondary md:text-xl text-sm"
                >
                  <MdEdit />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setEditTodo(todoItem.todo);
                    setUpdatedTodoId(todoItem._id);
                  }}
                  className="text-xl text-todo-light"
                >
                  <RiEditCircleLine />
                </button>
              )}

              {updatedTodoId === todoItem._id ? (
                <button
                  onClick={() => setUpdatedTodoId(null)}
                  className="bg-todo-red md:size-10 size-7 rounded-full flex justify-center items-center text-todo-dark-secondary text-sm md:text-xl"
                >
                  <MdCancel />
                </button>
              ) : (
                <button
                  onClick={() => deleteTodo(todoItem._id)}
                  className=" text-xl text-todo-light"
                >
                  <MdDeleteOutline />
                </button>
              )}
            </div>
          </div>
        ))}
      </section>
      {/*
        pagination
      */}

      <div className={`${totalTodos ?"flex justify-center my-5":"hidden"}`}>
        {totalTodos && (
          <ReactPaginate
            pageClassName="page-item"
            pageLinkClassName="page-link"
            breakClassName="page-item"
            breakLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            containerClassName="pagination"
            activeClassName="active"
            marginPagesDisplayed={2}
            breakLabel="..."
            nextLabel=" >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={Math.ceil(Number(totalTodos / 4))}
            previousLabel="< "
          />
        )}
      </div>
    </div>
  );
}
