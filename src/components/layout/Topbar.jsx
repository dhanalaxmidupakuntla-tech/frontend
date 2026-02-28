import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, NavLink } from "react-router-dom";

export default function Topbar() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [kidsMode, setKidsMode] = useState(false);
  const [celebration, setCelebration] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login"); // 👈 redirect to login
  };

  return (
    <div className="bg-white shadow p-4 flex justify-between items-center">
      {celebration && (
        <div
          className="fixed inset-0 bg-pink-300 flex items-center justify-center text-4xl"
          onClick={() => setCelebration(false)}
        >
          🎊 GREAT JOB! 🎊
        </div>
      )}

      <h2 className="font-semibold text-lg">Language Learning Platform</h2>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setKidsMode(!kidsMode)}
          className="bg-pink-400 text-white px-3 py-1 rounded"
        >
          {kidsMode ? "Normal Mode" : "Kids Mode 🎈"}
        </button>

        <button
          onClick={() => setCelebration(true)}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          Celebrate 🎉
        </button>

        {/* ✅ Logout + NavLink fallback */}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}