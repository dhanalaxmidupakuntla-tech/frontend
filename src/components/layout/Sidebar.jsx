import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Book,
  Trophy,
  Mic,
  Type,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState, useContext } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useKidMode } from "../../context/KidModeContext";
import { AuthContext } from "../../context/AuthContext";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { kidMode, toggleKidMode } = useKidMode();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const linkClass =
    "flex items-center justify-center md:justify-start gap-3 p-3 rounded-lg hover:bg-purple-500 transition";

  const activeClass = "bg-purple-700";

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen z-50
        w-20 md:w-64
        p-4 md:p-6
        text-white
        transition-all duration-300
        ${kidMode ? "bg-pink-600" : "bg-purple-600"}
        ${theme === "dark" ? "dark:bg-gray-800" : ""}
      `}
    >
      {/* ===== MENU ICON (Top) ===== */}
      <div className="flex justify-center md:justify-between items-center mb-8">
        {/* Mobile: show only menu icon */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Title */}
        <h1 className="hidden md:block text-2xl font-bold">
          FunLang 🚀
        </h1>
      </div>

      {/* ===== NAVIGATION ===== */}
      <nav className="space-y-3">
        {[
          ["/", Home, "Dashboard"],
          ["/lessons", Book, "Lessons"],
          ["/flashcards", Book, "Flashcards"],
          ["/speaking", Mic, "Speaking"],
          ["/game", Book, "Game"],
          ["/leaderboard", Trophy, "Leaderboard"],
          ["/achievements", Trophy, "Achievements"],
          ["/ai", Mic, "AI Tutor"],
          ["/alphabet", Type, "Alphabet"],
          ["/quiz", Type, "Quiz"],
        ].map(([path, Icon, label]) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            <Icon size={22} />
            <span className="hidden md:inline">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* ===== Bottom Section (Desktop only) ===== */}
      <div className="absolute bottom-6 left-0 w-full px-4 hidden md:block">
        <div className="space-y-3 text-sm">
          <label className="flex justify-between items-center">
            <span>Kid Mode</span>
            <input
              type="checkbox"
              checked={kidMode}
              onChange={toggleKidMode}
            />
          </label>

          <label className="flex justify-between items-center">
            <span>Dark Mode</span>
            <input
              type="checkbox"
              checked={theme === "dark"}
              onChange={toggleTheme}
            />
          </label>

          {user && (
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="flex items-center gap-2 hover:text-red-300"
            >
              <LogOut size={16} />
              Logout
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}