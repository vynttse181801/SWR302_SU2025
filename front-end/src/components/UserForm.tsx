import React, { useState, useEffect } from 'react';
import { User } from '../types';

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
    <form onSubmit={handleSubmit} className="p-4">
      <div className="mb-4">
        <label htmlFor="fullName" className="block text-gray-700 text-sm font-bold mb-2">Họ và Tên:</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-bold mb-2">Số điện thoại:</label>
        <input
          type="text"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {errors.phoneNumber && <p className="text-red-500 text-xs italic">{errors.phoneNumber}</p>}
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Mật khẩu:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required={!user} // Required only for new users
        />
        {errors.password && <p className="text-red-500 text-xs italic">{errors.password}</p>}
      </div>
      <div className="mb-4">
        <label htmlFor="roleName" className="block text-gray-700 text-sm font-bold mb-2">Vai trò:</label>
        <select
          id="roleName"
          name="roleName"
          value={formData.roleName}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="PATIENT">PATIENT</option>
          <option value="DOCTOR">DOCTOR</option>
          <option value="STAFF">STAFF</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {user ? 'Lưu thay đổi' : 'Thêm Người dùng'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Hủy
        </button>
      </div>
    </form>
  );
};

export default UserForm; 