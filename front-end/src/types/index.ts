export interface Role {
  id: number;
  roleName: string;
  description: string;
}

export interface MedicalHistory {
  bloodType?: string;
  allergies?: string[];
  chronicDiseases?: string[];
  medications?: string[];
}

export interface User {
  id: number;
  username: string;
  name?: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: Role;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | '';
  address?: string;
  medicalHistory?: MedicalHistory;
  lastCheckup?: string;
  nextAppointment?: string;
  medicalRecordNumber?: string;
  notes?: string;
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
  result?: string;
}

export type Link = {
  id: number;
  text: string;
  url: string;
  roles?: string[];
};

export type HeaderProps = {
  links: Link[];
  isAuthenticated: boolean;
  user: User | null;
  onLogout: () => void;
};

export type LoginPageProps = {
  onLogin: (user: User) => void;
};

export type IconProps = {
  size?: number;
  className?: string;
};

export type LabTestType = {
  id: number;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  createdAt: string;
  updatedAt: string;
};