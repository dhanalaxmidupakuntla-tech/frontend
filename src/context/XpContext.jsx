import { createContext, useContext, useState } from "react";

export const XpContext = createContext();

export function XpProvider({ children }) {
  const [xp, setXp] = useState(
    Number(localStorage.getItem("xp")) || 0
  );

  const addXp = (amount) => {
    setXp(prev => {
      const updated = prev + amount;
      localStorage.setItem("xp", updated);
      return updated;
    });
  };

  return (
    <XpContext.Provider value={{ xp, addXp }}>
      {children}
    </XpContext.Provider>
  );
}

export const useXp = () => useContext(XpContext);