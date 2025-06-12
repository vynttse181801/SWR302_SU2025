import axios from 'axios';

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
        api.get('/patients/profile'),
    updateProfile: (data: any) => 
        api.put('/patients/profile', data),
    getMedicalHistory: () => 
        api.get('/patients/medical-history'),
};

// Test services
export const testService = {
    getTestTypes: () => 
        api.get('/lab-test-types'),
    bookTest: (testData: any) => 
        api.post('/lab-tests', testData),
    getTestResults: () => 
        api.get('/lab-results'),
};

// ARV Protocol services
export const arvProtocolService = {
    getProtocols: async () => {
        const response = await axios.get(`${API_BASE_URL}/arv-protocols`);
        return response.data;
    },
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
    getTestResults: async () => {
        const response = await axios.get(`${API_BASE_URL}/lab-results`);
        return response.data;
    },
};

export const testBookingService = {
    getTestTypes: async () => {
        const response = await axios.get(`${API_BASE_URL}/lab-test-types`);
        return response.data;
    },
    getTimeSlots: async (date: Date) => {
        const response = await axios.get(`${API_BASE_URL}/time-slots`, {
            params: { date: date.toISOString() }
        });
        return response.data;
    },
    createBooking: async (bookingData: any) => {
        const response = await axios.post(`${API_BASE_URL}/test-bookings`, bookingData);
        return response.data;
    }
};

export const consultationService = {
    getDoctors: async () => {
        const response = await axios.get(`${API_BASE_URL}/doctors`);
        return response.data;
    },
    getTimeSlots: async (date: Date) => {
        const response = await axios.get(`${API_BASE_URL}/consultation-time-slots`, {
            params: { date: date.toISOString() }
        });
        return response.data;
    },
    createConsultation: async (consultationData: any) => {
        const response = await axios.post(`${API_BASE_URL}/consultations`, consultationData);
        return response.data;
    }
};

export const serviceService = {
    getServices: async () => {
        const response = await axios.get(`${API_BASE_URL}/medical-services`);
        return response.data;
    },
    getServiceById: async (id: number) => {
        const response = await axios.get(`${API_BASE_URL}/medical-services/${id}`);
        return response.data;
    }
};

export default api; 