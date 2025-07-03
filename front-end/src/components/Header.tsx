import React, { useState, useEffect } from 'react';
import { Menu, User, LogOut, Settings, UserCircle, Shield } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Link as LinkType, HeaderProps } from '../types';
import { User as UserType } from '../types/index';

const Header: React.FC<HeaderProps> = ({ links, isAuthenticated, user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showRegister, setShowRegister] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate('/');
    setShowUserMenu(false);
  };

  const getUserRole = (user: UserType | null) => {
    if (!user) return null;
    if (typeof user.role === 'string') return user.role;
    const roleName = user.role.roleName;
    return roleName.startsWith('ROLE_') ? roleName : `ROLE_${roleName.toUpperCase()}`;
  };

  const isAdmin = getUserRole(user) === 'ROLE_ADMIN';
  const isDoctor = getUserRole(user) === 'ROLE_DOCTOR';

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/80 backdrop-blur-md shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between flex-wrap md:flex-nowrap gap-4">
          {isDoctor ? (
            <span className="flex items-center space-x-2 group cursor-default">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 bg-clip-text text-transparent group-hover:from-primary-500 group-hover:via-secondary-400 group-hover:to-accent-400 transition-all duration-300">
                HIV Care
              </span>
              {isAdmin && (
                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">ADMIN</span>
              )}
            </span>
          ) : (
            <Link to={isAdmin ? "/admin" : "/"} className="flex items-center space-x-2 group">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 bg-clip-text text-transparent group-hover:from-primary-500 group-hover:via-secondary-400 group-hover:to-accent-400 transition-all duration-300">
                HIV Care
              </span>
              {isAdmin && (
                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">ADMIN</span>
              )}
            </Link>
          )}
          
          {/* Navigation - Hide for ADMIN users */}
          {!isAdmin && !isDoctor && (
            <nav className="hidden md:flex justify-center flex-1 space-x-1">
              {links
                .filter(link => {
                  if (link.roles) {
                    const userRole = getUserRole(user);
                    return isAuthenticated && userRole && link.roles.includes(userRole);
                  }
                  return true; // Always show links without specified roles
                })
                .map((link) => (
                <Link 
                  key={link.id} 
                  to={link.url} 
                  onClick={() => console.log(`Navigating to: ${link.url}`)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 text-center
                    ${location.pathname === link.url 
                      ? 'text-white bg-gradient-to-r from-primary-500 to-secondary-500 shadow-md hover:shadow-primary-500/25' 
                      : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                    }`}
                >
                  {link.text}
                </Link>
              ))}
            </nav>
          )}

          {/* Admin Navigation */}
          {isAdmin && (
            <nav className="hidden md:flex justify-center flex-1 space-x-1">
              <Link 
                to="/admin"
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 text-center
                  ${location.pathname === '/admin'
                    ? 'text-white bg-gradient-to-r from-red-500 to-red-600 shadow-md hover:shadow-red-500/25' 
                    : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                  }`}
              >
                <Shield className="w-4 h-4 inline mr-2" />
                Quản lý Hệ thống
              </Link>
            </nav>
          )}
          
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="relative p-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-primary-50
                    transition-all duration-300 group"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md group-hover:shadow-lg
                    transition-all duration-300 ${
                      isAdmin 
                        ? 'bg-gradient-to-r from-red-500 to-red-600' 
                        : 'bg-gradient-to-r from-primary-500 to-secondary-500'
                    }`}>
                    <UserCircle className="w-5 h-5" />
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg border border-gray-100
                    py-2 animate-fade-up origin-top-right">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.fullName || user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                      {isAdmin && (
                        <p className="text-xs text-red-600 font-medium mt-1">Quản trị viên</p>
                      )}
                    </div>
                    
                    {!isAdmin && (
                      <Link
                        to={getUserRole(user) === 'ROLE_DOCTOR' ? "/doctor-profile" : "/profile"}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600
                          transition-colors duration-200"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Tài khoản
                      </Link>
                    )}
                    
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600
                          transition-colors duration-200"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Quản lý Hệ thống
                      </Link>
                    )}
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50
                        transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="relative text-sm font-medium px-5 py-2 rounded-lg text-primary-600 
                    transition-all duration-300 overflow-hidden group
                    border-2 border-primary-500/20 hover:border-primary-500
                    before:absolute before:inset-0 before:bg-primary-500/10
                    before:translate-x-[-100%] before:hover:translate-x-[0%]
                    before:transition-transform before:duration-300
                    hover:shadow-lg hover:shadow-primary-500/20"
                >
                  <span className="relative">Đăng nhập</span>
                </Link>
                <Link
                  to="/register"
                  className="relative text-sm font-medium px-6 py-2 rounded-lg text-white overflow-hidden
                    bg-gradient-to-r from-secondary-500 to-accent-500
                    transition-all duration-300 group
                    hover:shadow-lg hover:shadow-secondary-500/25
                    before:absolute before:inset-0
                    before:bg-gradient-to-r before:from-primary-500 before:to-secondary-500
                    before:translate-x-[-100%] before:hover:translate-x-[0%]
                    before:transition-transform before:duration-500
                    before:ease-out"
                >
                  <span className="relative">Đăng ký</span>
                </Link>
              </>
            )}
            <button 
              className="md:hidden p-2 rounded-lg bg-gray-50/50 text-gray-600
                hover:bg-primary-50 hover:text-primary-600
                transition-all duration-300 backdrop-blur-sm"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Register Modal */}
      {showRegister && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md animate-fade-up">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 rounded-xl opacity-75 blur transition duration-1000 group-hover:opacity-100"></div>
              
              <div className="relative bg-white rounded-xl shadow-xl p-8">
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-primary-600 
                    transition-colors duration-300"
                  onClick={() => setShowRegister(false)}
                >
                  ×
                </button>
                
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold gradient-heading mb-2">Tạo tài khoản mới</h2>
                  <p className="text-gray-600">Nhập thông tin của bạn để tạo tài khoản</p>
                </div>

                <form className="space-y-4">
                  <div className="space-y-4">
                    <div className="input-group">
                      <label className="block text-sm font-medium mb-1 text-gray-700">Họ và tên</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 
                          focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 
                          transition-all duration-300" 
                        placeholder="Nhập họ và tên"
                      />
                    </div>
                    
                    <div className="input-group">
                      <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
                      <input 
                        type="email" 
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 
                          focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 
                          transition-all duration-300" 
                        placeholder="Nhập email"
                      />
                    </div>
                    
                    <div className="input-group">
                      <label className="block text-sm font-medium mb-1 text-gray-700">Mật khẩu</label>
                      <input 
                        type="password" 
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 
                          focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 
                          transition-all duration-300" 
                        placeholder="Nhập mật khẩu"
                      />
                    </div>
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full py-3 px-6 rounded-lg text-white font-medium
                      bg-gradient-to-r from-primary-500 to-secondary-500
                      hover:from-primary-600 hover:to-secondary-600
                      transition-all duration-300 transform hover:scale-105
                      shadow-lg hover:shadow-xl"
                  >
                    Tạo tài khoản
                  </button>
                </form>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Đã có tài khoản?{' '}
                    <button 
                      className="text-primary-600 hover:text-primary-700 font-medium
                        transition-colors duration-300"
                      onClick={() => setShowRegister(false)}
                    >
                      Đăng nhập ngay
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;