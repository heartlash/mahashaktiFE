import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';


const AuthContext = createContext();


const TOKEN_KEY = 'accessToken';

export const SERVER = "http://13.201.73.202:8080"
//export const SERVER = "http://192.168.31.25:8080"


const AuthProvider = ({children}) => {
    const [authState, setAuthState] = useState({
        token: null,
        isAuthenticated: false
    });


    useEffect(() => {
        const loadToken = async() => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);

            if(token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                setAuthState({
                    token,
                    authenticated: true
                })
            }
        };
        loadToken();
    }, []);
    
    const login = async(username, password) => {
        try {
            const response = await axios.post(`${SERVER}/mahashakti/users/login`,  {
                username,
                password
              }, {
                headers: {
                  'Content-Type': 'application/json'
                }
              });

            if(response.data.status == 'SUCCESS') {
        
                const accessToken = response.data.data.accessToken;
                setAuthState({
                    token: accessToken,
                    isAuthenticated: true
                });
                await SecureStore.setItemAsync(TOKEN_KEY, accessToken);
                axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            
            }
            return response.data.status;   
          } catch (error) {
            console.error('Failed to login:', error);
        }
    }

    const signup = async(name, phoneNumber, email, password) => {
        try {
            const response = await axios.post(`${SERVER}/mahashakti/users/signup`,  {
                name, phoneNumber, email, password
              }, {
                headers: {
                  'Content-Type': 'application/json'
                }
              });
            return response.data.status;   
          } catch (error) {
            console.error('Failed to login:', error);
        }
    }

    const logout = async () => {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        setAuthState({
            token: null,
            isAuthenticated: false
        })
        delete axios.defaults.headers.common['Authorization'];
    }

    return (
        <AuthContext.Provider value={{authState, login, signup, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

//export default AuthContext;
