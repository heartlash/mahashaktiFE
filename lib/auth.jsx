import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import Backend from "@/config/backend";


export const TOKEN_KEY = "accessToken"
export const USER_INFO_KEY = "userInfo"

export const login = async (username, password) => {
  try {
    delete Backend.defaults.headers.common['Authorization'];
    const response = await Backend.post("/users/login", {
      username,
      password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    await SecureStore.setItemAsync(TOKEN_KEY, response.data.data.accessToken);
    var name = response.data.data.name;
    var role = response.data.data.role;
    await SecureStore.setItemAsync(USER_INFO_KEY, JSON.stringify({
      username,
      name,
      role
    }));
    Backend.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.accessToken}`;

    return { data: response.data.status, errorMessage: null }

  } catch (error) {
    console.log(error);
    return {
      data: null,
      errorMessage: error.response?.data?.errorMessage || error.message || error
    }
  }
}

export const signup = async (name, phoneNumber, email, password) => {
  try {
    delete Backend.defaults.headers.common['Authorization'];
    const response = await Backend.post("/users/signup", {
      name, phoneNumber, email, password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return { data: response.data.status, errorMessage: null }

  } catch (error) {
    console.log(error);
    return {
      data: null,
      errorMessage: error.response?.data?.errorMessage || error.message || error
    }
  }
}

export const userVerification = async (email, phoneNumber) => {
  try {
    delete Backend.defaults.headers.common['Authorization'];
    const response = await Backend.post("/users/verification", {
      email, phoneNumber
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return { data: response.data.data, errorMessage: null }

  } catch (error) {
    console.log(error);
    return {
      data: null,
      errorMessage: error.response?.data?.errorMessage || error.message || error
    }
  }
}


export const getUserDetails = async (email) => {
  try {
    delete Backend.defaults.headers.common['Authorization'];
    const response = await Backend.get("/users/detail", {
      params: {
        email: email.toLowerCase(),
      },
    });

    return { data: response.data.data, errorMessage: null }

  } catch (error) {
    console.log(error);
    return {
      data: null,
      errorMessage: error.response?.data?.errorMessage || error.message || error
    }
  }
};


export const resetPassword = async (email, password) => {
  try {
    delete Backend.defaults.headers.common['Authorization'];
    const response = await Backend.put("/users/resetPassword", {
      username: email.toLowerCase(),
      password: password

    });

    return { data: response.data.data, errorMessage: null }
  } catch (error) {
    console.log(error);
    return {
      data: null,
      errorMessage: error.response?.data?.errorMessage || error.message || error
    }
  }
};

export const logout = async () => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_INFO_KEY);

  delete Backend.defaults.headers.common['Authorization'];
}

export const getUserInfo = async () => {
  return JSON.parse(await SecureStore.getItemAsync(USER_INFO_KEY));
}