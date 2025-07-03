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
        api.put(`/users/change-password`, data),
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

// Payment services
export const paymentService = {
    getAllPayments: () => 
        api.get('/payments'),
    getPaymentById: (id: number) => 
        api.get(`/payments/${id}`),
    createPayment: (paymentData: any) => 
        api.post('/payments', paymentData),
    updatePayment: (id: number, data: any) => 
        api.put(`/payments/${id}`, data),
    deletePayment: (id: number) => 
        api.delete(`/payments/${id}`),
};

// Test services
export const testService = {
    getTestTypes: () => 
        api.get('/labtesttypes'),
    bookTest: (testData: any) => 
        api.post('/lab-tests', testData),
    getTestResults: () => 
        api.get('/lab-results'),
    getLabTestTimeSlots: (date: Date) =>
        api.get('/lab-tests/time-slots', {
            params: { date: date.toISOString().split('T')[0] }
        }),
    getLabBookingById: (id: number|string) =>
        api.get(`/lab-tests/${id}`),
    updateLabBooking: (id: number|string, data: any) =>
        api.put(`/lab-tests/${id}`, data),
    getLabBookingsByPatient: (patientId: number) =>
        api.get(`/lab-tests/patient/${patientId}`),
    updateLabBookingStatus: (id: number|string, status: string) =>
        api.patch(`/lab-tests/${id}/status`, { status }),
};

// Lab Result services
export const labResultService = {
    getAllLabResults: () => 
        api.get('/lab-results'),
    getLabResultById: (id: number) => 
        api.get(`/lab-results/${id}`),
    getLabResultsByPatient: (patientId: number) => 
        api.get(`/lab-results/patient/${patientId}`),
    createLabResult: (data: any) => 
        api.post('/lab-results', data),
    updateLabResult: (id: number, data: any) => 
        api.put(`/lab-results/${id}`, data),
    deleteLabResult: (id: number) => 
        api.delete(`/lab-results/${id}`),
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
    getConsultationTypes: () => 
        api.get('/consultation-types'),
    createConsultation: (consultationData: any) => 
        api.post('/online-consultations', consultationData),
    updateOnlineConsultation: (id: number|string, data: any) =>
        api.put(`/online-consultations/${id}`, data),
    deleteOnlineConsultation: (id: number|string) =>
        api.delete(`/online-consultations/${id}`),
    getConsultationsByPatient: (patientId: number) =>
        api.get(`/online-consultations/patient/${patientId}`),
    getConsultationsByDoctor: (doctorId: number) =>
        api.get(`/online-consultations/doctor/${doctorId}`),
    updateOnlineConsultationStatus: (id: number|string, status: string) =>
        api.patch(`/online-consultations/${id}/status`, { status }),
};

export const serviceService = {
    getServices: () => 
        api.get('/medical-services'),
    getServiceById: (id: number) => 
        api.get('/medical-services/${id}')
};

// Staff services
export const staffService = {
    // Appointment management
    getAllAppointments: () => 
        api.get('/appointments'),
    getAppointmentById: (id: number) => 
        api.get(`/appointments/${id}`),
    updateAppointment: (id: number, data: any) => 
        api.put(`/appointments/${id}`, data),
    deleteAppointment: (id: number) => 
        api.delete(`/appointments/${id}`),
    confirmAppointment: (id: number) => 
        api.put(`/appointments/${id}/confirm`),
    cancelAppointment: (id: number) => 
        api.put(`/appointments/${id}/cancel`),

    // Patient management
    getAllPatients: () => 
        api.get('/patients'),
    getPatientById: (id: number) => 
        api.get(`/patients/${id}`),
    updatePatient: (id: number, data: any) => 
        api.put(`/patients/${id}`, data),
    getPatientMedicalHistory: (patientId: number) => 
        api.get(`/patients/${patientId}/medical-history`),

    // Reminder management
    getAllReminders: () => 
        api.get('/treatment-reminders'),
    getReminderById: (id: number) => 
        api.get(`/treatment-reminders/${id}`),
    getRemindersByPatient: (patientId: number, status?: string, reminderType?: string) => {
        let url = `/treatment-reminders?patientId=${patientId}`;
        if (status) url += `&status=${status}`;
        if (reminderType) url += `&reminderType=${reminderType}`;
        return api.get(url);
    },
    createReminder: (data: any) => 
        api.post('/treatment-reminders', data),
    updateReminder: (id: number, data: any) => 
        api.put(`/treatment-reminders/${id}`, data),
    deleteReminder: (id: number) => 
        api.delete(`/treatment-reminders/${id}`),
    sendReminder: (id: number) => 
        api.put(`/treatment-reminders/${id}/send`),
    completeReminder: (id: number) => 
        api.put(`/treatment-reminders/${id}/complete`),
    createMedicationRemindersFromSchedules: (patientId: number, createdById: number) =>
        api.post(`/treatment-reminders/medication-reminders/patient/${patientId}?createdById=${createdById}`),
    deleteMedicationRemindersByPatient: (patientId: number) =>
        api.delete(`/treatment-reminders/medication-reminders/patient/${patientId}`),

    // Lab test management
    getAllLabBookings: () => 
        api.get('/lab-tests'),
    getLabBookingById: (id: number) => 
        api.get(`/lab-tests/${id}`),
    updateLabBooking: (id: number, data: any) => 
        api.put(`/lab-tests/${id}`, data),
    updateLabBookingStatus: (id: number, status: string) =>
        api.patch(`/lab-tests/${id}/status`, { status }),

    // Statistics
    getAppointmentStats: () => 
        api.get('/appointments/stats'),
    getPatientStats: () => 
        api.get('/patients/stats'),
    getReminderStats: () => 
        api.get('/treatment-reminders/stats'),

    // Online consultation management
    getAllOnlineConsultations: () => 
        api.get('/online-consultations'),
    updateOnlineConsultationStatus: (id: number|string, status: string) =>
        api.patch(`/online-consultations/${id}/status`, { status }),
};

export const medicationService = {
    getAllMedications: () => api.get('/medications'),
    getMedicationSchedulesByPatient: (patientId: number) => api.get(`/medication-schedules/patient/${patientId}`),
    updateMedicationScheduleStatus: (id: number, data: any) =>
        api.put(`/medication-schedules/${id}`, data),
};

export const prescriptionService = {
    createPrescription: (data: any) => api.post('/prescriptions', data),
    getPrescriptionsByPatient: (patientId: number|string) => api.get(`/prescriptions/patient/${patientId}`),
};

export default api; 