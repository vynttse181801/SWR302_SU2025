import { User } from './types/index';

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

export type Doctor = {
  id: number;
  user: User;
  specialty: string;
};

export { User } from './types/index';