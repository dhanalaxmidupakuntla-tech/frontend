import { useEffect, useState } from "react";
import api from "../services/api";
import PageWrapper from "../components/layout/PageWrapper";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  console.log(users)

  useEffect(() => {
    api.get("/leaderboard").then(res => setUsers(res.data));
  }, []);

  // combine any server-provided users with the current user
  const localXp = Number(localStorage.getItem("xp") || 0);
  const players = [
    ...users.map((u) => ({ name: u.email, xp: u.total_xp })),
    { name: "You", xp: localXp },
  ];

  // sort descending by xp
  players.sort((a, b) => b.xp - a.xp);

  return (
    <PageWrapper title="Leaderboard">
      <div className="max-w-2xl mx-auto">
        <h3 className="text-3xl font-bold mb-8 text-center">🏆 Leaderboard</h3>
        
        <div className="space-y-3">
          {players.map((p, i) => {
            let bgColor = "bg-white dark:bg-gray-700";
            let borderColor = "border-l-4 border-gray-400";
            let medal = "";
            
            if (i === 0) {
              bgColor = "bg-yellow-100 dark:bg-yellow-900";
              borderColor = "border-l-4 border-yellow-400";
              medal = "🥇";
            } else if (i === 1) {
              bgColor = "bg-gray-100 dark:bg-gray-600";
              borderColor = "border-l-4 border-gray-400";
              medal = "🥈";
            } else if (i === 2) {
              bgColor = "bg-orange-100 dark:bg-orange-900";
              borderColor = "border-l-4 border-orange-400";
              medal = "🥉";
            }
            
            return (
              <div
                key={i}
                className={`${bgColor} ${borderColor} p-4 rounded-lg shadow hover:shadow-lg transition transform ${i === 0 ? 'scale-105' : ''}`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-gray-600 dark:text-gray-300 w-6">{medal || `#${i + 1}`}</span>
                    <span className="text-lg font-semibold text-gray-800 dark:text-white">{p.name}</span>
                  </div>
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-300">{p.xp} ⭐</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PageWrapper>
  );
}