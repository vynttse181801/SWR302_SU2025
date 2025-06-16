import axios from 'axios';
import { format } from 'date-fns';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Add request interceptor
api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                // Token expired or invalid
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('user');
                window.location.href = '/login';
            }
            console.error('Response error:', error.response.data);
        } else if (error.request) {
            console.error('Request error:', error.request);
        } else {
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

// Auth services
export const authService = {
    login: async (credentials: { username: string; password: string }) => {
        const response = await api.post('/users/login', credentials);
        const { accessToken, username, email, fullName, role, id } = response.data;
        sessionStorage.setItem('token', accessToken);
        return { accessToken, username, email, fullName, role, id };
    },
    register: (userData: any) => 
        api.post('/users/register', userData),
    logout: () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
    },
    changePassword: (userId: string, data: { currentPassword: string; newPassword: string }) => 
        api.put(`/users/${userId}/change-password`, data),
};

// Doctor services
export const doctorService = {
    getAllDoctors: () => 
        api.get('/doctors'),
    getDoctorById: (id: number) => 
        api.get(`/doctors/${id}`),
    getDoctorSchedule: (doctorId: number) => 
        api.get(`/doctors/${doctorId}/schedule`),
};

// Appointment services
export const appointmentService = {
    createAppointment: (appointmentData: any) => 
        api.post('/appointments', appointmentData),
    getAppointments: () => 
        api.get('/appointments'),
    getAppointmentById: (id: number) => 
        api.get(`/appointments/${id}`),
    updateAppointment: (id: number, data: any) => 
        api.put(`/appointments/${id}`, data),
};

// Patient services
export const patientService = {
    getProfile: () => 
        api.get('/patients/me'),
    updateProfile: async (data: any) => {
        const response = await api.put(`/patients/${data.id}`, data);
        return response;
    },
    getMedicalHistory: () => 
        api.get('/patients/medical-history'),
};

// Test services
export const testService = {
    getTestTypes: () => 
        api.get('/labtesttypes'),
    bookTest: (testData: any) => 
        api.post('/lab-tests', testData),
    getTestResults: () => 
        api.get('/lab-results'),
};

// ARV Protocol services
export const arvProtocolService = {
    getProtocols: () => 
        api.get('/arv-protocols'),
    getProtocolById: (id: number) => 
        api.get(`/arv-protocols/${id}`),
};

// Medical Service services
export const medicalService = {
    getAllServices: () => 
        api.get('/medical-services'),
    getServiceById: (id: number) => 
        api.get(`/medical-services/${id}`),
};

export const testResultService = {
    getTestResults: () => 
        api.get('/lab-results'),
};

export const testBookingService = {
    getTestTypes: () => 
        api.get('/labtesttypes'),
    getTimeSlots: (date: Date) => 
        api.get('/time-slots', {
            params: { date: date.toISOString() }
        }),
    createBooking: (bookingData: any) => 
        api.post('/test-bookings', bookingData)
};

export const consultationService = {
    getDoctors: () => 
        api.get('/doctors'),
    getTimeSlots: (doctorId: number, date: Date) => 
        api.get('/consultation-time-slots', {
            params: { doctorId: doctorId, date: format(date, 'yyyy-MM-dd') }
        }),
    createConsultation: (consultationData: any) => 
        api.post('/online-consultations', consultationData) // Changed endpoint
};

export const serviceService = {
    getServices: () => 
        api.get('/medical-services'),
    getServiceById: (id: number) => 
        api.get(`/medical-services/${id}`)
};

export default api; 