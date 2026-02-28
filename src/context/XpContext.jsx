import { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { supabase } from "../lib/supabase";

export const XpContext = createContext();

export function XpProvider({ children }) {
  const { user: authUser } = useContext(AuthContext);
  const [xp, setXp] = useState(Number(localStorage.getItem("xp")) || 0);

  const addXp = async (amount) => {
    if (!authUser) return;

    // calculate new XP in a functional update so we always have the correct
    // value even if multiple calls happen in quick succession.
    let newXp;
    setXp((prev) => {
      newXp = prev + amount;
      localStorage.setItem("xp", newXp);
      return newXp;
    });

    try {
      // Update Supabase with the value we just calculated rather than relying on
      // the `xp` state variable which may still be stale when this function
      // executes.
      await supabase.from("profiles").upsert({ id: authUser.id, xp: newXp });
      await supabase.from("user_progress").upsert({
        user_id: authUser.id,
        xp: newXp,
        updated_at: new Date(),
      });
    } catch (err) {
      console.error("Failed to sync XP with backend:", err);
    }
  };

  useEffect(() => {
    const loadXp = async () => {
      if (!authUser) return;
      const { data } = await supabase.from("profiles").select("xp").eq("id", authUser.id).single();
      if (data?.xp !== undefined) {
        setXp(data.xp);
        localStorage.setItem("xp", data.xp);
      }
    };
    loadXp();
  }, [authUser]);

  return <XpContext.Provider value={{ xp, addXp }}>{children}</XpContext.Provider>;
}

export const useXp = () => useContext(XpContext);