import React from 'react';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  return (
    <div className="bg-white min-h-screen flex items-center justify-center py-10">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-1">Tạo tài khoản mới</h2>
        <p className="text-center text-gray-600 mb-6">Nhập thông tin của bạn để tạo tài khoản</p>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium mb-1">Họ và tên</label>
            <input 
              type="text" 
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-black focus:ring-1 focus:ring-black" 
              placeholder="Nguyễn Văn A" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Địa chỉ email</label>
            <input 
              type="email" 
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-black focus:ring-1 focus:ring-black" 
              placeholder="nguyenvana@example.com" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mật khẩu</label>
            <input 
              type="password" 
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-black focus:ring-1 focus:ring-black" 
              required 
              placeholder="Nhập mật khẩu của bạn"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Xác nhận mật khẩu</label>
            <input 
              type="password" 
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-black focus:ring-1 focus:ring-black" 
              required 
              placeholder="Nhập lại mật khẩu"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ngày sinh</label>
            <input 
              type="date" 
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-black focus:ring-1 focus:ring-black" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Giới tính</label>
            <div className="flex items-center gap-4 mt-1">
              <label className="flex items-center gap-1">
                <input type="radio" name="gender" value="male" className="accent-black" required /> Nam
              </label>
              <label className="flex items-center gap-1">
                <input type="radio" name="gender" value="female" className="accent-black" /> Nữ
              </label>
              <label className="flex items-center gap-1">
                <input type="radio" name="gender" value="other" className="accent-black" /> Khác
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Số điện thoại</label>
            <input 
              type="tel" 
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-black focus:ring-1 focus:ring-black" 
              placeholder="Nhập số điện thoại của bạn" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Địa chỉ</label>
            <input 
              type="text" 
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-black focus:ring-1 focus:ring-black" 
              placeholder="Nhập địa chỉ của bạn" 
            />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" className="accent-black" required />
            <span className="text-sm">
              Tôi đồng ý với <a href="#" className="text-black hover:underline">Điều khoản dịch vụ</a> và <a href="#" className="text-black hover:underline">Chính sách bảo mật</a>
            </span>
          </div>
          <button type="submit" className="w-full px-6 py-2 bg-black text-white rounded hover:bg-gray-900 transition-colors">
            Tạo tài khoản
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4 text-sm">
          Đã có tài khoản? <Link to="/login" className="text-black font-medium hover:text-gray-700">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;