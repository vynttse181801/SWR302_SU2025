import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  ThumbsUp
} from 'lucide-react';
import { User as UserType } from '../types';
import { useModal } from '../hooks/useModal';
import Modal from '../components/Modal';

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
  const [reminderStatus, setReminderStatus] = useState({
    medication: false,
    followUp: false
  });
  const [user, setUser] = useState<UserType>({
    id: '1',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    role: 'patient',
    phone: '0123456789',
    dateOfBirth: '1990-01-01',
    gender: 'male',
    address: '123 Đường ABC, Quận XYZ, TP.HCM',
    avatar: 'NA',
    medicalHistory: {
      bloodType: 'A+',
      allergies: ['Penicillin'],
      chronicDiseases: ['None'],
      medications: ['ARV']
    },
    lastCheckup: '2024-02-15',
    nextAppointment: '2024-03-15'
  });

  // Sample data for test history
  const testHistory: ServiceItem[] = [
    {
      id: '1',
      title: 'Xét nghiệm HIV',
      date: '15/02/2024',
      status: 'Hoàn thành',
      doctor: 'BS. Nguyễn Văn B',
      details: 'Kết quả: Âm tính',
      rating: {
        id: 'r1',
        rating: 4.5,
        comment: 'Dịch vụ rất tốt, nhân viên thân thiện',
        date: '16/02/2024'
      }
    },
    {
      id: '2',
      title: 'Xét nghiệm máu tổng quát',
      date: '01/02/2024',
      status: 'Hoàn thành',
      doctor: 'BS. Trần Thị C',
      details: 'Kết quả: Bình thường'
    }
  ];

  // Sample data for consultation history
  const consultationHistory: ServiceItem[] = [
    {
      id: '1',
      title: 'Tư vấn điều trị ARV',
      date: '20/02/2024',
      status: 'Đã hoàn thành',
      doctor: 'BS. Lê Văn D',
      details: 'Tư vấn về phác đồ điều trị ARV và các tác dụng phụ',
      rating: {
        id: 'r2',
        rating: 5,
        comment: 'Bác sĩ tư vấn rất nhiệt tình và chuyên nghiệp',
        date: '21/02/2024'
      }
    },
    {
      id: '2',
      title: 'Tư vấn dinh dưỡng',
      date: '15/02/2024',
      status: 'Đã hoàn thành',
      doctor: 'BS. Phạm Thị E',
      details: 'Tư vấn về chế độ dinh dưỡng phù hợp'
    }
  ];

  // Handle navigation state
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab as TabType);
    }
  }, [location.state]);

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
      id: '1',
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@example.com',
      role: 'patient',
      phone: '0123456789',
      dateOfBirth: '1990-01-01',
      gender: 'male',
      address: '123 Đường ABC, Quận XYZ, TP.HCM',
      avatar: 'NA',
      medicalHistory: {
        bloodType: 'A+',
        allergies: ['Penicillin'],
        chronicDiseases: ['None'],
        medications: ['ARV']
      },
      lastCheckup: '2024-02-15',
      nextAppointment: '2024-03-15'
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

  const handleRatingClick = (service: ServiceItem) => {
    setSelectedService(service);
    setRating(service.rating?.rating || 0);
    setComment(service.rating?.comment || '');
    setShowRatingModal(true);
  };

  const handleRatingSubmit = () => {
    if (selectedService) {
      // TODO: Implement API call to save rating
      const newRating: Rating = {
        id: selectedService.rating?.id || `r${Date.now()}`,
        rating,
        comment,
        date: new Date().toLocaleDateString('vi-VN')
      };

      // Update the service item with new rating
      if (activeTab === 'test-history') {
        const updatedHistory = testHistory.map(item => 
          item.id === selectedService.id ? { ...item, rating: newRating } : item
        );
        // TODO: Update state with API call
        console.log('Updated test history:', updatedHistory);
      } else if (activeTab === 'consultation-history') {
        const updatedHistory = consultationHistory.map(item => 
          item.id === selectedService.id ? { ...item, rating: newRating } : item
        );
        // TODO: Update state with API call
        console.log('Updated consultation history:', updatedHistory);
      }

      setShowRatingModal(false);
      setRating(0);
      setComment('');
      setSelectedService(null);
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
                onClick={handleRatingSubmit}
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
              onClick={() => handleRatingClick(item)}
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
            onClick={() => handleRatingClick(item)}
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
      label: 'Lịch sử xét nghiệm',
      icon: ClipboardList,
      color: 'secondary'
    },
    {
      id: 'consultation-history',
      label: 'Lịch sử tư vấn',
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
                      name="name"
                      value={user.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg
                        focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
                        transition-all duration-300"
                      placeholder="Nhập họ và tên"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-700">
                      <User size={16} className="text-primary-500" />
                      <span className="font-medium">{user.name}</span>
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
                      type="tel"
                      name="phone"
                      value={user.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg
                        focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
                        transition-all duration-300"
                      placeholder="Nhập số điện thoại"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone size={16} className="text-primary-500" />
                      <span className="font-medium">{user.phone}</span>
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
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-secondary-100 flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-secondary-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Lịch sử xét nghiệm</h2>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="space-y-4">
                {testHistory.map(renderServiceItem)}
              </div>
            </div>
          </div>
        );

      case 'consultation-history':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-secondary-100 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-secondary-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Lịch sử tư vấn</h2>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="space-y-4">
                {consultationHistory.map(renderServiceItem)}
              </div>
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
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1
                        transition-all duration-300 ${
                          activeTab === tab.id
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

            {/* Main Content */}
            <div className="flex-1">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  {activeTab === 'profile' && (
                    <div className="flex justify-end mb-6">
                      <button
                        onClick={handleEdit}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors duration-300"
                      >
                        <Edit2 size={18} />
                        {isEditing ? 'Hủy chỉnh sửa' : 'Chỉnh sửa'}
                      </button>
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
    </div>
  );
};

export default ProfilePage; 