import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

export default function useUser() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // if user already exists, no need to refetch
    if (user) {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then(res => {
        // optional: you can sync user here if you want
      })
      .finally(() => setLoading(false));
  }, [user]);

  return { user, loading };
}