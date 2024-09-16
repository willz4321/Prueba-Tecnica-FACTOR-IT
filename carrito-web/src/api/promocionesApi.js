import axios from "axios";

export const promocionesApi = axios.create({
    baseURL: 'http://localhost:8080/api/promociones'
});