import axios from 'axios';
import API_URL from './api';  // ajusta o caminho se necessário

const apiClient = axios.create({
  baseURL: API_URL,
});

export default apiClient;
