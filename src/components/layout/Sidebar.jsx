import { NavLink } from "react-router-dom";
import { Home, Book, Trophy, Mic } from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  const linkClass =
    "flex items-center gap-2 p-2 rounded hover:bg-purple-500 transition";

  const activeClass = "bg-purple-700";

  return (
    <>
      {/* Mobile Button */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden p-3 bg-purple-600 text-white"
      >
        ☰
      </button>

      <div
        className={`bg-purple-600 text-white w-64 min-h-screen p-6
        ${open ? "block" : "hidden"} md:block`}
      >
        <h1 className="text-2xl font-bold mb-8">FunLang 🎉</h1>

        <nav className="space-y-3">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            <Home size={18} /> Dashboard
          </NavLink>

          <NavLink
            to="/lessons"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            <Book size={18} /> Lessons
          </NavLink>

          <NavLink
            to="/flashcards"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            🧠 Flashcards
          </NavLink>

          <NavLink
            to="/speaking"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            <Mic size={18} /> Speaking
          </NavLink>

          <NavLink
            to="/leaderboard"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            <Trophy size={18} /> Leaderboard
          </NavLink>

          <NavLink to="/achievements" className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }>
            🏅 Achievements
          </NavLink>

          <NavLink to="/ai" className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }>
            🤖 AI Tutor
          </NavLink>
        </nav>
      </div>
    </>
  );
}