import { useEffect } from "react";
import { useXp } from "../context/XpContext";

export default function useDailyReward() {
  const { addXp } = useXp();

  useEffect(() => {
    const last = localStorage.getItem("daily_reward");
    const today = new Date().toDateString();

    if (last !== today) {
      addXp(20);
      localStorage.setItem("daily_reward", today);
    }
  }, []);
}