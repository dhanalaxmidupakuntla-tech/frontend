import { useEffect, useState } from "react";
import api from "../services/api";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/leaderboard").then(res => setUsers(res.data));
  }, []);

  const players = [
    { name: "Emma", xp: 300 },
    { name: "Liam", xp: 250 },
    { name: "You", xp: Number(localStorage.getItem("xp") || 0) },
  ];

  players.sort((a, b) => b.xp - a.xp);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🏆 Leaderboard</h2>

      {players.map((p, i) => (
        <div key={i} className="p-2 bg-white rounded mb-2">
          {i + 1}. {p.name} — {p.xp} XP
        </div>
      ))}
    </div>
  );
}