import axios from 'axios';

const staffApi = axios.create({
  baseURL: 'http://localhost:8082/mind-help',
});

export default staffApi;