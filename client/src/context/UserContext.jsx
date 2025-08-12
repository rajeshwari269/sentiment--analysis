// src/context/UserContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {

    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  
    const syncUserWithServer = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/auth/user-profile`,
            { token }
          );
          if (response.data) {
          
            localStorage.setItem('user', JSON.stringify(response.data));
            setUser(response.data);
          }
        } catch (error) {
          console.error("Token might be invalid. Clearing user data.", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      }
      setLoading(false);
    };

    syncUserWithServer();
  }, []);

  
  const updateUser = (newUserData) => {
    
    localStorage.setItem('user', JSON.stringify(newUserData));
    setUser(newUserData);
  };

  

  const value = {
    user,
    setUser, 
    updateUser, 
    loading,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;