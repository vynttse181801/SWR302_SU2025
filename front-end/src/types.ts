export type Link = {
  id: string;
  text: string;
  url: string;
};

export type User = {
  id: number;
  fullName?: string;
  phoneNumber?: string;
  name?: string;
  email: string;
  username: string;
  role: Role;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  avatar?: string;
  medicalHistory?: {
    bloodType?: string;
    allergies?: string[];
    chronicDiseases?: string[];
    medications?: string[];
  };
  lastCheckup?: string;
  nextAppointment?: string;
};

export type Role = {
  id: number;
  roleName: 'PATIENT' | 'DOCTOR' | 'STAFF' | 'ADMIN';
  description: string;
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