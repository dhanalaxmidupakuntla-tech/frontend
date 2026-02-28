import { useEffect, useState } from "react";
import api from "../services/api";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/leaderboard").then(res => setUsers(res.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🏆 Leaderboard</h2>

      {users.map((u, i) => (
        <div key={u.id} className="bg-white shadow p-3 mb-2 rounded">
          {i+1}. {u.email} — {u.total_xp} XP
        </div>
      ))}
    </div>
  );
}