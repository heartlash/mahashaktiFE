import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';


import { TOKEN_KEY, USER_INFO_KEY } from "../lib/auth";


const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {

  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {    

    const checkTokenValidity = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const userInfoString = await SecureStore.getItemAsync(USER_INFO_KEY);
      if (token && userInfoString) {
        try {
          const decodedToken = jwtDecode(token);
          const userInfo = JSON.parse(userInfoString);
          if (decodedToken.exp * 1000 > Date.now()) {
            setIsLogged(true);
            setUser(userInfo);
          } else {
            setIsLogged(false);
            setUser(null);
          }
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      } else {
        setIsLogged(false);
        setUser(null);
      }
      setLoading(false);
    };

    checkTokenValidity();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        loading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;