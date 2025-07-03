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
  status?: string;
}

export interface Doctor extends User {
  specialization: string;
  experience: string;
  education?: string;
  qualification?: string;
  doctorCode?: string;
  licenseNumber?: string;
  bio?: string;
  rating?: number;
  avatar?: string;
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
  patient?: User;
  medicalService?: { name: string };
  appointmentDate?: string;
  appointmentTime?: string;
}

export interface OnlineConsultation {
  id: number;
  appointment: Appointment;
  consultationType: { id: number; name: string };
  meetingLink?: string;
  startTime?: string;
  endTime?: string;
  notes?: string;
  status?: string;
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

export interface LabBooking {
  id: number;
  patientId: number;
  testTypeId: number;
  testTypeName?: string;
  date: string;
  timeSlotId?: number;
  notes: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'results ready';
  createdAt: string;
  updatedAt: string;
}

export interface LabResult {
  id: number;
  patient: User;
  testType: LabTestType;
  testDate: string;
  resultValue: string;
  unit?: string;
  normalRange?: string;
  notes?: string;
  enteredBy: User;
  createdAt: string;
  updatedAt: string;
}