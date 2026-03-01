import { createContext, useContext, useState } from "react";

const KidModeContext = createContext();

export function KidModeProvider({ children }) {
  const [kidMode, setKidMode] = useState(
    () => localStorage.getItem("kidMode") === "true"
  );
  const toggleKidMode = () => {
    setKidMode((prev) => {
      const nxt = !prev;
      localStorage.setItem("kidMode", nxt);
      return nxt;
    });
  };

  return (
    <KidModeContext.Provider value={{ kidMode, toggleKidMode }}>
      {children}
    </KidModeContext.Provider>
  );
}

export const useKidMode = () => useContext(KidModeContext);
