import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import "./App.css";
import Login from "./components/Login";


function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [userId, setUserId] = useState("");
  const [token, setToken] = useState("");
  const socket = useRef();
  useEffect(() => {
    socket.current = io("http://localhost:5000");
    console.log("socket", socket.current);

    //  socket.on('connect',()=>{
    //     console.log('socket connection done');
    //   });
    socket.current.emit("test");
    socket.current.on("test", () => console.log("test event received"));
    const auth = JSON.parse(localStorage.getItem("auth"));
    console.log("auth", auth);
    if (auth) {
      setUserId(auth.user.userId);
      setToken(auth.token);
      
    }
  }, []);
  // useEffect(() => {
  //   // Fetch initial todos
  //   // fetchTodos();

  //   // Listen for real-time updates
  //   socket.on(`todoCreated:${userId}`, (newTodo) => {
  //     setTodos(prevTodos => [...prevTodos, newTodo]);
  //   });

  //   socket.on(`todoUpdated:${userId}`, (updatedTodo) => {
  //     setTodos(prevTodos => prevTodos.map(todo => todo._id === updatedTodo._id ? updatedTodo : todo));
  //   });

  //   socket.on(`todoDeleted:${userId}`, (deletedTodoId) => {
  //     setTodos(prevTodos => prevTodos.filter(todo => todo._id !== deletedTodoId));
  //   });

  //   // Cleanup on unmount
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, [userId]);

  const fetchTodos = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/v1/todos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setTodos(data.todos);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };
  useEffect(() => {
    fetchTodos();
    // Listen for real-time create todo
    //  socket.on(`todoCreated:${userId}`, (newTodo) => {
    //   setTodos(prevTodos => [...prevTodos, newTodo]);
    // });
  }, [token]);

  const createTodoHandler = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/v1/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ todo }),
      });
      const data = await response.json();
      console.log(data);
      // console.log(userId)
      socket.current.emit('todoCreated',data.newTodo)
 
      // if (response.ok) {
      //   setTodos(prevTodos => [...prevTodos, data.newTodo]);
      // } else {
      //   console.error("Failed to create todo");
      // }
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  useEffect(() => {
    socket.current.on(`todoCreated:${userId}`, (newTodo) => {
      // console.log('newTodo',newTodo);
        setTodos(prevTodos => [...prevTodos, newTodo]);
      }
    );
  
    return () => {
      socket.current.off(`todoCreated:${userId}`);
    }
  }, [userId])
  

  // const handleLogout = async () => {
  //   try {
  //     const response = await fetch('/api/auth/logout', {
  //       method: 'POST',
  //       headers: {
  //         'Authorization': token
  //       }
  //     });
  //     if (response.ok) {
  //       // Clear user data and redirect to login page
  //       setToken('');
  //     } else {
  //       console.error('Failed to log out');
  //     }
  //   } catch (error) {
  //     console.error('Error logging out:', error);
  //   }
  // };

  // const handleLogin = async () => {
  //   try {
  //     const response = await fetch('/api/auth/login', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({ email: 'example@example.com', password: 'password' })
  //     });
  //     const data = await response.json();
  //     if (response.ok) {
  //       setToken(data.token);
  //     } else {
  //       console.error('Login failed');
  //     }
  //   } catch (error) {
  //     console.error('Error logging in:', error);
  //   }
  // };
  return (
    <>
      <Login />
      <div>
        {todos?.map((todo) => (
          <div key={todo._id}>
            <h3>{todo?.todo}</h3>
          </div>
        ))}
      </div>

      <h4>create todo</h4>
      <input
        type="text"
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
        placeholder="todo"
      />
      <button onClick={createTodoHandler}>Add Todo</button>
    </>
  );
}

export default App;
