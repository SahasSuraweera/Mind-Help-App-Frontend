import axios from 'axios';

const paymentApi = axios.create({
  baseURL: 'http://localhost:8084/payment-service',
});

export default paymentApi;