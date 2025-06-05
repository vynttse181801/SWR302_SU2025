export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'patient' | 'doctor' | 'admin';
}

export interface Doctor extends User {
  specialization: string;
  experience: string;
  education: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  reason: string;
  notes?: string;
}