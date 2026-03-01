import React from "react";
import { useKidMode } from "../../context/KidModeContext";

export default function PageWrapper({ title, children }) {
  const { kidMode } = useKidMode();
  return (
    <div className={`p-6 space-y-6 ${kidMode ? "bg-pink-50 text-lg" : ""} dark:bg-gray-900 dark:text-white`}>
      {title && <h2 className="text-2xl font-bold">{title}</h2>}
      {children}
    </div>
  );
}
