import axios from 'axios';

const patientApi = axios.create({
    baseURL: process.env.REACT_APP_PATIENT_API_URL
});

export default patientApi;