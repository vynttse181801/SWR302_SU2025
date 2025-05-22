import React from 'react';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  return (
    <div className="bg-white min-h-screen flex items-center justify-center py-10">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-1">Đăng nhập</h2>
        <p className="text-center text-gray-600 mb-6">Nhập thông tin đăng nhập của bạn</p>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium mb-1">Địa chỉ email</label>
            <input 
              type="email" 
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-black focus:ring-1 focus:ring-black" 
              placeholder="Nhập địa chỉ email của bạn" 
              required 
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium">Mật khẩu</label>
              <Link to="/quen-mat-khau" className="text-xs text-gray-600 hover:text-black">Quên mật khẩu?</Link>
            </div>
            <input 
              type="password" 
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-black focus:ring-1 focus:ring-black" 
              placeholder="Nhập mật khẩu của bạn"
              required 
            />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" className="accent-black" />
            <span className="text-sm">Ghi nhớ đăng nhập</span>
          </div>
          <button type="submit" className="w-full px-6 py-2 bg-black text-white rounded hover:bg-gray-900 transition-colors">
            Đăng nhập
          </button>
        </form>
        <div className="text-center text-gray-600 mt-6 text-sm">
          <p className="mb-2">Bạn có thể dùng tài khoản demo để trải nghiệm:</p>
          <div className="bg-gray-50 rounded p-3 font-mono text-xs">
            <div>Email: <span className="text-black">demo@example.com</span></div>
            <div>Mật khẩu: <span className="text-black">password123</span></div>
          </div>
        </div>
        <p className="text-center text-gray-600 mt-4 text-sm">
          Chưa có tài khoản? <Link to="/register" className="text-black font-medium hover:text-gray-700">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;