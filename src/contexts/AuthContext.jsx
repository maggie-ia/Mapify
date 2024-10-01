import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if there's a token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // Here you would typically validate the token with your backend
      // For now, we'll just set a dummy user
      setUser({ id: 1, username: 'DummyUser' });
    }
  }, []);

  const login = async (email, password) => {
    // Here you would typically make an API call to your backend
    // For now, we'll just set a dummy user and token
    const dummyUser = { id: 1, username: 'DummyUser' };
    const dummyToken = 'dummyToken123';
    setUser(dummyUser);
    localStorage.setItem('token', dummyToken);
  };

  const register = async (username, email, password) => {
    // Here you would typically make an API call to your backend
    // For now, we'll just set a dummy user and token
    const dummyUser = { id: 1, username };
    const dummyToken = 'dummyToken123';
    setUser(dummyUser);
    localStorage.setItem('token', dummyToken);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};