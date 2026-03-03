import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const Protected_Route = () => {
  const token = useSelector(state => state.auth.token);
  return token ? <Outlet /> : <Navigate to="/" />;
};

export default Protected_Route;