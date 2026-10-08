import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async credentials => {
    const { data } = await api.post("/auth/login", credentials);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    if (data.user.preferredLanguage) localStorage.setItem("janraksha_language", data.user.preferredLanguage);
    const path = data.user.role === "ADMIN" ? "/admin" : data.user.role === "POLICE_OFFICER" ? "/police" : "/citizen";
    navigate(path);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    api.get("/auth/me").then(({ data }) => {
      setUser(data.user);
      if (data.user?.preferredLanguage) localStorage.setItem("janraksha_language", data.user.preferredLanguage);
    }).catch(() => logout());
  }, []);

  return <AuthContext.Provider value={{ user, login, logout, setUser }}>{children}</AuthContext.Provider>;
}

export function useAuth() { return useContext(AuthContext); }
