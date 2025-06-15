import React, { useState, useEffect } from 'react';
import { User } from '../types';
import api from '../services/api';
import { useModal } from '../hooks/useModal';
import Modal from '../components/Modal';
import UserForm from '../components/UserForm';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../contexts/AuthContext';

const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { modalState, showModal, hideModal } = useModal();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);
  const { logout } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi khi tải danh sách người dùng.');
      toast.error(err.response?.data?.message || 'Lỗi khi tải danh sách người dùng.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        await api.delete(`/users/${id}`);
        toast.success('Xóa người dùng thành công!');
        fetchUsers(); // Refresh the list
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Lỗi khi xóa người dùng.');
      }
    }
  };

  const handleAddEditUser = (user?: User) => {
    setEditingUser(user);
    setIsFormModalOpen(true);
  };

  const handleSaveUser = async (userData: Omit<User, 'id' | 'role'> & { roleName: string; password?: string }) => {
    try {
      const payload: any = {
        fullName: userData.fullName,
        email: userData.email,
        username: userData.username,
        role: { roleName: userData.roleName },
      };

      if (userData.password) {
        payload.password = userData.password;
      }

      if (editingUser) {
        // Update existing user
        await api.put(`/users/${editingUser.id}`, payload);
        toast.success('Cập nhật người dùng thành công!');
      } else {
        // Add new user
        await api.post('/users', payload);
        toast.success('Thêm người dùng thành công!');
      }
      setIsFormModalOpen(false);
      setEditingUser(undefined);
      fetchUsers(); // Refresh the list
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Lỗi khi lưu người dùng.');
    }
  };

  const handleCancelForm = () => {
    setIsFormModalOpen(false);
    setEditingUser(undefined);
  };

  if (loading) return <div className="text-center py-10">Đang tải người dùng...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Lỗi: {error}</div>;

  return (
    <div className="w-full min-h-screen p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Quản lý Người dùng</h1>

      <div className="flex justify-end mb-6">
        <button
          onClick={() => handleAddEditUser()}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Thêm Người dùng Mới
        </button>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Đăng xuất
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ID
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Họ và Tên
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Username
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Vai trò
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{user.id}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{user.fullName}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{user.email}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{user.username}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{user.role.roleName}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                  <button
                    onClick={() => handleAddEditUser(user)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={modalState.isOpen || isFormModalOpen}
        title={isFormModalOpen ? (editingUser ? 'Chỉnh sửa Người dùng' : 'Thêm Người dùng Mới') : modalState.title}
        type={modalState.type}
        buttonText={modalState.buttonText}
        onClose={isFormModalOpen ? handleCancelForm : hideModal}
        onButtonClick={modalState.onButtonClick}
      >
        {isFormModalOpen ? <UserForm user={editingUser} onSave={handleSaveUser} onCancel={handleCancelForm} /> : modalState.message}
      </Modal>
    </div>
  );
};

export default AdminPage; 