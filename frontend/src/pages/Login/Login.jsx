import { CiFaceSmile } from "react-icons/ci";
import { useState } from "react";
import useTodo from "../../context/TodoContext";
import { Link } from "react-router-dom";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleLogin } = useTodo();
  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(email, password);
    setEmail("");
    setPassword("");
  };
  return (
    <div className="w-2/4 mx-auto py-10 min-h-screen">
      <header className="lg:py-9 py-6 lg:px-14 px-10 rounded-2xl border border-todo-light flex justify-center items-center ">
        <div className="flex lg:gap-40 gap-10 items-center lg:flex-row flex-col">
          <div>
            <div className="text-todo-light">
              <h3 className="font-extrabold text-3xl">Sign In</h3>
              <p className="text-base tracking-[4px] font-ptsans ml-1 mt-2">
                welcome back
              </p>
            </div>
          </div>
          <div className="bg-todo-red size-12 p-14 rounded-full flex justify-center items-center">
            <h2 className="text-todo-dark-secondary text-4xl font-ubuntu font-bold">
              <CiFaceSmile className=" text-8xl" />
            </h2>
          </div>
        </div>
      </header>

      <div className=" my-8  flex justify-center items-center gap-5">
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <input
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type="email"
              placeholder="email"
              className="input input-lg w-full rounded-xl bg-todo-dark-secondary font-quicksand text-lg text-todo-light"
            />
          </div>

          <div>
            <input
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type="password"
              placeholder="password"
              className="input input-lg w-full rounded-xl bg-todo-dark-secondary font-quicksand text-lg text-todo-light"
            />
          </div>
          <div>
            <button className="btn btn-lg w-full bg-todo-red hover:bg-todo-green text-todo-dark-secondary font-quicksand text-2xl font-bold">
              Sign In
            </button>
            <p className="text-todo-light my-4 mx-3">create new account, <Link to="/register" className="text-todo-red">signup here</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}
