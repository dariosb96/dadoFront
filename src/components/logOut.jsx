import { useDispatch } from "react-redux";
import { logout } from "../Redux/actions/Auth/login";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

const LogOutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/"); 
  };

  return   <button
  onClick={handleLogout}
  className="bg-transparent border-none p-0 m-0 cursor-pointer text-white hover:text-purple-300"
  title="Cerrar sesión"
>
  <LogOut className="w-5 h-5 text-white hover:text-red-600" />
</button>




};

export default LogOutButton;