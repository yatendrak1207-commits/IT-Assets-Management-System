import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (email, password) => {
    let loggedInUser = null;

    // Admin Login
    if (email === "admin@gmail.com" && password === "12345") {
      loggedInUser = {
        name: "Admin",
        email: email,
        role: "admin",
      };
    }

    // User Login
    else if (email === "user@gmail.com" && password === "12345") {
      loggedInUser = {
        name: "User",
        email: email,
        role: "user",
      };
    }

    // Wrong Login
    else {
      return false;
    }

    setUser(loggedInUser);
    localStorage.setItem("user", JSON.stringify(loggedInUser));

    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  useEffect(() => {
    const minutes = Number(sessionStorage.getItem("autoLogoutMinutes"));
    if (!minutes) return;

    let timer = setTimeout(logout, minutes * 60 * 1000);

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(logout, minutes * 60 * 1000);
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
