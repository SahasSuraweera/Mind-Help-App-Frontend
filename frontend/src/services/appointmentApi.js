import axios from "axios";

const appointmentApi = axios.create({
  baseURL: 'http://localhost:8083/appointment-service',
});

export default appointmentApi;
