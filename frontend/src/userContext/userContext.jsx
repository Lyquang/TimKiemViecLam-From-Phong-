import React, { createContext, useState, useEffect, useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const storedToken = localStorage.getItem("TOKEN");
  const [token, setToken] = useState(storedToken);
  // const [userInfo, setUserInfo] = useState(() => {
  //   try {
  //     return storedToken ? jwtDecode(storedToken) : null;
  //   } catch {
  //     return null;
  //   }
  // });
  const [userInfo, setUserInfo] = useState();
  
  const [isLoggedIn, setIsLoggedIn] = useState(!!storedToken);

  const login = (user, token) => {;
    setUserInfo(user);
    // console.log(userInfo);
    setIsLoggedIn(true);
    setToken(token);
    localStorage.setItem("TOKEN", token);
    localStorage.setItem("USER", JSON.stringify(user));
  };

  const logout = () => {
    setUserInfo(null);
    setIsLoggedIn(false);
    setToken(null);
    localStorage.removeItem("TOKEN");
    localStorage.removeItem("USER");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  // Dùng useMemo để tránh re-render không cần thiết
  const providerValue = useMemo(() => ({
    userInfo,
    setUserInfo,
    isLoggedIn,
    login,
    logout,
    token,
    setToken,
  }), [userInfo, isLoggedIn, token]);

  return (
    <UserContext.Provider value={providerValue}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
