import { Link } from "react-router-dom";
import { Avatar } from "./BlogCard";
import { Logout } from "./Logout";


export const Appbar = () => {
  const userName = localStorage.getItem("userName") || "User";

  return (
    <div className="border-b flex justify-between px-10 py-4">
      <Link
        to={"/blogs"}
        className="flex flex-col justify-center cursor-pointer text-2xl font-bold"
      >        
        InkThoughts
      </Link>

      <div className="flex">
        <Link to={"/publish"}>
          <button
            type="button"
            className="mr-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            New Blog
          </button>
        </Link>
        <Avatar size={"big"} name={userName}/>
        <Logout />
      </div>
      
    </div>
  );
};