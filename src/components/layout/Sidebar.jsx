import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Book,
  Trophy,
  Mic,
  Type,
  LogOut,
} from "lucide-react";
import { useContext } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useKidMode } from "../../context/KidModeContext";
import { AuthContext } from "../../context/AuthContext";

export default function Sidebar() {
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
        h-screen
        w-20 md:w-64
        p-4 md:p-6
        text-white
        flex flex-col
        overflow-hidden
        ${kidMode ? "bg-pink-600" : "bg-purple-600"}
        ${theme === "dark" ? "dark:bg-gray-800" : ""}
      `}
    >
      {/* ===== SCROLLABLE CONTENT ===== */}
      <div className="flex-1 overflow-y-auto pr-1">
        {/* Logo */}
        <div className="mb-6">
          <h1 className="hidden md:block text-2xl font-bold">
            FunLang 🚀
          </h1>
        </div>

        {/* Navigation */}
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
      </div>

      {/* ===== FIXED BOTTOM SECTION ===== */}
      <div className="space-y-3 text-sm pt-4 border-t border-white/20">
        <label className="hidden md:flex justify-between items-center">
          <span>Kid Mode</span>
          <input
            type="checkbox"
            checked={kidMode}
            onChange={toggleKidMode}
          />
        </label>

        <label className="hidden md:flex justify-between items-center">
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
            className="hidden md:flex items-center gap-2 hover:text-red-300"
          >
            <LogOut size={16} />
            Logout
          </button>
        )}
      </div>
    </aside>
  );
}