export type Link = {
  id: string;
  text: string;
  url: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'staff';
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