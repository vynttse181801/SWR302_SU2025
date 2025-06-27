import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import api from '../../services/api';
import { useModal } from '../../hooks/useModal';
import Modal from '../../components/Modal';
import UserForm from '../../components/UserForm';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../contexts/AuthContext';
import { Shield, Users, Activity, Settings, LogOut, Plus, Search, Filter, SortAsc, SortDesc, UserCheck, UserX, UserPlus } from 'lucide-react';

const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
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
      const errorMessage = err.response?.data?.message || 'Lỗi khi tải danh sách người dùng.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn ngừng hoạt động (xóa mềm) người dùng này?')) {
      try {
        await api.patch(`/users/${id}/deactivate`);
        toast.success('Đã ngừng hoạt động tài khoản!');
        fetchUsers(); // Refresh the list
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Lỗi khi ngừng hoạt động tài khoản.';
        toast.error(errorMessage);
      }
    }
  };

  const handleAddEditUser = (user?: User) => {
    setEditingUser(user);
    setIsFormModalOpen(true);
  };

  const handleSaveUser = async (userData: Omit<User, 'id' | 'role'> & { roleName: string; password?: string; phoneNumber?: string }) => {
    try {
      const normalizedRole = userData.roleName.startsWith('ROLE_') 
        ? userData.roleName 
        : `ROLE_${userData.roleName.toUpperCase()}`;

      const payload: any = {
        fullName: userData.fullName,
        email: userData.email,
        username: userData.username,
        phoneNumber: userData.phoneNumber || '',
        role: { roleName: normalizedRole },
      };

      if (userData.password) {
        payload.password = userData.password;
      }

      if (editingUser) {
        // Update existing user
        await api.put(`/users/${editingUser.id}`, payload);
        toast.success('Cập nhật thông tin người dùng thành công!');
      } else {
        // Add new user
        await api.post('/users', payload);
        toast.success('Thêm người dùng mới thành công!');
      }
      setIsFormModalOpen(false);
      setEditingUser(undefined);
      fetchUsers(); // Refresh the list
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Lỗi khi lưu thông tin người dùng.';
      toast.error(errorMessage);
    }
  };

  const handleCancelForm = () => {
    setIsFormModalOpen(false);
    setEditingUser(undefined);
  };

  // Filter and sort users
  const filteredAndSortedUsers = users
    .filter(user => {
      const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.username.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === 'all' || user.role.roleName === filterRole;
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'fullName':
          aValue = a.fullName;
          bValue = b.fullName;
          break;
        case 'email':
          aValue = a.email;
          bValue = b.email;
          break;
        case 'role':
          aValue = a.role.roleName;
          bValue = b.role.roleName;
          break;
        default:
          aValue = a.id;
          bValue = b.id;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getRoleDisplayName = (roleName: string) => {
    const roleMap: { [key: string]: string } = {
      'ROLE_ADMIN': 'Quản trị viên',
      'ROLE_DOCTOR': 'Bác sĩ',
      'ROLE_PATIENT': 'Bệnh nhân',
      'ROLE_STAFF': 'Nhân viên'
    };
    return roleMap[roleName] || roleName;
  };

  const getRoleBadgeColor = (roleName: string) => {
    const colorMap: { [key: string]: string } = {
      'ROLE_ADMIN': 'bg-gradient-to-r from-red-500 to-red-600 text-white',
      'ROLE_DOCTOR': 'bg-gradient-to-r from-primary-500 to-primary-600 text-white',
      'ROLE_PATIENT': 'bg-gradient-to-r from-accent-500 to-accent-600 text-white',
      'ROLE_STAFF': 'bg-gradient-to-r from-secondary-500 to-secondary-600 text-white'
    };
    return colorMap[roleName] || 'bg-gray-500 text-white';
  };

  const getRoleIcon = (roleName: string) => {
    const iconMap: { [key: string]: string } = {
      'ROLE_ADMIN': '👑',
      'ROLE_DOCTOR': '👨‍⚕️',
      'ROLE_PATIENT': '👤',
      'ROLE_STAFF': '👷'
    };
    return iconMap[roleName] || '👤';
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="text-center">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full blur opacity-25"></div>
          <div className="relative animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
        </div>
        <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="text-center">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full blur opacity-25"></div>
          <div className="relative text-red-500 text-xl mb-4">⚠️ Lỗi tải dữ liệu</div>
        </div>
        <div className="text-gray-600 mb-4">{error}</div>
        <button 
          onClick={fetchUsers}
          className="btn-gradient-primary"
        >
          Thử lại
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-2xl blur opacity-25"></div>
        <div className="relative bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full blur opacity-25"></div>
                <div className="relative p-3 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
                  <Shield className="w-8 h-8" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold gradient-text">Quản lý Hệ thống HIV</h1>
                <p className="text-gray-600 mt-1">Bảng điều khiển quản trị viên</p>
              </div>
            </div>
            <button
              onClick={() => handleAddEditUser()}
              className="btn-gradient-primary flex items-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Thêm Người dùng</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card group">
          <div className="card-hover"></div>
          <div className="relative bg-white p-6 rounded-xl">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white">
                <Users className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng người dùng</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="card group">
          <div className="card-hover"></div>
          <div className="relative bg-white p-6 rounded-xl">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gradient-to-r from-accent-500 to-accent-600 text-white">
                <span className="text-2xl">👤</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bệnh nhân</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.role.roleName === 'ROLE_PATIENT').length}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="card group">
          <div className="card-hover"></div>
          <div className="relative bg-white p-6 rounded-xl">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white">
                <span className="text-2xl">👨‍⚕️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bác sĩ</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.role.roleName === 'ROLE_DOCTOR').length}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="card group">
          <div className="card-hover"></div>
          <div className="relative bg-white p-6 rounded-xl">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gradient-to-r from-secondary-500 to-secondary-600 text-white">
                <span className="text-2xl">👷</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Nhân viên</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.role.roleName === 'ROLE_STAFF').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl blur opacity-50"></div>
        <div className="relative bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm theo tên, email, username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vai trò</label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white transition-all duration-300"
                >
                  <option value="all">Tất cả vai trò</option>
                  <option value="ROLE_ADMIN">Quản trị viên</option>
                  <option value="ROLE_DOCTOR">Bác sĩ</option>
                  <option value="ROLE_PATIENT">Bệnh nhân</option>
                  <option value="ROLE_STAFF">Nhân viên</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sắp xếp theo</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
              >
                <option value="id">ID</option>
                <option value="fullName">Họ và tên</option>
                <option value="email">Email</option>
                <option value="role">Vai trò</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Thứ tự</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSortOrder('asc')}
                  className={`flex-1 px-3 py-2 border rounded-lg flex items-center justify-center space-x-1 transition-all duration-300 ${
                    sortOrder === 'asc' 
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white border-primary-500 shadow-lg' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-primary-300'
                  }`}
                >
                  <SortAsc className="w-4 h-4" />
                  <span>Tăng</span>
                </button>
                <button
                  onClick={() => setSortOrder('desc')}
                  className={`flex-1 px-3 py-2 border rounded-lg flex items-center justify-center space-x-1 transition-all duration-300 ${
                    sortOrder === 'desc' 
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white border-primary-500 shadow-lg' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-primary-300'
                  }`}
                >
                  <SortDesc className="w-4 h-4" />
                  <span>Giảm</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-white to-gray-50 rounded-2xl blur opacity-50"></div>
        <div className="relative bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-secondary-50">
            <h3 className="text-lg font-bold text-gray-900">Danh sách người dùng</h3>
            <p className="mt-1 text-sm text-gray-600">
              Hiển thị {filteredAndSortedUsers.length} trong tổng số {users.length} người dùng
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thông tin người dùng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Liên hệ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vai trò
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gradient-to-r hover:from-primary-50/50 hover:to-secondary-50/50 transition-all duration-300">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full blur opacity-25"></div>
                            <div className="relative h-10 w-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold">
                              {user.fullName.charAt(0).toUpperCase()}
                            </div>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">{user.fullName}</div>
                          <div className="text-sm text-gray-500">@{user.username}</div>
                          <div className="text-xs text-gray-400">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                      {user.phoneNumber && (
                        <div className="text-sm text-gray-500">{user.phoneNumber}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getRoleIcon(user.role.roleName)}</span>
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role.roleName)}`}>
                          {getRoleDisplayName(user.role.roleName)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${user.status === 'INACTIVE' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        {user.status === 'INACTIVE' ? 'Ngừng hoạt động' : 'Hoạt động'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleAddEditUser(user)}
                        className="text-primary-600 hover:text-primary-800 mr-4 transition-colors duration-300 flex items-center"
                      >
                        <UserCheck className="w-4 h-4 mr-1" />
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id.toString())}
                        className={`transition-colors duration-300 flex items-center ${user.status === 'INACTIVE' ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:text-red-800'}`}
                        disabled={user.status === 'INACTIVE'}
                      >
                        <UserX className="w-4 h-4 mr-1" />
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredAndSortedUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full blur opacity-25"></div>
                <div className="relative mx-auto h-12 w-12 text-gray-400">
                  <Users className="w-full h-full" />
                </div>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy người dùng</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterRole !== 'all' 
                  ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.'
                  : 'Chưa có người dùng nào trong hệ thống.'
                }
              </p>
            </div>
          )}
        </div>
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