import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Link as LinkType } from '../types';

type HeaderProps = {
  links: LinkType[];
};

const Header: React.FC<HeaderProps> = ({ links }) => {
  const location = useLocation();
  const [showRegister, setShowRegister] = useState(false);

  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-sm shadow-sm z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold gradient-heading">HIV Care</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex space-x-2">
          {links.map((link) => (
            <Link 
              key={link.id} 
              to={link.url} 
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                location.pathname === link.url 
                ? 'text-primary-600 bg-primary-50' 
                : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
              }`}
            >
              {link.text}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center space-x-4">
          <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
            Đăng nhập
          </Link>
          <Link
            to="/register"
            className="btn-primary text-sm"
          >
            Đăng ký
          </Link>
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-primary-600">
            <Menu size={20} />
          </button>
        </div>
      </div>
      
      {showRegister && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-primary-600 transition-colors"
              onClick={() => setShowRegister(false)}
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-center mb-2 gradient-heading">Tạo tài khoản mới</h2>
            <p className="text-center text-gray-600 mb-6">Nhập thông tin của bạn để tạo tài khoản</p>
            
            <form className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Họ và tên</label>
                  <input type="text" className="w-full" placeholder="Nguyễn Văn A" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
                  <input type="email" className="w-full" placeholder="example@gmail.com" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Mật khẩu</label>
                  <input type="password" className="w-full" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Xác nhận mật khẩu</label>
                  <input type="password" className="w-full" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Giới tính</label>
                <div className="flex items-center gap-4 mt-1">
                  <label className="flex items-center gap-1">
                    <input type="radio" name="gender" value="male" className="text-primary-600" required /> Nam
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="radio" name="gender" value="female" className="text-primary-600" /> Nữ
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="radio" name="gender" value="other" className="text-primary-600" /> Khác
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" className="text-primary-600 rounded" required />
                <span className="text-sm text-gray-600">
                  Tôi đồng ý với <Link to="/terms" className="text-primary-600 hover:text-primary-700">Điều khoản dịch vụ</Link>
                </span>
              </div>

              <button type="submit" className="btn-primary w-full">
                Tạo tài khoản
              </button>
            </form>

            <p className="text-center text-gray-600 mt-4 text-sm">
              Đã có tài khoản? <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">Đăng nhập</Link>
            </p>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;