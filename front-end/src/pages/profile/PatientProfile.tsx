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
  Bell,
  UserCircle
} from 'lucide-react';
import { User as UserType } from '../../types/index';
import { useModal } from '../../hooks/useModal';
import Modal from '../../components/Modal';
import { authService, patientService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { toast } from 'react-toastify';

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
    id: 0,
    name: '',
    fullName: '',
    email: '',
    phoneNumber: undefined,
    username: '',
    role: {
      id: 0,
      roleName: 'ROLE_PATIENT',
      description: 'Patient role'
    },
    dateOfBirth: '',
    gender: undefined,
    address: '',
    medicalHistory: {
      bloodType: '',
      allergies: [],
      chronicDiseases: [],
      medications: []
    },
    medicalRecordNumber: '',
    notes: '',
    lastCheckup: '',
    nextAppointment: '',
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
      patientService.getProfile()
        .then((res: { data: UserType }) => {
          setUser((prev: UserType) => ({
            ...prev,
            id: res.data.id,
            name: res.data.name || '',
            fullName: res.data.fullName || '',
            email: res.data.email || '',
            phoneNumber: res.data.phoneNumber || '',
            username: res.data.username || '',
            role: res.data.role || prev.role, // Preserve existing role if not provided
            dateOfBirth: res.data.dateOfBirth || '',
            gender: res.data.gender || undefined,
            address: res.data.address || '',
            medicalHistory: res.data.medicalHistory || {
              bloodType: '',
              allergies: [],
              chronicDiseases: [],
              medications: []
            },
            medicalRecordNumber: res.data.medicalRecordNumber || '',
            notes: res.data.notes || '',
            lastCheckup: res.data.lastCheckup || '',
            nextAppointment: res.data.nextAppointment || '',
          }));
        })
        .catch((err: any) => {
          console.error('Lỗi lấy thông tin user:', err);
          showModal('Lỗi', 'Không thể lấy thông tin hồ sơ. Vui lòng thử lại.', 'error');
        });
    }
  }, [authUser?.id, showModal]);

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
      id: 0,
      name: '',
      fullName: '',
      email: '',
      phoneNumber: undefined,
      username: '',
      role: {
        id: 0,
        roleName: 'ROLE_PATIENT',
        description: 'Patient role'
      },
      dateOfBirth: '',
      gender: undefined,
      address: '',
      medicalHistory: {
        bloodType: '',
        allergies: [],
        chronicDiseases: [],
        medications: []
      },
      medicalRecordNumber: '',
      notes: '',
      lastCheckup: '',
      nextAppointment: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('medicalHistory.')) {
      const field = name.split('.')[1];
      setUser((prev: UserType) => ({
        ...prev,
        medicalHistory: {
          ...prev.medicalHistory,
          [field]: field === 'allergies' || field === 'chronicDiseases' || field === 'medications'
            ? value.split(',').map(item => item.trim())
            : value
        }
      }));
    } else {
      setUser((prev: UserType) => ({
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
    setIsEditingFeedback(false);
    setEditingFeedbackId(null);
    toast.success('Feedback submitted successfully!');
  };

  const handleChangePassword = async () => {
    setPasswordError(null);
    if (newPassword !== confirmNewPassword) {
      setPasswordError('Mật khẩu mới và xác nhận mật khẩu không khớp.');
      return;
    }
    if (!currentPassword || !newPassword) {
      setPasswordError('Vui lòng nhập đầy đủ mật khẩu hiện tại và mật khẩu mới.');
      return;
    }

    try {
      if (authUser?.id) {
        await authService.changePassword(authUser.id.toString(), { currentPassword, newPassword });
        setShowChangePasswordModal(false);
        toast.success('Mật khẩu đã được thay đổi thành công!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      }
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại.');
    }
  };

  const renderRatingStars = (rating: number, interactive = false) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={interactive ? 24 : 18}
          fill={i <= (hoveredRating || rating) ? 'gold' : 'none'}
          stroke={i <= (hoveredRating || rating) ? 'gold' : '#ccc'}
          className={`cursor-${interactive ? 'pointer' : 'default'}`}
          onMouseEnter={interactive ? () => setHoveredRating(i) : undefined}
          onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
          onClick={interactive ? () => setRating(i) : undefined}
        />
      );
    }
    return <div className="flex">{stars}</div>;
  };

  const getStarColor = (star: number) => {
    if (hoveredRating >= star) return 'gold';
    if (!hoveredRating && rating >= star) return 'gold';
    return '#ccc';
  };

  const renderRatingModal = () => (
    <Modal
      title={isEditingFeedback ? "Chỉnh sửa đánh giá" : "Đánh giá dịch vụ"}
      isOpen={showRatingModal}
      onClose={() => setShowRatingModal(false)}
    >
      <div className="p-6 space-y-4">
        {selectedService && (
          <p className="text-gray-700">Đánh giá cho: <span className="font-semibold">{selectedService.title}</span></p>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Số sao đánh giá:</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={32}
                fill={star <= (hoveredRating || rating) ? 'gold' : 'none'}
                stroke={star <= (hoveredRating || rating) ? 'gold' : '#ccc'}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">Bình luận:</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="Viết bình luận của bạn..."
          />
        </div>
        <div className="flex justify-end space-x-3 mt-4">
          <button
            type="button"
            onClick={() => setShowRatingModal(false)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSubmitFeedback}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {isEditingFeedback ? "Cập nhật đánh giá" : "Gửi đánh giá"}
          </button>
        </div>
      </div>
    </Modal>
  );

  const renderServiceItem = (item: ServiceItem) => (
    <div key={item.id} className="bg-white rounded-lg shadow-sm p-4 mb-4 border border-gray-100 last:mb-0">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
          <p className="text-sm text-gray-600">Ngày: {item.date}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          item.status === 'completed' ? 'bg-green-100 text-green-800' :
          item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {item.status === 'completed' ? 'Hoàn thành' :
           item.status === 'pending' ? 'Chờ xác nhận' :
           'Đã hủy'}
        </span>
      </div>
      <p className="text-sm text-gray-700 mb-2">Bác sĩ: {item.doctor}</p>
      <p className="text-sm text-gray-700 mb-3">{item.details}</p>

      {item.rating ? (
        <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
          Đánh giá của bạn: {renderRatingStars(item.rating.rating)}
          <span className="text-gray-500 ml-2">"{item.rating.comment}"</span>
          <button
            onClick={() => handleOpenRatingModal(item)}
            className="ml-auto text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            <Pencil size={16} /> Chỉnh sửa
          </button>
        </div>
      ) : (
        item.status === 'completed' && (
          <button
            onClick={() => handleOpenRatingModal(item)}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
          >
            <Star size={16} /> Đánh giá dịch vụ
          </button>
        )
      )}

      {item.doctorNote && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mt-3 rounded-md">
          <p className="text-sm font-medium text-blue-800 flex items-center gap-2"><ClipboardList size={16} /> Ghi chú của Bác sĩ:</p>
          <p className="text-sm text-blue-700 mt-1">{item.doctorNote}</p>
        </div>
      )}

      {item.resultNote && (
        <div className="bg-purple-50 border-l-4 border-purple-400 p-3 mt-3 rounded-md">
          <p className="text-sm font-medium text-purple-800 flex items-center gap-2"><FileText size={16} /> Kết quả xét nghiệm:</p>
          <p className="text-sm text-purple-700 mt-1">{item.resultNote}</p>
        </div>
      )}
      {item.status === 'pending' && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => handleCancelTest(item)}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Hủy lịch
          </button>
        </div>
      )}
    </div>
  );

  const handleCancelTest = (test: ServiceItem) => {
    setSelectedTestToCancel(test);
    setShowCancelModal(true);
  };

  const [selectedTestToCancel, setSelectedTestToCancel] = useState<ServiceItem | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const confirmCancelTest = () => {
    if (selectedTestToCancel) {
      setTestHistory(prev => prev.map(test =>
        test.id === selectedTestToCancel.id ? { ...test, status: 'cancelled' } : test
      ));
      setShowCancelModal(false);
      toast.success('Lịch xét nghiệm đã được hủy.');
      setSelectedTestToCancel(null);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Thông tin cá nhân</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-center gap-3">
                <User size={20} className="text-primary-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Họ và tên</p>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={user.fullName || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  ) : (
                    <p className="text-gray-900 font-semibold">{user.fullName || 'Chưa cập nhật'}</p>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-center gap-3">
                <Mail size={20} className="text-primary-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={user.email}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  ) : (
                    <p className="text-gray-900 font-semibold">{user.email}</p>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-center gap-3">
                <Phone size={20} className="text-primary-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Số điện thoại</p>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={user.phoneNumber || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  ) : (
                    <p className="text-gray-900 font-semibold">{user.phoneNumber || 'Chưa cập nhật'}</p>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-center gap-3">
                <Calendar size={20} className="text-primary-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Ngày sinh</p>
                  {isEditing ? (
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={user.dateOfBirth || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  ) : (
                    <p className="text-gray-900 font-semibold">{user.dateOfBirth || 'Chưa cập nhật'}</p>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-center gap-3">
                <UserCircle size={20} className="text-primary-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Giới tính</p>
                  {isEditing ? (
                    <select
                      name="gender"
                      value={user.gender || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 font-semibold">{user.gender?.toLowerCase() === 'male' ? 'Nam' : user.gender?.toLowerCase() === 'female' ? 'Nữ' : user.gender?.toLowerCase() === 'other' ? 'Khác' : 'Chưa cập nhật'}</p>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-center gap-3">
                <MapPin size={20} className="text-primary-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Địa chỉ</p>
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={user.address || ''}
                      onChange={handleChange}
                      rows={2}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  ) : (
                    <p className="text-gray-900 font-semibold">{user.address || 'Chưa cập nhật'}</p>
                  )}
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Thông tin y tế</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-center gap-3">
                <Droplet size={20} className="text-red-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Nhóm máu</p>
                  {isEditing ? (
                    <input
                      type="text"
                      name="medicalHistory.bloodType"
                      value={user.medicalHistory?.bloodType || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    />
                  ) : (
                    <p className="text-gray-900 font-semibold">{user.medicalHistory?.bloodType || 'Không có'}</p>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-center gap-3">
                <AlertTriangle size={20} className="text-yellow-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Dị ứng</p>
                  {isEditing ? (
                    <textarea
                      name="medicalHistory.allergies"
                      value={user.medicalHistory?.allergies?.join(', ') || ''}
                      onChange={handleChange}
                      rows={2}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                    />
                  ) : (
                    <p className="text-gray-900 font-semibold">{user.medicalHistory?.allergies?.join(', ') || 'Không có'}</p>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-center gap-3">
                <ClipboardList size={20} className="text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Bệnh mãn tính</p>
                  {isEditing ? (
                    <textarea
                      name="medicalHistory.chronicDiseases"
                      value={user.medicalHistory?.chronicDiseases?.join(', ') || ''}
                      onChange={handleChange}
                      rows={2}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                  ) : (
                    <p className="text-gray-900 font-semibold">{user.medicalHistory?.chronicDiseases?.join(', ') || 'Không có'}</p>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-center gap-3">
                <Pill size={20} className="text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Thuốc đang sử dụng</p>
                  {isEditing ? (
                    <textarea
                      name="medicalHistory.medications"
                      value={user.medicalHistory?.medications?.join(', ') || ''}
                      onChange={handleChange}
                      rows={2}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  ) : (
                    <p className="text-gray-900 font-semibold">{user.medicalHistory?.medications?.join(', ') || 'Không có'}</p>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-center gap-3">
                <Clock size={20} className="text-indigo-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Lần khám gần nhất</p>
                  {isEditing ? (
                    <input
                      type="date"
                      name="lastCheckup"
                      value={user.lastCheckup || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  ) : (
                    <p className="text-gray-900 font-semibold">{user.lastCheckup || 'Chưa có'}</p>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-center gap-3">
                <CalendarIcon size={20} className="text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Lịch hẹn tiếp theo</p>
                  {isEditing ? (
                    <input
                      type="date"
                      name="nextAppointment"
                      value={user.nextAppointment || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    />
                  ) : (
                    <p className="text-gray-900 font-semibold">{user.nextAppointment || 'Chưa có'}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Cài đặt thông báo</h2>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell size={20} className="text-teal-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Nhắc nhở uống thuốc</p>
                    <p className="text-xs text-gray-500">Nhận thông báo để không bỏ lỡ liều thuốc.</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    value=""
                    className="sr-only peer"
                    checked={reminderStatus.medication}
                    onChange={() => setReminderStatus(prev => ({ ...prev, medication: !prev.medication }))}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-center justify-between mt-4">
                <div className="flex items-center gap-3">
                  <Bell size={20} className="text-teal-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Nhắc nhở tái khám</p>
                    <p className="text-xs text-gray-500">Nhận thông báo cho lịch hẹn tái khám định kỳ.</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    value=""
                    className="sr-only peer"
                    checked={reminderStatus.followUp}
                    onChange={() => setReminderStatus(prev => ({ ...prev, followUp: !prev.followUp }))}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>
            </div>
          </>
        );
      case 'test-history':
        return (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Lịch sử xét nghiệm</h2>
            {testHistory.length === 0 ? (
              <p className="text-gray-600">Chưa có lịch sử xét nghiệm nào.</p>
            ) : (
              <div>
                {testHistory.map(renderServiceItem)}
              </div>
            )}
          </>
        );
      case 'consultation-history':
        return (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Lịch sử tư vấn</h2>
            {consultationHistory.length === 0 ? (
              <p className="text-gray-600">Chưa có lịch sử tư vấn nào.</p>
            ) : (
              <div>
                {consultationHistory.map(renderServiceItem)}
              </div>
            )}
          </>
        );
      case 'arv-protocol':
        return (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Phác đồ ARV</h2>
            <p className="text-gray-600">Thông tin chi tiết về phác đồ ARV của bạn sẽ hiển thị tại đây.</p>
            {/* Example content, replace with actual data */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-6 rounded-md">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Phác đồ hiện tại:</h3>
              <p className="text-sm text-blue-700">Tên phác đồ: <span className="font-medium">Tenofovir + Lamivudine + Dolutegravir</span></p>
              <p className="text-sm text-blue-700">Ngày bắt đầu: <span className="font-medium">01/01/2023</span></p>
              <p className="text-sm text-blue-700">Liều lượng: <span className="font-medium">1 viên/ngày</span></p>
              <p className="text-sm text-blue-700">Bác sĩ kê đơn: <span className="font-medium">Dr. Nguyễn Văn A</span></p>
              <p className="text-sm text-blue-700 mt-2">Ghi chú: <span className="font-medium">Uống vào cùng một thời điểm mỗi ngày.</span></p>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6 rounded-md">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Lịch sử phác đồ:</h3>
              <ul className="list-disc pl-5 text-sm text-yellow-700">
                <li><span className="font-medium">Efavirenz + Lamivudine + Tenofovir</span> (01/07/2022 - 31/12/2022)</li>
                <li><span className="font-medium">Nevirapine + Lamivudine + Zidovudine</span> (01/01/2022 - 30/06/2022)</li>
              </ul>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const tabs = [
    { id: 'profile', label: 'Thông tin cá nhân', icon: User, color: 'primary' },
    { id: 'test-history', label: 'Lịch xét nghiệm', icon: ClipboardList, color: 'secondary' },
    { id: 'consultation-history', label: 'Lịch tư vấn', icon: MessageSquare, color: 'accent' },
    { id: 'arv-protocol', label: 'Phác đồ ARV', icon: PillIcon, color: 'green' },
  ];

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
