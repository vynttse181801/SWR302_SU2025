import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { Shield, LogOut, Settings, Users, Activity, BarChart3 } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();

  // Check if user is authenticated and has ADMIN role
  if (!user || user.role.roleName !== 'ROLE_ADMIN') {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full blur opacity-25"></div>
                <div className="relative p-2 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
                  <Shield className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">HIV Care Admin</h1>
                <p className="text-xs text-gray-500">Quản trị hệ thống</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Xin chào,</span>
                <span className="font-semibold text-gray-900">{user.fullName}</span>
                <span className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full font-medium">
                  ADMIN
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 transition-colors duration-300"
              >
                <LogOut className="w-4 h-4" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            <div className="flex items-center space-x-2 py-4 text-primary-600 border-b-2 border-primary-500 font-medium">
              <Users className="w-4 h-4" />
              <span>Quản lý người dùng</span>
            </div>
            <div className="flex items-center space-x-2 py-4 text-gray-500 hover:text-primary-600 transition-colors duration-300 cursor-pointer">
              <Activity className="w-4 h-4" />
              <span>Thống kê</span>
            </div>
            <div className="flex items-center space-x-2 py-4 text-gray-500 hover:text-primary-600 transition-colors duration-300 cursor-pointer">
              <BarChart3 className="w-4 h-4" />
              <span>Báo cáo</span>
            </div>
            <div className="flex items-center space-x-2 py-4 text-gray-500 hover:text-primary-600 transition-colors duration-300 cursor-pointer">
              <Settings className="w-4 h-4" />
              <span>Cài đặt</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Admin Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full blur opacity-25"></div>
                <div className="relative p-1 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
                  <Shield className="w-4 h-4" />
                </div>
              </div>
              <span className="text-sm text-gray-600">
                HIV Care Admin Panel © 2024
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Phiên bản 1.0.0
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminLayout; 