import { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
      } catch (err) {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      }
    };

    fetchUser();
  }, [token]); // ✅ depend on token

  const register = async (data) => {
    await api.post("/auth/register", data);
  };

  const login = async (data) => {
    const res = await api.post("/auth/login", data);

    localStorage.setItem("token", res.data.token);
    setToken(res.data.token); // ✅ update state
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};