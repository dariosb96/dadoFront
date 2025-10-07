import Navbar from "../components/NavBar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
    return (
        <div className="flex">
            <div className="flex-1">
                <Navbar/>
                <main className="p-4">
                <Outlet/>
                </main>
            </div>
        </div>
    )
};

export default DashboardLayout;
