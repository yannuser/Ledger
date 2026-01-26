import React, { createContext, useState, useEffect, useContext } from "react";
import axiosPrivate, { setAccessToken } from "./api/axios.js"; 
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null, 
    user: null, 
  });

  const [loading, setLoading] = useState(true);

  // When the app starts (user hits refresh), we check if a valid cookie
  useEffect(() => {
    const persistLogin = async () => {
      try {
        // We ask the backend for a new access token (HttpOnly cookie is sent automatically with request)
        const response = await axiosPrivate.post('/auth/refresh');
        
        const newToken = response.data.accessToken;
        
        const decoded = jwtDecode(newToken);
        setAuth({ token: newToken, user: decoded });
        
        // Update Axios Interceptor Memory
        setAccessToken(newToken);

        console.log("Session restored!");
      } catch (error) {
        console.log("No valid session found (User is effectively logged out)\n", error);
        // If this fails, the user is just anonymous, which is fine.
        setAuth({ token: null, user: null });
      } finally {
        setLoading(false);
      }
    };

    persistLogin();
  }, []);

  // Login Helper
  // Called by Login Component after successfully getting a token
  const login = (accessToken) => {
    const decoded = jwtDecode(accessToken);
    
    // Update State
    setAuth({ token: accessToken, user: decoded });
    
    // Update Axios Memory
    setAccessToken(accessToken);
  };

  // Logout Helper
  const logout = async () => {
    try {
        await axiosPrivate.post('/auth/logout'); 
    } catch (error) {
        console.error("Logout API failed", error);
    } finally {
        setAuth({ token: null, user: null });
        setAccessToken(null);
    }
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);