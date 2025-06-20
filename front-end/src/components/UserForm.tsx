import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { UserPlus, UserCheck, X } from 'lucide-react';

interface UserFormProps {
  user?: User; // Optional, for editing existing user
  onSave: (userData: Omit<User, 'id' | 'role'> & { roleName: string; password?: string, phoneNumber?: string }) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    phoneNumber: '', // Add phone number field
    roleName: 'PATIENT', // Default role
    password: '', // Add password field
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email,
        username: user.username,
        phoneNumber: user.phoneNumber || '', // Pre-fill phone number if exists
        roleName: user.role.roleName || 'PATIENT',
        password: '', // Password should not be pre-filled when editing for security reasons
      });
    }
  }, [user]);

  const validate = () => {
    let newErrors: { [key: string]: string } = {};
    // Password validation: at least 8 characters, one uppercase, one lowercase, one number, one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!user && !formData.password) { // Required only for new users
        newErrors.password = 'Mật khẩu là bắt buộc.';
    } else if (formData.password && !passwordRegex.test(formData.password)) {
      newErrors.password = 'Mật khẩu phải dài ít nhất 8 ký tự, bao gồm ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt.';
    }

    // Phone number validation: only digits, 10-11 digits
    const phoneRegex = /^\d{10,11}$/;
    if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber)) {
        newErrors.phoneNumber = 'Số điện thoại phải là 10 hoặc 11 chữ số.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' })); // Clear error when typing
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <div className="relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-2xl blur opacity-25"></div>
      <div className="relative bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full blur opacity-25"></div>
              <div className="relative p-2 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
                {user ? <UserCheck className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {user ? 'Chỉnh sửa Người dùng' : 'Thêm Người dùng Mới'}
              </h3>
              <p className="text-sm text-gray-500">
                {user ? 'Cập nhật thông tin người dùng' : 'Tạo tài khoản mới trong hệ thống'}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Họ và Tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                required
                placeholder="Nhập họ và tên đầy đủ"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                required
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Tên đăng nhập <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                required
                placeholder="Tên đăng nhập"
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại
              </label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                placeholder="0123456789"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu {!user && <span className="text-red-500">*</span>}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                required={!user}
                placeholder={user ? "Để trống nếu không thay đổi" : "Nhập mật khẩu"}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="roleName" className="block text-sm font-medium text-gray-700 mb-2">
                Vai trò <span className="text-red-500">*</span>
              </label>
              <select
                id="roleName"
                name="roleName"
                value={formData.roleName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 appearance-none bg-white"
              >
                <option value="PATIENT">Bệnh nhân</option>
                <option value="DOCTOR">Bác sĩ</option>
                <option value="STAFF">Nhân viên</option>
                <option value="ADMIN">Quản trị viên</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn-gradient-primary flex items-center space-x-2"
            >
              {user ? (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>Lưu thay đổi</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Thêm Người dùng</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm; 