import React, { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null, // The raw string (needed for Authorization header)
    user: null, // The decoded user info (id, email)
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);

        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          setAuth({
            token: storedToken,
            user: decoded,
          });
        }
      } catch (error) {
        console.error("Invalid token", error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = (accessToken) => {
    localStorage.setItem("token", accessToken);
    const decoded = jwtDecode(accessToken);

    setAuth({
      token: accessToken,
      user: decoded,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    //  Reset to initial structure (safer than null)
    setAuth({ token: null, user: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook for easier access
export const useAuth = () => useContext(AuthContext);
