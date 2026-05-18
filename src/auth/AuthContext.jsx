import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setRole(payload.role);
        setIsAuthenticated(true);
      } catch (err) {
        localStorage.removeItem("token");
        setRole(null);
        setIsAuthenticated(false);
      }
    }
    setIsInitializing(false);
  }, []);

  const login = (token) => {
    try {
      localStorage.setItem("token", token);

      const payload = JSON.parse(atob(token.split(".")[1]));

      setRole(payload.role);
      setIsAuthenticated(true);
    } catch {
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setRole(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, logout, isInitializing }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
   const context = useContext(AuthContext);

   if (!context) {
      throw new Error("useAuth must be used within AuthProvider");
   }

   return context;
};