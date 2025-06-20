import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Shield, LogOut, Settings, Users, Activity, BarChart3, Calendar, FileText, Bell } from 'lucide-react';

interface StaffLayoutProps {
  children: React.ReactNode;
}

const StaffLayout: React.FC<StaffLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();

  // Check if user is authenticated and has STAFF role
  if (!user || user.role.roleName !== 'ROLE_STAFF') {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Staff Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur opacity-25"></div>
                <div className="relative p-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                  <Shield className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">HIV Care Staff</h1>
                <p className="text-xs text-gray-500">Quản lý hành chính</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Xin chào,</span>
                <span className="font-semibold text-gray-900">{user.fullName}</span>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full font-medium">
                  STAFF
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

      {/* Staff Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            <div className="flex items-center space-x-2 py-4 text-blue-600 border-b-2 border-blue-500 font-medium">
              <Calendar className="w-4 h-4" />
              <span>Quản lý lịch hẹn</span>
            </div>
            <div className="flex items-center space-x-2 py-4 text-gray-500 hover:text-blue-600 transition-colors duration-300 cursor-pointer">
              <FileText className="w-4 h-4" />
              <span>Hồ sơ bệnh nhân</span>
            </div>
            <div className="flex items-center space-x-2 py-4 text-gray-500 hover:text-blue-600 transition-colors duration-300 cursor-pointer">
              <Bell className="w-4 h-4" />
              <span>Nhắc nhở</span>
            </div>
            <div className="flex items-center space-x-2 py-4 text-gray-500 hover:text-blue-600 transition-colors duration-300 cursor-pointer">
              <Activity className="w-4 h-4" />
              <span>Thống kê</span>
            </div>
            <div className="flex items-center space-x-2 py-4 text-gray-500 hover:text-blue-600 transition-colors duration-300 cursor-pointer">
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

      {/* Staff Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur opacity-25"></div>
                <div className="relative p-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                  <Shield className="w-4 h-4" />
                </div>
              </div>
              <span className="text-sm text-gray-600">
                HIV Care Staff Panel © 2024
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

export default StaffLayout; 