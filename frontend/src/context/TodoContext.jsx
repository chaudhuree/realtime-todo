import React, { createContext, useState, useContext,useRef ,useEffect} from "react";
import io from "socket.io-client";
import toast from "react-hot-toast";

const TodoContext = createContext();

// Create the provider component
export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [userId, setUserId] = useState("");
  const [token, setToken] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [limit, setLimit] = useState(4);
  const [totalTodos, setTotalTodos] = useState(0);
  const socket = useRef();
  const completedTodos = todos?.filter((todo) => todo.completed)?.length || 0;
  useEffect(() => {
    socket.current = io("https://yourtodo-juvt.onrender.com");
    const auth = JSON.parse(localStorage.getItem("auth"));
    if (auth) {
      setUserId(auth.user.userId);
      setToken(auth.token);
    }
  }, []);
  const LOCALSTORE_KEY = "auth";
  // handle registration
  const handleRegistration = async (email, username, password) => {
    try {
      if (email === "" || username === "" || password === "") {
        toast.error("Please fill all fields");
        return;
      }
      const response = await fetch("https://yourtodo-juvt.onrender.com/api/v1/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          name: username,
          password: password,
        }),
      });
      const data = await response.json();
      if (response.status === 400) {
        toast.error(data.msg);
        return;
      }
      localStorage.setItem(LOCALSTORE_KEY, JSON.stringify(data));
      window.location.href = "/";
      toast.success("Registration successful");
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error("Registration failed");
    }
  };


  // doing ****************************
  const fetchTodos = async (pageNo=1,limit=4) => {
    try {
      const response = await fetch(`https://yourtodo-juvt.onrender.com/api/v1/todos/pagination?page=${pageNo}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      // if(!response.ok){
      //   toast.error(data.msg);
      //   return;
      // }
      setTodos(data.todos);
      setTotalTodos(data.totalTodos);
    } catch (error) {
      console.error("Error fetching todos:", error);
      toast.error("Error fetching todos");
    }
  };
  useEffect(() => {
    fetchTodos( pageNo, limit);
  }, [token,pageNo,limit]);

  const createTodoHandler = async (todo) => {
    try {
      if(todo === ""){
        toast.error("Please fill all fields");
        return;
      }
      if(todo.length < 5){
        toast.error("Todo must be at least 5 characters");
        return;
      }
      const response = await fetch("https://yourtodo-juvt.onrender.com/api/v1/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ todo }),
      });
      const data = await response.json();
      if(!response.ok){
        toast.error(data.msg);
        return;
      }
      socket.current.emit("todoCreated", data.newTodo);
      toast.success("Todo created successfully");
    } catch (error) {
      console.error("Error creating todo:", error);
      toast.error("Error creating todo");
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`https://yourtodo-juvt.onrender.com/api/v1/todo/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if(!response.ok){
        toast.error(data.msg);
        return;
      }
      socket.current.emit("todoDeleted", id , userId);
      toast.success("Todo deleted successfully");
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast.error("Error deleting todo");
    }
  };
  const handleCompleted = async (id) => {
    try {
      const response = await fetch(
        `https://yourtodo-juvt.onrender.com/api/v1/todo/completed/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.msg);
        return;
      }
      socket.current.emit("todoCompleted", data.todo);
      toast.success("Todo updated successfully");
    } catch (error) {
      console.error("Error updating todo:", error);
      toast.error("Error updating todo");
    }
  };
  // update todo
  const updateTodo =async (id,todo)=>{
    try {
      if(todo === ""){
        toast.error("Please fill all fields");
        return;
      }
      if(todo.length < 5){
        toast.error("Todo must be at least 5 characters");
        return;
      }
      const response = await fetch(
        `https://yourtodo-juvt.onrender.com/api/v1/todo/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ todo }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.msg);
        return;
      }
      socket.current.emit("todoUpdated", data.updatedTodo);
      toast.success("Todo updated successfully");
    } catch (error) {
      console.error("Error updating todo:", error);
      toast.error("Error updating todo");
    }
  }

  // socket real time data update
  useEffect(() => {
    socket.current.on(`todoCreated:${userId}`, (newTodo) => {
      // console.log('newTodo',newTodo);
      // setTodos((prevTodos) => [...prevTodos, newTodo]);
      fetchTodos();
    });
    socket.current.on(`todoDeleted:${userId}`, (id) => {
      // setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
      fetchTodos();
    });
    socket.current.on(`todoCompleted:${userId}`, (updatedTodo) => {
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === updatedTodo._id ? updatedTodo : todo
        )
      );
    });
    socket.current.on(`todoUpdated:${userId}`, (updatedTodo) => {
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === updatedTodo._id ? updatedTodo : todo
        )
      );
    });
    return () => {
      socket.current.off(`todoCreated:${userId}`);
      socket.current.off(`todoDeleted:${userId}`);
      socket.current.off(`todoCompleted:${userId}`);
      socket.current.off(`todoUpdated:${userId}`);
    };
  }, [userId]);
  // doing ****************************

  const handleLogin = async (email, password) => {
    try {
      if (email === "" || password === "") {
        toast.error("Please fill all fields");
        return;
      }
      const response = await fetch("https://yourtodo-juvt.onrender.com/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
      });
      const data = await response.json();
      // console.log('data', data);

      if (!response.ok) {
        toast.error(data.msg);
        return;
      }
      localStorage.setItem(LOCALSTORE_KEY, JSON.stringify(data));
      window.location.href = "/";
      toast.success("Login successful");
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error("Login failed");
    }
  };
  const data = {
    handleRegistration,
    handleLogin,
    createTodoHandler,
    todos,
    deleteTodo,
    handleCompleted,
    updateTodo,
    totalTodos,
    completedTodos,
    setPageNo,
  };
  return <TodoContext.Provider value={data}>{children}</TodoContext.Provider>;
};

const useTodo = () => {
  return useContext(TodoContext);
};
export default useTodo;
