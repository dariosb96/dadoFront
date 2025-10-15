import { Navigate, Outlet } from "react-router-dom";

const Protected_Route = () => {
    const token = localStorage.getItem("token");

    return token ? <Outlet/> : <Navigate to="/" />
}

export default Protected_Route;