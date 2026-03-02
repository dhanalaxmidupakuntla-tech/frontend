import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar className="hidden md:flex md:flex-col w-64 bg-white dark:bg-gray-800 shadow-lg" />

      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen">
        <Topbar />
        <main className="p-6 md:p-8 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}