import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Edit2, 
  Save, 
  X,
  Droplet,
  AlertTriangle,
  Pill,
  Clock,
  Calendar as CalendarIcon,
  ClipboardList,
  MessageSquare,
  Pill as PillIcon,
  FileText,
  ChevronRight,
  Star,
  StarHalf,
  ThumbsUp,
  Pencil,
  KeyRound,
  Bell
} from 'lucide-react';
import { User as UserType } from '../../types';
import { useModal } from '../../hooks/useModal';
import Modal from '../../components/Modal';
import { authService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

type TabType = 'profile' | 'test-history' | 'consultation-history' | 'arv-protocol';

interface Rating {
  id: string;
  rating: number;
  comment: string;
  date: string;
}

interface ServiceItem {
  id: string;
  title: string;
  date: string;
  status: string;
  doctor: string;
  details: string;
  rating?: Rating;
  doctorNote?: string;
  resultNote?: string;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { modalState, showModal, hideModal } = useModal();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isEditingFeedback, setIsEditingFeedback] = useState(false);
  const [editingFeedbackId, setEditingFeedbackId] = useState<string | null>(null);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [reminderStatus, setReminderStatus] = useState({
    medication: false,
    followUp: false
  });
  const [user, setUser] = useState<UserType>({
    id: '',
    name: '',
    email: '',
    username: '',
    role: { id: 1, roleName: 'PATIENT', description: 'Standard patient role' },
    phone: '',
    dateOfBirth: '',
    gender: undefined,
    address: '',
    avatar: '',
    medicalHistory: {
      bloodType: '',
      allergies: [],
      chronicDiseases: [],
      medications: []
    },
    lastCheckup: '',
    nextAppointment: ''
  });

  const [testHistory, setTestHistory] = useState<ServiceItem[]>([]);

  const [consultationHistory, setConsultationHistory] = useState<ServiceItem[]>([]);

  const { user: authUser } = useAuth();

  // Handle navigation state
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab as TabType);
    }
  }, [location.state]);

  useEffect(() => {
    if (authUser?.id) {
      api.get(`/users/${authUser.id}`)
        .then((res: { data: UserType }) => setUser((prev) => ({ ...prev, ...res.data })))
        .catch((err: any) => console.error('Lỗi lấy thông tin user:', err));
    }
  }, [authUser?.id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // TODO: Implement API call to save user data
    setIsEditing(false);
    showModal(
      'Thành công',
      'Thông tin cá nhân đã được cập nhật.',
      'success'
    );
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
    setUser({
      id: '',
      name: '',
      email: '',
      username: '',
      role: { id: 1, roleName: 'PATIENT', description: 'Standard patient role' },
      phone: '',
      dateOfBirth: '',
      gender: undefined,
      address: '',
      avatar: '',
      medicalHistory: {
        bloodType: '',
        allergies: [],
        chronicDiseases: [],
        medications: []
      },
      lastCheckup: '',
      nextAppointment: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('medicalHistory.')) {
      const field = name.split('.')[1];
      setUser(prev => ({
        ...prev,
        medicalHistory: {
          ...prev.medicalHistory,
          [field]: field === 'allergies' || field === 'chronicDiseases' || field === 'medications'
            ? value.split(',').map(item => item.trim())
            : value
        }
      }));
    } else {
      setUser(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleOpenRatingModal = (service: ServiceItem) => {
    setSelectedService(service);
    if (service.rating) {
      setRating(service.rating.rating);
      setComment(service.rating.comment);
      setIsEditingFeedback(true);
      setEditingFeedbackId(service.rating.id);
    } else {
      setRating(0);
      setComment('');
      setIsEditingFeedback(false);
      setEditingFeedbackId(null);
    }
    setShowRatingModal(true);
  };

  const handleSubmitFeedback = () => {
    if (!selectedService) return;

    const newRating: Rating = {
      id: editingFeedbackId || `rating-${Date.now()}`,
      rating,
      comment,
      date: new Date().toISOString()
    };

    // Update the service's rating
    if (activeTab === 'test-history') {
      setTestHistory((prev: ServiceItem[]) => prev.map(test => 
        test.id === selectedService.id 
          ? { ...test, rating: newRating }
          : test
      ));
    } else if (activeTab === 'consultation-history') {
      setConsultationHistory((prev: ServiceItem[]) => prev.map(consult => 
        consult.id === selectedService.id 
          ? { ...consult, rating: newRating }
          : consult
      ));
    }

    setShowRatingModal(false);
    showModal(
      'Thành công',
      isEditingFeedback ? 'Đánh giá đã được cập nhật.' : 'Cảm ơn bạn đã gửi đánh giá.',
      'success'
    );
  };

  const handleChangePassword = async () => {
    setPasswordError(null);
    if (newPassword !== confirmNewPassword) {
      setPasswordError('Mật khẩu mới và xác nhận mật khẩu không khớp.');
      return;
    }
    if (newPassword.length < 6) { // Example: minimum password length
      setPasswordError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    // TODO: Implement API call to update password
    // For now, simulate success or failure
    try {
      await authService.changePassword(user.id, { currentPassword, newPassword });
      showModal('Thành công', 'Mật khẩu đã được cập nhật thành công.', 'success');
      setShowChangePasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error: any) {
      setPasswordError(error.response?.data?.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại.');
    }
  };

  const renderRatingStars = (rating: number, interactive = false) => {
    const getStarColor = (star: number) => {
      if (star <= (interactive ? hoveredRating : rating)) {
        return 'text-yellow-400 fill-current';
      } else if (star - 0.5 <= (interactive ? hoveredRating : rating)) {
        return 'text-yellow-400 fill-current';
      }
      return 'text-gray-300';
    };

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={interactive ? () => setRating(star) : undefined}
            onMouseEnter={interactive ? () => setHoveredRating(star) : undefined}
            onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
            className={`${
              interactive ? 'cursor-pointer transform hover:scale-110 transition-transform' : ''
            }`}
            disabled={!interactive}
          >
            {star <= (interactive ? hoveredRating : rating) ? (
              <Star className={`w-6 h-6 ${getStarColor(star)}`} />
            ) : star - 0.5 <= (interactive ? hoveredRating : rating) ? (
              <StarHalf className={`w-6 h-6 ${getStarColor(star)}`} />
            ) : (
              <Star className={`w-6 h-6 ${getStarColor(star)}`} />
            )}
          </button>
        ))}
        {interactive && (
          <span className="ml-2 text-lg font-semibold text-gray-700">
            {rating > 0 ? rating.toFixed(1) : '0.0'}
          </span>
        )}
      </div>
    );
  };

  const renderRatingModal = () => {
    if (!showRatingModal || !selectedService) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Đánh giá dịch vụ
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {selectedService.title}
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Đánh giá của bạn
              </label>
              <div className="flex flex-col items-center gap-2">
                {renderRatingStars(rating, true)}
                <span className="text-sm text-gray-500">
                  {rating === 0 ? 'Chọn số sao' :
                    rating === 1 ? 'Rất không hài lòng' :
                    rating === 2 ? 'Không hài lòng' :
                    rating === 3 ? 'Bình thường' :
                    rating === 4 ? 'Hài lòng' :
                    'Rất hài lòng'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhận xét của bạn
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg
                  focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
                  transition-all duration-300 bg-gray-50"
                rows={4}
                placeholder="Chia sẻ trải nghiệm của bạn về dịch vụ..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => setShowRatingModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-700
                  transition-colors duration-300 font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitFeedback}
                className="px-6 py-2 bg-primary-500 text-white rounded-lg
                  hover:bg-primary-600 transition-all duration-300
                  flex items-center gap-2 font-medium shadow-sm
                  hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={rating === 0}
              >
                <ThumbsUp size={18} />
                Gửi đánh giá
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderServiceItem = (item: ServiceItem) => (
    <div className="border-b border-gray-100 pb-4 last:border-0">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-900">{item.title}</h3>
          <p className="text-sm text-gray-600 mt-1">Ngày thực hiện: {item.date}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium
            ${item.status === 'Hoàn thành' || item.status === 'Đã hoàn thành'
              ? 'bg-green-100 text-green-700'
              : 'bg-blue-100 text-blue-700'
            }`}>
            {item.status}
          </span>
          {item.rating && (
            <button
              onClick={() => handleOpenRatingModal(item)}
              className="p-2 text-gray-400 hover:text-primary-600 transition-colors duration-300"
              title="Chỉnh sửa đánh giá"
            >
              <Edit2 size={16} />
            </button>
          )}
        </div>
      </div>
      
      <div className="mt-2 text-sm text-gray-600">
        <p>{item.details}</p>
        <p>Bác sĩ phụ trách: {item.doctor}</p>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100">
        {item.rating ? (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <ThumbsUp className="w-6 h-6 text-primary-600" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {renderRatingStars(item.rating.rating)}
                  <span className="text-sm font-medium text-gray-500">
                    {item.rating.date}
                  </span>
                </div>
                <p className="text-gray-700 italic">
                  "{item.rating.comment}"
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => handleOpenRatingModal(item)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 
              bg-gray-50 hover:bg-gray-100 rounded-lg text-primary-600 
              hover:text-primary-700 transition-all duration-300
              border border-dashed border-gray-200"
          >
            <MessageSquare size={18} />
            <span className="font-medium">Đánh giá dịch vụ này</span>
          </button>
        )}
      </div>
    </div>
  );

  const tabs = [
    {
      id: 'profile',
      label: 'Thông tin cá nhân',
      icon: User,
      color: 'primary'
    },
    {
      id: 'test-history',
      label: 'Lịch xét nghiệm',
      icon: ClipboardList,
      color: 'secondary'
    },
    {
      id: 'consultation-history',
      label: 'Lịch tư vấn',
      icon: MessageSquare,
      color: 'secondary'
    },
    {
      id: 'arv-protocol',
      label: 'Phác đồ ARV',
      icon: PillIcon,
      color: 'secondary'
    }
  ];

  const [selectedTestStatus, setSelectedTestStatus] = useState<string>('all');
  const [selectedConsultationStatus, setSelectedConsultationStatus] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedTestToCancel, setSelectedTestToCancel] = useState<ServiceItem | null>(null);

  const handleCancelTest = (test: ServiceItem) => {
    setSelectedTestToCancel(test);
    setShowCancelModal(true);
  };

  const confirmCancelTest = () => {
    if (selectedTestToCancel) {
      const updatedTestHistory = testHistory.map(test => 
        test.id === selectedTestToCancel.id 
          ? { ...test, status: 'Đã hủy' }
          : test
      );
      setTestHistory(updatedTestHistory);
      setShowCancelModal(false);
      setSelectedTestToCancel(null);
      showModal(
        'Thành công',
        'Đã hủy lịch xét nghiệm thành công.',
        'success'
      );
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Thông tin cá nhân</h2>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <label className="block text-sm font-semibold text-primary-600 mb-2">
                    Họ và tên
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="fullName"
                      value={user.fullName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg
                        focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
                        transition-all duration-300"
                      placeholder="Nhập họ và tên"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-700">
                      <User size={16} className="text-primary-500" />
                      <span className="font-medium">{user.fullName}</span>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <label className="block text-sm font-semibold text-primary-600 mb-2">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={user.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg
                        focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
                        transition-all duration-300"
                      placeholder="Nhập email"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail size={16} className="text-primary-500" />
                      <span className="font-medium">{user.email}</span>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <label className="block text-sm font-semibold text-primary-600 mb-2">
                    Số điện thoại
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="phoneNumber"
                      value={user.phoneNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg
                        focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
                        transition-all duration-300"
                      placeholder="Nhập số điện thoại"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone size={16} className="text-primary-500" />
                      <span className="font-medium">{user.phoneNumber}</span>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <label className="block text-sm font-semibold text-primary-600 mb-2">
                    Ngày sinh
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={user.dateOfBirth}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg
                        focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
                        transition-all duration-300"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar size={16} className="text-primary-500" />
                      <span className="font-medium">{user.dateOfBirth}</span>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <label className="block text-sm font-semibold text-primary-600 mb-2">
                    Giới tính
                  </label>
                  {isEditing ? (
                    <select
                      name="gender"
                      value={user.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg
                        focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
                        transition-all duration-300"
                    >
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-700">
                      <User size={16} className="text-primary-500" />
                      <span className="font-medium">
                        {user.gender === 'male' ? 'Nam' : user.gender === 'female' ? 'Nữ' : 'Khác'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <label className="block text-sm font-semibold text-primary-600 mb-2">
                    Địa chỉ
                  </label>
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={user.address}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg
                        focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
                        transition-all duration-300"
                      placeholder="Nhập địa chỉ"
                    />
                  ) : (
                    <div className="flex items-start gap-2 text-gray-700">
                      <MapPin size={16} className="text-primary-500 mt-1" />
                      <span className="font-medium">{user.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-secondary-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-secondary-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Thông tin y tế</h2>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <label className="block text-sm font-semibold text-secondary-600 mb-2">
                    Nhóm máu
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="medicalHistory.bloodType"
                      value={user.medicalHistory?.bloodType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg
                        focus:ring-2 focus:ring-secondary-500/20 focus:border-secondary-500
                        transition-all duration-300"
                      placeholder="Nhập nhóm máu"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Droplet size={16} className="text-secondary-500" />
                      <span className="font-medium">{user.medicalHistory?.bloodType}</span>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <label className="block text-sm font-semibold text-secondary-600 mb-2">
                    Dị ứng
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="medicalHistory.allergies"
                      value={user.medicalHistory?.allergies?.join(', ')}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg
                        focus:ring-2 focus:ring-secondary-500/20 focus:border-secondary-500
                        transition-all duration-300"
                      placeholder="Nhập các dị ứng, phân cách bằng dấu phẩy"
                    />
                  ) : (
                    <div className="flex items-start gap-2 text-gray-700">
                      <AlertTriangle size={16} className="text-secondary-500 mt-1" />
                      <span className="font-medium">
                        {user.medicalHistory?.allergies?.join(', ') || 'Không có'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <label className="block text-sm font-semibold text-secondary-600 mb-2">
                    Bệnh mãn tính
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="medicalHistory.chronicDiseases"
                      value={user.medicalHistory?.chronicDiseases?.join(', ')}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg
                        focus:ring-2 focus:ring-secondary-500/20 focus:border-secondary-500
                        transition-all duration-300"
                      placeholder="Nhập các bệnh mãn tính, phân cách bằng dấu phẩy"
                    />
                  ) : (
                    <div className="flex items-start gap-2 text-gray-700">
                      <AlertTriangle size={16} className="text-secondary-500 mt-1" />
                      <span className="font-medium">
                        {user.medicalHistory?.chronicDiseases?.join(', ') || 'Không có'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <label className="block text-sm font-semibold text-secondary-600 mb-2">
                    Thuốc đang sử dụng
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="medicalHistory.medications"
                      value={user.medicalHistory?.medications?.join(', ')}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg
                        focus:ring-2 focus:ring-secondary-500/20 focus:border-secondary-500
                        transition-all duration-300"
                      placeholder="Nhập các loại thuốc, phân cách bằng dấu phẩy"
                    />
                  ) : (
                    <div className="flex items-start gap-2 text-gray-700">
                      <Pill size={16} className="text-secondary-500 mt-1" />
                      <span className="font-medium">
                        {user.medicalHistory?.medications?.join(', ') || 'Không có'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <label className="block text-sm font-semibold text-secondary-600 mb-2">
                    Lần khám gần nhất
                  </label>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock size={16} className="text-secondary-500" />
                    <span className="font-medium">{user.lastCheckup || 'Chưa có'}</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <label className="block text-sm font-semibold text-secondary-600 mb-2">
                    Lịch hẹn tiếp theo
                  </label>
                  <div className="flex items-center gap-2 text-gray-700">
                    <CalendarIcon size={16} className="text-secondary-500" />
                    <span className="font-medium">{user.nextAppointment || 'Chưa có'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'test-history':
        const filteredTestHistory = testHistory.filter(test => {
          if (selectedTestStatus === 'all') return true;
          return test.status === selectedTestStatus;
        });

        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex items-center space-x-4">
                <CalendarIcon className="w-5 h-5 text-primary-600" />
                <input
                  type="date"
                  value={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={selectedTestStatus}
                  onChange={(e) => setSelectedTestStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="all">Tất cả</option>
                  <option value="Hoàn thành">Đã hoàn thành</option>
                  <option value="Đang chờ">Đang chờ</option>
                  <option value="Đã hủy">Đã hủy</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4">
              {filteredTestHistory.length > 0 ? (
                filteredTestHistory.map((test) => (
                  <div
                    key={test.id}
                    className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center">
                          <User className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{test.title}</h3>
                          <p className="text-sm text-gray-500">{test.details}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          test.status === 'Đã hoàn thành' ? 'bg-green-100 text-green-800' :
                          test.status === 'Đã hủy' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {test.status}
                        </span>
                        <div className="text-sm text-gray-500">
                          {test.date}
                        </div>
                      </div>
                    </div>
                    {renderFeedbackSection(test)}
                    {test.status === 'Đã hoàn thành' && test.resultNote && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-start gap-2">
                          <div className="w-8 h-8 rounded-full bg-secondary-50 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4 text-secondary-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-sm font-medium text-gray-900">Kết quả</h4>
                              <span className="text-xs text-gray-500">{test.doctor}</span>
                            </div>
                            <p className="text-sm text-gray-700 whitespace-pre-line">{test.resultNote}</p>
                            <div className="mt-2">
                              <Link
                                to="/test-results"
                                className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-800"
                              >
                                Xem kết quả
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Không có lịch xét nghiệm nào
                </div>
              )}
            </div>
          </div>
        );

      case 'consultation-history':
        const filteredConsultationHistory = consultationHistory.filter(consultation => {
          if (selectedConsultationStatus === 'all') return true;
          return consultation.status === selectedConsultationStatus;
        });

        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex items-center space-x-4">
                <CalendarIcon className="w-5 h-5 text-primary-600" />
                <input
                  type="date"
                  value={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={selectedConsultationStatus}
                  onChange={(e) => setSelectedConsultationStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="all">Tất cả</option>
                  <option value="Đã hoàn thành">Đã hoàn thành</option>
                  <option value="Đang chờ">Đang chờ</option>
                  <option value="Đã hủy">Đã hủy</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4">
              {filteredConsultationHistory.length > 0 ? (
                filteredConsultationHistory.map((consult) => (
                  <div
                    key={consult.id}
                    className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center">
                          <User className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{consult.title}</h3>
                          <p className="text-sm text-gray-500">{consult.details}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          consult.status === 'Đã hoàn thành' ? 'bg-green-100 text-green-800' :
                          consult.status === 'Đã hủy' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {consult.status}
                        </span>
                        <div className="text-sm text-gray-500">
                          {consult.date}
                        </div>
                      </div>
                    </div>

                    {/* Doctor's Note Section */}
                    {consult.status === 'Đã hoàn thành' && consult.doctorNote && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-start gap-2">
                          <div className="w-8 h-8 rounded-full bg-secondary-50 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4 text-secondary-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-sm font-medium text-gray-900">Ghi chú của bác sĩ</h4>
                              <span className="text-xs text-gray-500">{consult.doctor}</span>
                            </div>
                            <p className="text-sm text-gray-700 whitespace-pre-line">{consult.doctorNote}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {renderFeedbackSection(consult)}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Không có lịch tư vấn nào
                </div>
              )}
            </div>
          </div>
        );

      case 'arv-protocol':
        return (
          <div className="p-6 relative">
            {activeTab === 'arv-protocol' && (
              <div className="absolute right-6 top-0 z-20 flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  reminderStatus.followUp 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {reminderStatus.followUp ? 'Đã bật nhắc nhở tái khám' : 'Chưa bật nhắc nhở tái khám'}
                </span>
                <button
                  onClick={() => showModal(
                    'Nhắc nhở tái khám',
                    reminderStatus.followUp
                      ? 'Bạn có muốn tắt thông báo nhắc nhở lịch tái khám không?'
                      : 'Bạn có muốn nhận thông báo nhắc nhở lịch tái khám không?',
                    'success',
                    reminderStatus.followUp ? 'Tắt nhắc nhở' : 'Bật nhắc nhở',
                    () => {
                      setReminderStatus(prev => ({
                        ...prev,
                        followUp: !prev.followUp
                      }));
                      showModal(
                        reminderStatus.followUp ? 'Đã tắt nhắc nhở' : 'Đã bật nhắc nhở',
                        reminderStatus.followUp
                          ? 'Bạn sẽ không nhận thông báo nhắc nhở tái khám nữa.'
                          : 'Bạn sẽ nhận được thông báo nhắc nhở trước ngày tái khám 3 ngày.',
                        'success'
                      );
                    }
                  )}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-300 ${
                    reminderStatus.followUp
                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                      : 'bg-secondary-50 text-secondary-600 hover:bg-secondary-100'
                  }`}
                >
                  <CalendarIcon size={18} />
                  <span>{reminderStatus.followUp ? 'Tắt nhắc nhở' : 'Nhắc nhở tái khám'}</span>
                </button>
              </div>
            )}
            <div className="space-y-6">
              {/* Current Protocol */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Phác đồ hiện tại</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Ngày bắt đầu</p>
                      <p className="font-medium text-gray-900">01/01/2024</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Bác sĩ điều trị</p>
                      <p className="font-medium text-gray-900">BS. Nguyễn Văn B</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Medication Schedule */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900">Lịch uống thuốc</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      reminderStatus.medication 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {reminderStatus.medication ? 'Đã bật nhắc nhở' : 'Chưa bật nhắc nhở'}
                    </span>
                  </div>
                  <button
                    onClick={() => showModal(
                      'Nhắc nhở uống thuốc',
                      reminderStatus.medication 
                        ? 'Bạn có muốn tắt thông báo nhắc nhở uống thuốc không?'
                        : 'Bạn có muốn nhận thông báo nhắc nhở uống thuốc hàng ngày không?',
                      'success',
                      reminderStatus.medication ? 'Tắt nhắc nhở' : 'Bật nhắc nhở',
                      () => {
                        setReminderStatus(prev => ({
                          ...prev,
                          medication: !prev.medication
                        }));
                        showModal(
                          reminderStatus.medication ? 'Đã tắt nhắc nhở' : 'Đã bật nhắc nhở',
                          reminderStatus.medication 
                            ? 'Bạn sẽ không nhận thông báo nhắc nhở uống thuốc nữa.'
                            : 'Bạn sẽ nhận được thông báo nhắc nhở uống thuốc hàng ngày.',
                          'success'
                        );
                      }
                    )}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-300 ${
                      reminderStatus.medication
                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                        : 'bg-primary-50 text-primary-600 hover:bg-primary-100'
                    }`}
                  >
                    <Clock size={18} />
                    <span>{reminderStatus.medication ? 'Tắt nhắc nhở' : 'Nhắc nhở uống thuốc'}</span>
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">TDF/3TC/DTG</h4>
                        <p className="text-sm text-gray-600">1 viên/ngày</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        Đang sử dụng
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Protocol History */}
              <div className="flex justify-between items-center mb-4 relative">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-gray-900">Lịch sử phác đồ</h3>
                </div>
              </div>
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">Phác đồ cũ</h4>
                      <p className="text-sm text-gray-600">ABC/3TC/EFV</p>
                    </div>
                    <span className="text-sm text-gray-500">01/01/2023 - 31/12/2023</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderFeedbackSection = (service: ServiceItem) => {
    if (service.status !== 'Đã hoàn thành') return null;

    return (
      <div className="mt-4 pt-4 border-t border-gray-100">
        {service.rating ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {renderRatingStars(service.rating.rating)}
                <span className="text-sm text-gray-500">{service.rating.date}</span>
              </div>
              <button
                onClick={() => handleOpenRatingModal(service)}
                className="text-primary-600 hover:text-primary-700 transition-colors"
              >
                <Pencil size={16} />
              </button>
            </div>
            <p className="text-gray-700">{service.rating.comment}</p>
          </div>
        ) : (
          <button
            onClick={() => handleOpenRatingModal(service)}
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
          >
            <ThumbsUp size={16} />
            <span>Đánh giá dịch vụ</span>
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-primary-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary-600 mb-2">Tài khoản của tôi</h1>
            <p className="text-gray-600">Quản lý thông tin cá nhân và theo dõi dịch vụ y tế</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <nav className="p-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabType)}
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg
                          transition-all duration-300 ${activeTab === tab.id
                              ? `bg-${tab.color}-50 text-${tab.color}-600 font-medium`
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                    >
                      <tab.icon size={20} />
                      <span>{tab.label}</span>
                      {activeTab === tab.id && (
                        <ChevronRight size={16} className="ml-auto" />
                      )}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main content */}
            <div className="w-full">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  {/* Edit form */}
                  {activeTab === 'profile' && (
                    <div className="flex justify-end mb-6">
                      <div className="flex justify-end space-x-2 mb-4">
                        {isEditing ? (
                          <>
                            <button
                              onClick={handleSave}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              <Save className="mr-2 h-5 w-5" /> Lưu
                            </button>
                            <button
                              onClick={handleCancel}
                              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              <X className="mr-2 h-5 w-5" /> Hủy
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={handleEdit}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                              <Edit2 className="mr-2 h-5 w-5" /> Chỉnh sửa hồ sơ
                            </button>
                            <button
                              onClick={() => setShowChangePasswordModal(true)}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-gray-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                              <KeyRound className="mr-2 h-5 w-5" /> Đổi mật khẩu
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                  {renderTabContent()}
                </div>
                {isEditing && activeTab === 'profile' && (
                  <div className="flex justify-center gap-4 py-6 px-6 bg-gray-50 border-t border-gray-100">
                    <button
                      onClick={handleCancel}
                      className="inline-flex items-center gap-2 px-6 py-2.5 text-gray-600 hover:text-gray-700
                        bg-white hover:bg-gray-50 rounded-lg transition-all duration-300
                        font-medium shadow-sm hover:shadow-md border border-gray-200"
                    >
                      <X size={18} />
                      Hủy
                    </button>
                    <button
                      onClick={handleSave}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-500 text-white rounded-lg
                        hover:bg-primary-600 transition-all duration-300 font-medium shadow-sm
                        hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save size={18} />
                      Lưu thay đổi
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {renderRatingModal()}
      <Modal
        isOpen={modalState.isOpen}
        onClose={hideModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        buttonText={modalState.buttonText}
        onButtonClick={modalState.onButtonClick}
      />
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Xác nhận hủy lịch"
        message={`Bạn có chắc chắn muốn hủy lịch xét nghiệm "${selectedTestToCancel?.title}" không?`}
        type="error"
        buttonText="Xác nhận"
        onButtonClick={confirmCancelTest}
      />
      {showChangePasswordModal && (
        <Modal title="Đổi mật khẩu" isOpen={showChangePasswordModal} onClose={() => setShowChangePasswordModal(false)}>
          <div className="space-y-6 p-6 max-w-md ml-auto">
            {passwordError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{passwordError}</span>
              </div>
            )}
            <div>
              <div className="">
                <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  id="current-password"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <div className="">
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                <input
                  type="password"
                  id="new-password"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <div className="">
                <label htmlFor="confirm-new-password" className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  id="confirm-new-password"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowChangePasswordModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleChangePassword}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Đổi mật khẩu
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ProfilePage;
