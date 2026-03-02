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

  // Updated link styles
  const linkClass =
    "flex items-center justify-center md:justify-start gap-3 p-3 rounded-lg hover:bg-purple-500 transition";

  const activeClass = "bg-purple-700";

  return (
    <>
      {/* ===== MOBILE TOP BAR ===== */}
      <div className="md:hidden p-4 bg-purple-600 flex justify-between items-center text-white">
        <h1 className="text-lg font-bold">FunLang 🚀</h1>
        <button onClick={() => setOpen(true)}>
          <Menu size={26} />
        </button>
      </div>

      {/* ===== SIDEBAR ===== */}
      <aside
        className={`
          fixed top-0 left-0 z-50 w-20 md:w-64
          h-full
          p-4 md:p-6 text-white
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static
          ${kidMode ? "bg-pink-600" : "bg-purple-600"}
          ${theme === "dark" ? "dark:bg-gray-800" : ""}
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="hidden md:block text-2xl font-bold">
            FunLang 🚀
          </h1>
          <button className="md:hidden" onClick={() => setOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* Links */}
        <nav className="space-y-2">
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
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : ""}`
              }
            >
              <Icon size={20} />
              {/* Hide text on mobile, show on desktop */}
              <span className="hidden md:inline">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Toggles + Logout */}
        <div className="mt-8 space-y-4 text-sm hidden md:block">
          <label className="flex justify-between items-center">
            <span>Kid Mode</span>
            <input type="checkbox" checked={kidMode} onChange={toggleKidMode} />
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
              className="flex items-center gap-2 mt-4 hover:text-red-300"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}