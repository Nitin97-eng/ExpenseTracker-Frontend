import axios from "axios";

const API = axios.create({
    baseURL: "https://expensetracker-backend-lktt.onrender.com/api/v1"
});

API.interceptors.request.use((config)=>{
    const token = localStorage.getItem("token");

    console.log(
        "TOKEN SENT:",
        token
    );

    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default API;