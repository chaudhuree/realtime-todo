import { BiLogIn } from "react-icons/bi";
import { Link } from "react-router-dom";

export default function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem("auth");
    window.location.reload();
  };
  return (
    <div className="navbar">
      <div className="flex-1">
        <Link to="/" className=" text-xl lg:text-2xl text-todo-light">
          YOUR<span className="text-todo-red">TODO</span>
        </Link>
      </div>
      <div onClick={handleLogout} className="flex-none text-todo-light text-xl lg:text-3xl hover:text-todo-red delay-100 ">
        <BiLogIn />
      </div>
    </div>
  );
}
