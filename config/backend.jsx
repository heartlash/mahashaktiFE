import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { SERVER } from '@/context/AuthContext';


export const TOKEN_KEY = "accessToken"
export const USER_INFO_KEY = "userInfo"
// Create an Axios instance

const Backend = axios.create({
  //baseURL: 'https://1d6b-2401-4900-1cbc-9fa1-a502-ce3b-8b84-cc49.ngrok-free.app/mahashakti',
  baseURL: `http://${SERVER}:8080/mahashakti`,

});

// Function to set the Authorization header
const setAuthorizationHeader = async () => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) {
    Backend.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

// Call the function to set the Authorization header
setAuthorizationHeader();

export default Backend;
