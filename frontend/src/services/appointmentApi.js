import axios from "axios";

const appointmentApi = axios.create({
  baseURL: 'http://localhost:8083/mind-help',
});

export default appointmentApi;
