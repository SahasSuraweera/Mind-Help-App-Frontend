import axios from 'axios';

const userApi = axios.create({
  baseURL: 'http://localhost:8080/mind-help',
});

export default userApi;