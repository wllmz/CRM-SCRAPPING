import axios from "axios";
import { jwtDecode } from 'jwt-decode';


const API_URL = "http://localhost:5000/"; 

const register = (email, password) => {
  return axios.post(API_URL + "register", {
    email,
    password,

  });
};

const login = (email, password) => {
  return axios
    .post(API_URL + "signin", {
      email,
      password,
    })
    .then((response) => {
      if (response.data.token) {
        const user = {
          id: response.data.id,
          token: response.data.token,
        };
        localStorage.setItem("user", JSON.stringify(user));
      }
      return response.data;
    });
};


const logout = () => {
  localStorage.removeItem("user");

};


const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const isAdmin = () => {
  const user = getCurrentUser();
  if (!user || !user.token) return false;

  try {
      const decoded = jwtDecode(user.token);
      return decoded.role === 'admin'; 
  } catch (error) {
      console.error("Erreur lors du décodage du token:", error);
      return false;
  }
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
  isAdmin,

};

export default AuthService;