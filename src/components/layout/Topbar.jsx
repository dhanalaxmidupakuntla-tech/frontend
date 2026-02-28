import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Topbar() {
  const { logout } = useContext(AuthContext);
  const [kidsMode, setKidsMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="bg-white shadow p-4 flex justify-between items-center">
      <h2 className="font-semibold text-lg">Language Learning Platform</h2>
      
      <button
        onClick={() => setKidsMode(!kidsMode)}
        className="bg-pink-400 text-white px-3 py-1 rounded mr-3"
      >
        {kidsMode ? "Normal Mode" : "Kids Mode 🎈"}
      </button>

      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}