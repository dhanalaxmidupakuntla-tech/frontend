import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}