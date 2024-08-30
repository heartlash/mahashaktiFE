import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import Backend from "@/config/backend";


export const TOKEN_KEY = "accessToken"
export const USER_INFO_KEY = "userInfo"

export const login = async (username, password) => {
  try {
    console.log("login is called");
    const response = await axios.post("http://192.168.1.15:8080/mahashakti/users/login", {
      username,
      password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (response.data.status == 'SUCCESS') {

      await SecureStore.setItemAsync(TOKEN_KEY, response.data.data.accessToken);
      var name = response.data.data.name;
      var role = response.data.data.role;
      await SecureStore.setItemAsync(USER_INFO_KEY, JSON.stringify({
        username,
        name,
        role
      }));
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.accessToken}`;

    }
    return response.data.status;
  } catch (error) {
    console.error('Failed to login:', error);
  }
}

export const signup = async (name, phoneNumber, email, password) => {
  try {
    console.log("login is called");
    const response = await axios.post("http://localhost:8080/mahashakti/users/signup", {
      name, phoneNumber, email, password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to login:', error);
  }
}



export const logout = async () => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_INFO_KEY);

  delete axios.defaults.headers.common['Authorization'];
}

export const getUserInfo = async () => {
  return JSON.parse(await SecureStore.getItemAsync(USER_INFO_KEY));
}