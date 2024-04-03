import "./App.css";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import AllTodos from "./pages/AllTodos";
import Registration from "./pages/registration/Registration";
import Login from "./pages/Login/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    if (auth) {
      setUser(auth.user);
    }
  }, []);
  return (
    <div className=" bg-todo-dark font-quicksand font-bold min-h-screen">
      <div className="container mx-auto">
        <Router>
          <Navbar />
          <Routes>
            {user ? (
              <>
                <Route path="/" element={<AllTodos />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Registration />} />
              </>
            )}

          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
