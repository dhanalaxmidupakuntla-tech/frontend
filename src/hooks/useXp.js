import { useContext } from "react";
import { XpContext } from "../context/XpContext";

export const useXp = () => {
  const context = useContext(XpContext);

  if (!context) {
    throw new Error("useXp must be used inside XpProvider");
  }

  return context;
};