import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate} from "react-router-dom";

export default function Topbar() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // ?? redirect to login
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center">
      <h2 className="font-semibold text-lg dark:text-white">
        Language Learning Platform
      </h2>

      <div className="flex items-center gap-3">

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