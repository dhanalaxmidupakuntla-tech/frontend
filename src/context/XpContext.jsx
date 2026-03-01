import { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import api from "../services/api";

export const XpContext = createContext();

export function XpProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [xp, setXp] = useState(0);

  // Load XP from backend
  useEffect(() => {
    if (!user) return;

    const loadXp = async () => {
      try {
        const res = await api.get("/auth/me");
        setXp(res.data.xp || 0);
        localStorage.setItem("xp", res.data.xp || 0);
      } catch (err) {
        console.error("Failed to load XP:", err);
      }
    };

    loadXp();
  }, [user]);

  const addXp = async (amount) => {
    if (!user) return;

    const newXp = xp + amount;
    setXp(newXp);
    localStorage.setItem("xp", newXp);

    try {
      await api.put("/auth/profile/xp", { xp: newXp });
    } catch (err) {
      console.error("Failed to sync XP:", err);
    }
  };

  return (
    <XpContext.Provider value={{ xp, addXp }}>
      {children}
    </XpContext.Provider>
  );
}

export const useXp = () => useContext(XpContext);