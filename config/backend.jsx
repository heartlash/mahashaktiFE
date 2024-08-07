import axios from 'axios';
import * as SecureStore from 'expo-secure-store';


export const TOKEN_KEY = "accessToken"
export const USER_INFO_KEY = "userInfo"
// Create an Axios instance

const Backend = axios.create({
  baseURL: 'http://192.168.1.11:8080/mahashakti',
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
