import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4403',
});

export default api;
