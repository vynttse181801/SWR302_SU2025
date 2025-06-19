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
import { authService, patientService, testService, consultationService } from '../../services/api';
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
  time: string;
  status: string;
  doctor: string;
  details: string;
  rating?: Rating;
  doctorNote?: string;
  resultNote?: string;
  testType?: string;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // const { modalState, showModal, hideModal } = useModal();
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

  const { user: authUser, updateUser } = useAuth();

  const [patientId, setPatientId] = useState<number | null>(null);

  // Thêm state cho modal cập nhật
  const [showEditModal, setShowEditModal] = useState(false);
  const [editBooking, setEditBooking] = useState<ServiceItem | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [editTimeSlots, setEditTimeSlots] = useState<{id: number, time: string}[]>([]);
  const [editTestTypes, setEditTestTypes] = useState<any[]>([]);

  // State cho modal sửa/hủy tư vấn
  const [showEditConsultationModal, setShowEditConsultationModal] = useState(false);
  const [editConsultation, setEditConsultation] = useState<ServiceItem | null>(null);
  const [editConsultationForm, setEditConsultationForm] = useState<{notes: string}>({notes: ''});
  const [showCancelConsultationModal, setShowCancelConsultationModal] = useState(false);
  const [selectedConsultationToCancel, setSelectedConsultationToCancel] = useState<ServiceItem | null>(null);

  // Handle navigation state
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab as TabType);
    }
  }, [location.state]);

  useEffect(() => {
    if (authUser?.id) {
      api.get('/patients/me').then(res => {
        setPatientId(res.data.id);
        setUser((prev: UserType) => ({ ...prev, ...res.data }));
      });
    }
  }, [authUser?.id]);

  useEffect(() => {
    if (activeTab === 'test-history' && patientId) {
      api.get(`/lab-tests/patient/${patientId}`).then(res => {
        const sorted = res.data
          .map((item: any) => ({
            id: item.id,
            title: item.testTypeName || 'Xét nghiệm',
            date: item.date,
            time: convertTimeSlotIdToTime(item.timeSlot),
            status: item.status,
            doctor: item.doctorName || '',
            details: item.notes || '',
          }))
          .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setTestHistory(sorted);
      }).catch(() => setTestHistory([]));
    }
    if (activeTab === 'consultation-history' && patientId) {
      api.get(`/online-consultations/patient/${patientId}`).then(res => {
        setConsultationHistory(res.data.map((item: any) => ({
          id: item.id,
          title: item.consultationType || 'Tư vấn',
          date: item.startTime ? new Date(item.startTime).toLocaleDateString('vi-VN') : '',
          time: item.startTime ? new Date(item.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '',
          status: item.status || 'pending',
          doctor: item.doctorName || '',
          details: item.notes || '',
        })));
      }).catch(() => setConsultationHistory([]));
    }
  }, [activeTab, patientId]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const medicalHistory = user.medicalHistory || {
        bloodType: '',
        allergies: [],
        chronicDiseases: [],
        medications: []
      };

      const updateData = {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        address: user.address,
        medicalHistory: medicalHistory,
        allergies: medicalHistory.allergies,
        chronicDiseases: medicalHistory.chronicDiseases,
        medications: medicalHistory.medications,
        bloodType: medicalHistory.bloodType
      };

      const response = await patientService.updateProfile(updateData);
      
      // Update local state
      setUser(prev => ({
        ...prev,
        ...response.data
      }));

      // Update auth context
      if (authUser) {
        updateUser({
          ...authUser,
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber
        });
      }
      
      setIsEditing(false);
      toast.success('Cập nhật thông tin thành công!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin');
    }
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
    <div className="flex justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-10 mb-8 flex flex-col items-start max-w-2xl w-full min-h-[180px]">
        <div className="flex items-center w-full mb-2">
          <span className="font-bold text-lg text-gray-900">{item.title}</span>
          <span className={`ml-3 px-3 py-1 rounded-full text-xs font-semibold
            ${item.status === 'cancelled' ? 'bg-red-100 text-red-700' :
              item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
              'bg-green-100 text-green-700'}`}>
            {item.status === 'cancelled' ? 'Đã hủy' : item.status === 'pending' ? 'Chờ xác nhận' : 'Hoàn thành'}
          </span>
        </div>
        <div className="text-gray-700 mb-1">Ngày: <b>{item.date}</b> | Giờ: <b>{item.time}</b></div>
        {item.testType && <div className="text-gray-700 mb-1">Loại xét nghiệm: <b>{item.testType}</b></div>}
        <div className="text-gray-700 mb-2">Ghi chú: {item.details || <span className="italic text-gray-400">Không có</span>}</div>
        {(item.status === 'pending' || item.status === 'confirmed') && (
          <div className="flex gap-3 mt-2 self-end">
            <button onClick={() => handleEditBooking(item)}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition">Cập nhật</button>
            <button onClick={() => handleCancelTest(item)}
              className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition">Hủy</button>
          </div>
        )}
      </div>
    </div>
  );

  const handleCancelTest = (test: ServiceItem) => {
    setSelectedTestToCancel(test);
    setShowCancelModal(true);
  };

  const [selectedTestToCancel, setSelectedTestToCancel] = useState<ServiceItem | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const confirmCancelTest = async () => {
    if (selectedTestToCancel) {
      try {
        // Lấy thông tin booking hiện tại qua testService
        const res = await testService.getLabBookingById(selectedTestToCancel.id);
        const booking = res.data;
        
        // Gửi PUT để cập nhật status
        await testService.updateLabBooking(selectedTestToCancel.id, {
          ...booking,
          status: 'cancelled'
        });
        setTestHistory(prev => prev.map(test =>
          test.id === selectedTestToCancel.id ? { ...test, status: 'cancelled' } : test
        ));
        toast.success('Lịch xét nghiệm đã được hủy.');
      } catch (err: any) {
        toast.error('Hủy lịch thất bại. Vui lòng thử lại!');
      }
      setShowCancelModal(false);
      setSelectedTestToCancel(null);
    }
  };

  // Hàm mở modal cập nhật
  const handleEditBooking = async (booking: ServiceItem) => {
    setEditBooking(booking);
    setShowEditModal(true);
    // Lấy danh sách loại xét nghiệm
    const resTypes = await testService.getTestTypes();
    setEditTestTypes(resTypes.data);
    // Lấy khung giờ cho ngày hiện tại
    const resSlots = await testService.getLabTestTimeSlots(new Date(booking.date));
    setEditTimeSlots(resSlots.data.map((time: string, idx: number) => ({ id: idx + 1, time })));
    // Tìm id loại xét nghiệm hiện tại
    const currentType = resTypes.data.find((t: any) => t.name === booking.title);
    setEditForm({
      testTypeId: currentType ? currentType.id : '',
      date: booking.date,
      timeSlotId: editTimeSlots.find(slot => slot.time === booking.time)?.id || '',
      notes: booking.details || ''
    });
  };

  // Hàm lưu cập nhật
  const handleSaveEditBooking = async () => {
    if (!editBooking) return;
    try {
      // Lấy thông tin booking hiện tại
      const res = await testService.getLabBookingById(editBooking.id);
      const booking = res.data;
      // Gửi PUT để cập nhật
      await testService.updateLabBooking(editBooking.id, {
        ...booking,
        testTypeId: editForm.testTypeId,
        date: editForm.date,
        timeSlotId: editForm.timeSlotId,
        notes: editForm.notes,
        status: 'pending'
      });
      setTestHistory(prev => prev.map(test =>
        test.id === editBooking.id
          ? { ...test, title: editTestTypes.find(t => t.id === editForm.testTypeId)?.name || test.title, date: editForm.date, time: editTimeSlots.find(slot => slot.id === editForm.timeSlotId)?.time || test.time, details: editForm.notes, status: 'pending' }
          : test
      ));
      toast.success('Cập nhật lịch xét nghiệm thành công!');
      setShowEditModal(false);
      setEditBooking(null);
    } catch (err: any) {
      toast.error('Cập nhật thất bại. Vui lòng thử lại!');
    }
  };

  // Khi chọn lại ngày trong modal cập nhật, load lại khung giờ
  useEffect(() => {
    if (showEditModal && editForm.date) {
      (async () => {
        const resSlots = await testService.getLabTestTimeSlots(new Date(editForm.date));
        setEditTimeSlots(resSlots.data.map((time: string, idx: number) => ({ id: idx + 1, time })));
        // Nếu khung giờ cũ vẫn còn, giữ lại, nếu không thì reset
        if (!resSlots.data.find((time: string) => time === editTimeSlots.find(slot => slot.id === editForm.timeSlotId)?.time)) {
          setEditForm((prev: any) => ({ ...prev, timeSlotId: '' }));
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editForm.date, showEditModal]);

  const handleEditConsultation = (consult: ServiceItem) => {
    setEditConsultation(consult);
    setEditConsultationForm({ notes: consult.details || '' });
    setShowEditConsultationModal(true);
  };

  const handleSaveEditConsultation = async () => {
    if (!editConsultation) return;
    try {
      await consultationService.updateOnlineConsultation(editConsultation.id, { notes: editConsultationForm.notes });
      setConsultationHistory(prev => prev.map(c => c.id === editConsultation.id ? { ...c, details: editConsultationForm.notes } : c));
      setShowEditConsultationModal(false);
      toast.success('Cập nhật ghi chú thành công!');
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Cập nhật thất bại');
    }
  };

  const handleCancelConsultation = (consult: ServiceItem) => {
    setSelectedConsultationToCancel(consult);
    setShowCancelConsultationModal(true);
  };

  const confirmCancelConsultation = async () => {
    if (!selectedConsultationToCancel) return;
    try {
      await consultationService.deleteOnlineConsultation(selectedConsultationToCancel.id);
      setConsultationHistory(prev => prev.filter(c => c.id !== selectedConsultationToCancel.id));
      setShowCancelConsultationModal(false);
      toast.success('Đã hủy lịch tư vấn!');
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Hủy lịch thất bại');
    }
  };

  const renderConsultationItem = (item: ServiceItem) => (
    <div className="flex justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-10 mb-8 flex flex-col items-start max-w-2xl w-full min-h-[180px]">
        <div className="flex items-center w-full mb-2">
          <span className="font-bold text-lg text-gray-900">{item.title}</span>
          <span className={`ml-3 px-3 py-1 rounded-full text-xs font-semibold
            ${item.status === 'cancelled' ? 'bg-red-100 text-red-700' :
              item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
              'bg-green-100 text-green-700'}`}>
            {item.status === 'cancelled' ? 'Đã hủy' : item.status === 'pending' ? 'Chờ xác nhận' : 'Hoàn thành'}
          </span>
        </div>
        <div className="text-gray-700 mb-1">Ngày: <b>{item.date}</b> | Giờ: <b>{item.time}</b></div>
        {item.doctor && <div className="text-gray-700 mb-1">Bác sĩ: <b>{item.doctor}</b></div>}
        <div className="text-gray-700 mb-2">Ghi chú: {item.details || <span className="italic text-gray-400">Không có</span>}</div>
        {(item.status === 'pending' || item.status === 'confirmed') && (
          <div className="flex gap-3 mt-2 self-end">
            <button onClick={() => handleEditConsultation(item)}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition">Cập nhật</button>
            <button onClick={() => handleCancelConsultation(item)}
              className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition">Hủy</button>
          </div>
        )}
      </div>
    </div>
  );

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
                {consultationHistory.map(renderConsultationItem)}
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

  // Hàm chuyển đổi timeSlotId sang giờ
  const convertTimeSlotIdToTime = (timeSlot: any) => {
    // Nếu là string giờ thì trả về luôn
    if (typeof timeSlot === 'string' && timeSlot.match(/^\d{2}:\d{2}$/)) return timeSlot;
    // Nếu là số hoặc string số
    const slotId = Number(timeSlot);
    const slotMap = [
      '07:00', '08:00', '09:00', '10:00', '11:00',
      '13:00', '14:00', '15:00', '16:00'
    ];
    // slotId bắt đầu từ 1
    if (slotId >= 1 && slotId <= slotMap.length) return slotMap[slotId - 1];
    return '';
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
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 ${activeTab === tab.id ? `bg-${tab.color}-50 text-${tab.color}-600 font-medium` : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      <tab.icon size={20} className={`text-${tab.color}-500`} />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
      {showEditModal && (
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Cập nhật lịch xét nghiệm"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Loại xét nghiệm</label>
              <select value={editForm.testTypeId} onChange={e => setEditForm((prev: any) => ({ ...prev, testTypeId: Number(e.target.value) }))} className="w-full border rounded p-2">
                <option value="">Chọn loại xét nghiệm</option>
                {editTestTypes.map((type: any) => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ngày</label>
              <input type="date" value={editForm.date} onChange={e => setEditForm((prev: any) => ({ ...prev, date: e.target.value }))} className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Khung giờ</label>
              <select value={editForm.timeSlotId} onChange={e => setEditForm((prev: any) => ({ ...prev, timeSlotId: Number(e.target.value) }))} className="w-full border rounded p-2">
                <option value="">Chọn khung giờ</option>
                {editTimeSlots.map(slot => (
                  <option key={slot.id} value={slot.id}>{slot.time}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ghi chú</label>
              <textarea value={editForm.notes} onChange={e => setEditForm((prev: any) => ({ ...prev, notes: e.target.value }))} className="w-full border rounded p-2" rows={3} />
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={handleSaveEditBooking} className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">Lưu</button>
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Hủy</button>
            </div>
          </div>
        </Modal>
      )}
      {showCancelModal && (
        <Modal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          title="Xác nhận hủy lịch xét nghiệm"
        >
          <div className="space-y-4">
            <p>Bạn có chắc chắn muốn hủy lịch xét nghiệm này không?</p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={confirmCancelTest}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Hủy lịch
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Đóng
              </button>
            </div>
          </div>
        </Modal>
      )}
      {showEditConsultationModal && (
        <Modal isOpen={showEditConsultationModal} onClose={() => setShowEditConsultationModal(false)} title="Cập nhật ghi chú tư vấn">
          <div className="p-4">
            <textarea
              className="w-full border rounded p-2 mb-4"
              rows={4}
              value={editConsultationForm.notes}
              onChange={e => setEditConsultationForm({ notes: e.target.value })}
              placeholder="Nhập ghi chú mới..."
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowEditConsultationModal(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Hủy</button>
              <button onClick={handleSaveEditConsultation} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Lưu</button>
            </div>
          </div>
        </Modal>
      )}
      {showCancelConsultationModal && (
        <Modal isOpen={showCancelConsultationModal} onClose={() => setShowCancelConsultationModal(false)} title="Xác nhận hủy lịch tư vấn">
          <div className="p-4">
            <p>Bạn có chắc chắn muốn hủy lịch tư vấn này không?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowCancelConsultationModal(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Không</button>
              <button onClick={confirmCancelConsultation} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Hủy lịch</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ProfilePage;