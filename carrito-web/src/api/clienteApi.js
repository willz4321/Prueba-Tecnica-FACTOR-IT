import axios from "axios";

export const clienteApi = axios.create({
    baseURL: 'http://localhost:8080/api/cliente'
});