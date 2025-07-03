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
  UserCircle,
  Edit,
  Lock
} from 'lucide-react';
import { User as UserType } from '../../types/index';
import { useModal } from '../../hooks/useModal';
import Modal from '../../components/Modal';
import { authService, patientService, testService, consultationService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { labResultService } from '../../services/api';
import { staffService } from '../../services/api';
import { medicationService, prescriptionService } from '../../services/api';

type TabType = 'profile' | 'test-booking' | 'test-history' | 'consultation-history' | 'arv-protocol' | 'reminders' | 'medication-schedule';

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

// PrescriptionForm cho bác sĩ kê đơn thuốc cho bệnh nhân
const PrescriptionForm: React.FC<{ patientId: number, treatmentPlans: any[], onSuccess: () => void }> = ({ patientId, treatmentPlans, onSuccess }) => {
  const [medications, setMedications] = useState<any[]>([]);
  const [form, setForm] = useState({
    treatmentPlanId: '',
    medicationId: '',
    dosage: '',
    frequency: '',
    durationDays: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    medicationService.getAllMedications().then(res => setMedications(res.data || []));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.treatmentPlanId || !form.medicationId || !form.dosage || !form.frequency || !form.durationDays) {
      toast.error('Vui lòng nhập đủ thông tin!');
      return;
    }
    setLoading(true);
    try {
      // Lấy ngày bắt đầu điều trị từ phác đồ
      const selectedPlan = treatmentPlans.find(plan => plan.id === Number(form.treatmentPlanId));
      const startDate = selectedPlan?.startDate;
      await prescriptionService.createPrescription({
        treatmentPlan: { id: Number(form.treatmentPlanId) },
        medication: { id: Number(form.medicationId) },
        dosage: form.dosage,
        frequency: form.frequency,
        durationDays: Number(form.durationDays),
        notes: form.notes,
        startDate: startDate // nếu backend cần trường này
      });
      toast.success('Kê đơn thuốc thành công!');
      setForm({ treatmentPlanId: '', medicationId: '', dosage: '', frequency: '', durationDays: '', notes: '' });
      onSuccess();
    } catch {
      toast.error('Kê đơn thuốc thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 mb-6">
      <h4 className="font-semibold mb-2">Kê đơn thuốc ARV</h4>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Phác đồ điều trị</label>
        <select name="treatmentPlanId" className="w-full border rounded px-3 py-2" value={form.treatmentPlanId} onChange={handleChange} required>
          <option value="">-- Chọn phác đồ --</option>
          {treatmentPlans.map(plan => (
            <option key={plan.id} value={plan.id}>{plan.notes || `Phác đồ #${plan.id}`} (Bắt đầu: {plan.startDate})</option>
          ))}
        </select>
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Thuốc</label>
        <select name="medicationId" className="w-full border rounded px-3 py-2" value={form.medicationId} onChange={handleChange} required>
          <option value="">-- Chọn thuốc --</option>
          {medications.map(med => (
            <option key={med.id} value={med.id}>{med.name}</option>
          ))}
        </select>
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Liều lượng</label>
        <input name="dosage" className="w-full border rounded px-3 py-2" value={form.dosage} onChange={handleChange} required />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Giờ uống (cách nhau bằng dấu phẩy, VD: 07:00,19:00)</label>
        <input name="frequency" className="w-full border rounded px-3 py-2" value={form.frequency} onChange={handleChange} required />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Số ngày điều trị</label>
        <input name="durationDays" type="number" min="1" className="w-full border rounded px-3 py-2" value={form.durationDays} onChange={handleChange} required />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Ghi chú</label>
        <textarea name="notes" className="w-full border rounded px-3 py-2" value={form.notes} onChange={handleChange} />
      </div>
      <button type="submit" className="btn-gradient-primary px-4 py-2 rounded text-white" disabled={loading}>{loading ? 'Đang lưu...' : 'Kê đơn'}</button>
    </form>
  );
};

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
    phoneNumber: '',
    username: '',
    role: {
      id: 0,
      roleName: 'ROLE_PATIENT',
      description: 'Patient role'
    },
    dateOfBirth: '',
    gender: '',
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
  const [editForm, setEditForm] = useState<{
    testTypeId: number | string;
    date: string;
    timeSlotId: number | string;
    notes: string;
  }>({
    testTypeId: '',
    date: '',
    timeSlotId: '',
    notes: ''
  });
  const [editTimeSlots, setEditTimeSlots] = useState<{id: number, time: string}[]>([]);
  const [editTestTypes, setEditTestTypes] = useState<any[]>([]);

  // State cho modal sửa/hủy tư vấn
  const [showEditConsultationModal, setShowEditConsultationModal] = useState(false);
  const [editConsultation, setEditConsultation] = useState<ServiceItem | null>(null);
  const [editConsultationForm, setEditConsultationForm] = useState<{notes: string}>({notes: ''});
  const [showCancelConsultationModal, setShowCancelConsultationModal] = useState(false);
  const [selectedConsultationToCancel, setSelectedConsultationToCancel] = useState<ServiceItem | null>(null);

  const [labResults, setLabResults] = useState<any[]>([]);

  const [treatmentPlans, setTreatmentPlans] = useState<any[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);

  const [reminders, setReminders] = useState<any[]>([]);

  const [selectedEventId, setSelectedEventId] = useState('');

  const [showEditReminderModal, setShowEditReminderModal] = useState(false);
  const [editReminder, setEditReminder] = useState<any>(null);

  // Thêm state cho lịch uống thuốc
  interface MedicationScheduleItem {
    id: number;
    intakeTime: string;
    status: string;
    [key: string]: any;
  }
  const [medicationSchedules, setMedicationSchedules] = useState<MedicationScheduleItem[]>([]);

  const [reminderStatusFilter, setReminderStatusFilter] = useState('');
  const [reminderTypeFilter, setReminderTypeFilter] = useState('');

  // Lấy lịch uống thuốc khi có patientId
  useEffect(() => {
    if (patientId) {
      medicationService.getMedicationSchedulesByPatient(patientId).then(res => {
        let data = res.data;
        if (!Array.isArray(data)) data = [];
        setMedicationSchedules(data);
      }).catch(() => setMedicationSchedules([]));
    }
  }, [patientId]);

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
    if (patientId) {
      // Lấy lịch xét nghiệm
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

      // Lấy lịch tư vấn
      api.get(`/online-consultations/patient/${patientId}`).then(res => {
        setConsultationHistory(res.data.map((item: any) => ({
          id: item.id,
          title: item.consultationType || 'Tư vấn',
          date: item.startTime ? item.startTime.slice(0, 10) : '', // yyyy-mm-dd
          time: item.startTime ? item.startTime.slice(11, 16) : '', // HH:mm
          status: item.status || 'pending',
          doctor: item.doctorName || '',
          details: item.notes || '',
        })));
      }).catch(() => setConsultationHistory([]));

      // Lấy kế hoạch uống thuốc
      api.get(`/patient-treatment-plans?patientId=${patientId}`)
        .then(res => setTreatmentPlans(res.data || []))
        .catch(() => setTreatmentPlans([]));
    }
  }, [patientId]);

  useEffect(() => {
    if (activeTab === 'test-history' && patientId) {
      labResultService.getLabResultsByPatient(patientId).then(res => {
        setLabResults(res.data);
      }).catch(() => setLabResults([]));
    }
  }, [activeTab, patientId]);

  useEffect(() => {
    if (activeTab === 'arv-protocol' && patientId) {
      setLoadingPlans(true);
      api.get(`/patient-treatment-plans?patientId=${patientId}`)
        .then(res => setTreatmentPlans(res.data || []))
        .catch(() => setTreatmentPlans([]))
        .finally(() => setLoadingPlans(false));
    }
  }, [activeTab, patientId]);

  useEffect(() => {
    if (patientId) {
      staffService.getRemindersByPatient(patientId).then(res => {
        const mapped = (res.data || []).map((reminder: any) => ({
          id: reminder.id,
          createdBy: reminder.createdBy ? { id: reminder.createdBy.id } : undefined,
          patient: reminder.patient ? { id: reminder.patient.id } : undefined,
          reminderType: reminder.reminderType,
          reminderDate: reminder.reminderDate,
          status: reminder.status,
          notes: reminder.notes,
          priority: reminder.priority
        }));
        setReminders(mapped);
      }).catch(() => setReminders([]));
    }
  }, [patientId]);

  useEffect(() => {
    if (reminders.length > 0) {
      reminders.forEach(reminder => {
        if (
          reminder.status === 'SENT' &&
          reminder.reminderDate
        ) {
          toast.info(
            `Bạn có nhắc nhở: ${reminder.reminderType} lúc ${reminder.reminderDate.replace('T', ' ')}`,
            { autoClose: 10000 }
          );
        }
      });
    }
  }, [reminders]);

  // GỌI LẠI API LẤY LỊCH KHI VÀO TAB 'reminders'
  useEffect(() => {
    if (activeTab === 'reminders' && patientId) {
      // Lấy lịch xét nghiệm
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

      // Lấy lịch tư vấn
      api.get(`/online-consultations/patient/${patientId}`).then(res => {
        setConsultationHistory(res.data.map((item: any) => ({
          id: item.id,
          title: item.consultationType || 'Tư vấn',
          date: item.startTime ? item.startTime.slice(0, 10) : '', // yyyy-mm-dd
          time: item.startTime ? item.startTime.slice(11, 16) : '', // HH:mm
          status: item.status || 'pending',
          doctor: item.doctorName || '',
          details: item.notes || '',
        })));
      }).catch(() => setConsultationHistory([]));

      // Lấy kế hoạch uống thuốc
      api.get(`/patient-treatment-plans?patientId=${patientId}`)
        .then(res => setTreatmentPlans(res.data || []))
        .catch(() => setTreatmentPlans([]));
    }
  }, [activeTab, patientId]);

  // Lấy lịch uống thuốc khi vào tab 'medication-schedule'
  useEffect(() => {
    if (activeTab === 'medication-schedule' && patientId) {
      medicationService.getMedicationSchedulesByPatient(patientId).then(res => {
        let data = res.data;
        if (!Array.isArray(data)) data = [];
        setMedicationSchedules(data);
      }).catch(() => setMedicationSchedules([]));
    }
  }, [activeTab, patientId]);

  useEffect(() => {
    staffService.getRemindersByPatient(user.id, reminderStatusFilter || undefined, reminderTypeFilter || undefined).then(res => {
      const mapped = (res.data || []).map((reminder: any) => ({
        id: reminder.id,
        createdBy: reminder.createdBy ? { id: reminder.createdBy.id } : undefined,
        patient: reminder.patient ? { id: reminder.patient.id } : undefined,
        reminderType: reminder.reminderType || reminder.type,
        reminderDate: reminder.reminderDate || (reminder.dueDate + (reminder.dueTime ? `T${reminder.dueTime}` : '')),
        status: reminder.status || "PENDING",
        notes: reminder.notes,
        priority: reminder.priority
      }));
      setReminders(mapped);
    });
  }, [user.id, reminderStatusFilter, reminderTypeFilter]);

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
      phoneNumber: '',
      username: '',
      role: {
        id: 0,
        roleName: 'ROLE_PATIENT',
        description: 'Patient role'
      },
      dateOfBirth: '',
      gender: '',
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
    
    // Validation
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordError('Vui lòng nhập đầy đủ tất cả các trường.');
      return;
    }
    
    if (newPassword !== confirmNewPassword) {
      setPasswordError('Mật khẩu mới và xác nhận mật khẩu không khớp.');
      return;
    }
    
    // Password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setPasswordError('Mật khẩu phải dài ít nhất 8 ký tự, bao gồm ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt.');
      return;
    }

    try {
      await authService.changePassword('', { currentPassword, newPassword });
      setShowChangePasswordModal(false);
      toast.success('Mật khẩu đã được thay đổi thành công!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
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
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              {!isEditing ? (
                <>
                  <button
                    onClick={handleEdit}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  >
                    <Edit size={20} />
                    Chỉnh sửa thông tin
                  </button>
                  <button
                    onClick={() => setShowChangePasswordModal(true)}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors font-medium"
                  >
                    <Lock size={20} />
                    Đổi mật khẩu
                  </button>
                </>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleSave}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    <Save size={20} />
                    Lưu thay đổi
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                  >
                    <X size={20} />
                    Hủy
                  </button>
                </div>
              )}
            </div>
          </>
        );
      case 'test-booking':
        return (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Lịch xét nghiệm</h2>
            {testHistory.length === 0 ? (
              <p className="text-gray-600">Chưa có lịch xét nghiệm nào.</p>
            ) : (
              <div>
                {testHistory.map((item) => (
                  <div key={item.id}>
                    {renderServiceItem(item)}
                  </div>
                ))}
              </div>
            )}
          </>
        );
      case 'test-history':
        return (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Lịch sử kết quả xét nghiệm</h2>
            {labResults.length === 0 ? (
              <p className="text-gray-600">Chưa có kết quả xét nghiệm nào.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ngày</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Loại xét nghiệm</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Kết quả</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Đơn vị</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Khoảng bình thường</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {labResults.map(result => (
                      <tr key={result.id}>
                        <td className="px-4 py-2 whitespace-nowrap">{result.testDate}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{result.testType?.name || ''}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{result.resultValue}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{result.unit}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{result.normalRange}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{result.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                {consultationHistory.map((item) => (
                  <div key={item.id}>
                    {renderConsultationItem(item)}
                  </div>
                ))}
              </div>
            )}
          </>
        );
      case 'arv-protocol':
        return renderArvProtocolTab();
      case 'reminders':
        return renderReminders();
      case 'medication-schedule':
        return (
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <h2 className="text-2xl font-bold text-blue-700 mb-4 flex items-center gap-2">
              <Pill className="text-blue-500" /> Lịch uống thuốc
            </h2>
            {medicationSchedules.length === 0 ? (
              <p className="text-gray-500 italic">Chưa có lịch uống thuốc</p>
            ) : (
              <div className="overflow-x-auto rounded-xl shadow border border-gray-200 my-4">
                <table className="min-w-full text-sm bg-white rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700">
                      <th className="px-4 py-2 border-b text-center font-semibold">Thời gian uống</th>
                      <th className="px-4 py-2 border-b text-center font-semibold">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicationSchedules.map((schedule, idx) => (
                      <tr key={schedule.id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border-b px-4 py-2 text-center">{new Date(schedule.intakeTime).toLocaleString('vi-VN')}</td>
                        <td className="border-b px-4 py-2 text-center">{schedule.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const renderArvProtocolTab = () => (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold text-primary-700 mb-4 flex items-center gap-2">
        <PillIcon className="text-primary-600" /> Phác đồ ARV của bạn
      </h2>
      {loadingPlans ? (
        <p>Đang tải...</p>
      ) : treatmentPlans.length === 0 ? (
        <p className="text-gray-500 italic">Chưa có phác đồ ARV</p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow border border-gray-200 my-4">
          <table className="min-w-full text-sm bg-white rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700">
                <th className="px-4 py-2 border-b text-center font-semibold">Ngày bắt đầu</th>
                <th className="px-4 py-2 border-b text-center font-semibold">Phác đồ</th>
                <th className="px-4 py-2 border-b text-center font-semibold">Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {treatmentPlans.map((plan, idx) => (
                <tr key={plan.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border-b px-4 py-2 text-center">{new Date(plan.startDate).toLocaleDateString('vi-VN')}</td>
                  <td className="border-b px-4 py-2">{plan.arvProtocol?.name || ''}</td>
                  <td className="border-b px-4 py-2">{plan.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {authUser?.role?.roleName === 'ROLE_DOCTOR' && patientId && (
        <PrescriptionForm patientId={patientId} treatmentPlans={treatmentPlans} onSuccess={() => {}} />
      )}
    </div>
  );

  const [showCreateReminderModal, setShowCreateReminderModal] = useState(false);
  const [reminderForm, setReminderForm] = useState({
    reminderType: 'MEDICATION',
    reminderDate: '',
    notes: '',
    priority: 'MEDIUM'
  });

  // Tổng hợp các sự kiện sắp tới cho dropdown gợi ý
  const now = new Date();
  const upcomingEvents = [
    // Lịch hẹn tư vấn
    ...consultationHistory.filter(item => {
      const d = new Date(item.date + 'T' + (item.time || '00:00'));
      return d >= now;
    }).map(item => ({
      id: 'consult-' + item.id,
      type: 'APPOINTMENT',
      label: `Lịch tư vấn: ${item.date} ${item.time}`,
      date: item.date + 'T' + (item.time ? item.time : '00:00'),
      notes: item.details || ''
    })),
    // Lịch xét nghiệm
    ...testHistory.filter(item => {
      const d = new Date(item.date + 'T' + (item.time || '00:00'));
      return d >= now;
    }).map(item => ({
      id: 'test-' + item.id,
      type: 'TEST',
      label: `Lịch xét nghiệm: ${item.date} ${item.time}`,
      date: item.date + 'T' + (item.time ? item.time : '00:00'),
      notes: item.details || ''
    })),
    // Lịch uống thuốc từ treatmentPlans (nếu có)
    ...treatmentPlans.filter(plan => plan.nextMedicationDate).map(plan => ({
      id: 'med-' + plan.id,
      type: 'MEDICATION',
      label: `Uống thuốc: ${plan.nextMedicationDate}`,
      date: plan.nextMedicationDate,
      notes: plan.notes || ''
    }))
  ];

  const handleCreateReminder = async () => {
    if (!reminderForm.reminderType || !reminderForm.reminderDate) {
      toast.error('Vui lòng nhập đủ thông tin!');
      return;
    }
    const now = new Date();
    const selectedDate = new Date(reminderForm.reminderDate);
    if (selectedDate <= now) {
      toast.error('Vui lòng chọn thời gian nhắc nhở trong tương lai!');
      return;
    }
    try {
      await staffService.createReminder({
        reminderType: reminderForm.reminderType,
        reminderDate: reminderForm.reminderDate,
        status: 'SENT',
        patient: { id: user.id },
        createdBy: { id: user.id },
        notes: reminderForm.notes,
        priority: reminderForm.priority
      });
      toast.success('Tạo nhắc nhở thành công!');
      setShowCreateReminderModal(false);
      setReminderForm({ reminderType: 'MEDICATION', reminderDate: '', notes: '', priority: 'MEDIUM' });
      // Reload reminders
      staffService.getRemindersByPatient(user.id).then(res => {
        const mapped = (res.data || []).map((reminder: any) => ({
          id: reminder.id,
          createdBy: reminder.createdBy ? { id: reminder.createdBy.id } : undefined,
          patient: reminder.patient ? { id: reminder.patient.id } : undefined,
          reminderType: reminder.reminderType,
          reminderDate: reminder.reminderDate,
          status: reminder.status,
          notes: reminder.notes,
          priority: reminder.priority
        }));
        setReminders(mapped);
      });
    } catch {
      toast.error('Tạo nhắc nhở thất bại!');
    }
  };

  const renderReminders = () => {
    return (
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        {/* Cài đặt thông báo */}
        <div className="mb-6">
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
                onChange={async () => {
                  const newValue = !reminderStatus.medication;
                  setReminderStatus(prev => ({ ...prev, medication: newValue }));
                  if (newValue && patientId && user?.id) {
                    try {
                      await staffService.createMedicationRemindersFromSchedules(patientId, user.id);
                      toast.success('Đã tạo nhắc nhở uống thuốc từ lịch có sẵn!');
                      staffService.getRemindersByPatient(patientId).then(res => {
                        const mapped = (res.data || []).map((reminder: any) => ({
                          id: reminder.id,
                          createdBy: reminder.createdBy ? { id: reminder.createdBy.id } : undefined,
                          patient: reminder.patient ? { id: reminder.patient.id } : undefined,
                          reminderType: reminder.reminderType,
                          reminderDate: reminder.reminderDate,
                          status: reminder.status,
                          notes: reminder.notes,
                          priority: reminder.priority
                        }));
                        setReminders(mapped);
                      });
                    } catch {
                      toast.error('Không thể tạo nhắc nhở uống thuốc!');
                    }
                  } else if (!newValue && patientId) {
                    try {
                      await staffService.deleteMedicationRemindersByPatient(patientId);
                      toast.success('Đã xóa tất cả nhắc nhở uống thuốc!');
                      staffService.getRemindersByPatient(patientId).then(res => {
                        const mapped = (res.data || []).map((reminder: any) => ({
                          id: reminder.id,
                          createdBy: reminder.createdBy ? { id: reminder.createdBy.id } : undefined,
                          patient: reminder.patient ? { id: reminder.patient.id } : undefined,
                          reminderType: reminder.reminderType,
                          reminderDate: reminder.reminderDate,
                          status: reminder.status,
                          notes: reminder.notes,
                          priority: reminder.priority
                        }));
                        setReminders(mapped);
                      });
                    } catch {
                      toast.error('Không thể xóa nhắc nhở uống thuốc!');
                    }
                  }
                }}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
            </label>
          </div>
        </div>
        {/* ...phần còn lại của renderReminders... */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold flex items-center"><Bell className="w-5 h-5 mr-2"/>Lịch nhắc nhở</h3>
            <select className="border rounded px-2 py-1 text-sm" value={reminderStatusFilter} onChange={e => setReminderStatusFilter(e.target.value)}>
              <option value="">Tất cả trạng thái</option>
              <option value="PENDING">Chờ xử lý</option>
              <option value="SENT">Đã gửi</option>
              <option value="COMPLETED">Hoàn thành</option>
            </select>
            <select className="border rounded px-2 py-1 text-sm" value={reminderTypeFilter} onChange={e => setReminderTypeFilter(e.target.value)}>
              <option value="">Tất cả loại</option>
              <option value="MEDICATION">Uống thuốc</option>
              <option value="APPOINTMENT">Lịch hẹn</option>
              <option value="FOLLOW_UP">Tái khám</option>
              <option value="TEST">Xét nghiệm</option>
            </select>
          </div>
          <button className="btn-gradient-primary px-3 py-1 rounded text-white" onClick={() => setShowCreateReminderModal(true)}>Tạo nhắc nhở</button>
        </div>
        {reminders.length === 0 ? (
          <div className="text-gray-500">Không có nhắc nhở nào.</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {reminders.map((reminder, idx) => (
              <li key={reminder.id || idx} className="py-2 flex items-center justify-between">
                <div>
                  <div className="font-medium">
                    {reminder.reminderType === 'MEDICATION' ? 'Uống thuốc' :
                     reminder.reminderType === 'APPOINTMENT' ? 'Lịch hẹn' :
                     reminder.reminderType === 'FOLLOW_UP' ? 'Tái khám' :
                     reminder.reminderType === 'TEST' ? 'Xét nghiệm' : reminder.reminderType}
                  </div>
                  <div className="text-sm text-gray-500">{reminder.reminderDate?.replace('T', ' ')}</div>
                  {reminder.notes && <div className="text-xs text-gray-400">{reminder.notes}</div>}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded ${reminder.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : reminder.status === 'SENT' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {reminder.status === 'COMPLETED' ? 'Hoàn thành' : reminder.status === 'SENT' ? 'Đã gửi' : 'Chờ xử lý'}
                  </span>
                  <select
                    value={reminder.status}
                    onChange={async (e) => {
                      const newStatus = e.target.value;
                      try {
                        await staffService.updateReminder(reminder.id, {
                          id: reminder.id,
                          createdBy: reminder.createdBy ? { id: reminder.createdBy.id } : { id: user.id },
                          patient: reminder.patient ? { id: reminder.patient.id } : { id: patientId },
                          reminderType: reminder.reminderType || reminder.type,
                          reminderDate: reminder.reminderDate || (reminder.dueDate + (reminder.dueTime ? `T${reminder.dueTime}` : '')),
                          status: newStatus || reminder.status || "PENDING",
                          notes: reminder.notes,
                          priority: reminder.priority
                        });
                        // Nếu là nhắc nhở uống thuốc thì đồng bộ trạng thái lịch uống thuốc
                        if (reminder.reminderType === 'MEDICATION' || reminder.type === 'MEDICATION') {
                          let newMedStatus = '';
                          if (newStatus === 'COMPLETED') newMedStatus = 'Taken';
                          else if (newStatus === 'PENDING' || newStatus === 'SENT') newMedStatus = 'Pending';
                          if (newMedStatus) {
                            // Tìm lịch uống thuốc gần nhất với thời gian nhắc nhở
                            const reminderTime = new Date(reminder.reminderDate || (reminder.dueDate + (reminder.dueTime ? `T${reminder.dueTime}` : ''))).getTime();
                            let minDiff = Infinity;
                            let matchedSchedule = null;
                            medicationSchedules.forEach(sch => {
                              const schTime = new Date(sch.intakeTime).getTime();
                              const diff = Math.abs(schTime - reminderTime);
                              if (diff < minDiff) {
                                minDiff = diff;
                                matchedSchedule = sch;
                              }
                            });
                            if (matchedSchedule) {
                              const ms = matchedSchedule as MedicationScheduleItem;
                              await medicationService.updateMedicationScheduleStatus(ms.id, {
                                status: newMedStatus,
                                intakeTime: ms.intakeTime,
                                prescription: { id: ms.prescription?.id }
                              });
                            }
                          }
                        }
                        toast.success('Cập nhật trạng thái thành công!');
                        staffService.getRemindersByPatient(user.id).then(res => {
                          const mapped = (res.data || []).map((reminder: any) => ({
                            id: reminder.id,
                            createdBy: reminder.createdBy ? { id: reminder.createdBy.id } : undefined,
                            patient: reminder.patient ? { id: reminder.patient.id } : undefined,
                            reminderType: reminder.reminderType || reminder.type,
                            reminderDate: reminder.reminderDate || (reminder.dueDate + (reminder.dueTime ? `T${reminder.dueTime}` : '')),
                            status: reminder.status || "PENDING",
                            notes: reminder.notes,
                            priority: reminder.priority
                          }));
                          setReminders(mapped);
                        });
                        // Reload lại lịch uống thuốc
                        if ((reminder.reminderType === 'MEDICATION' || reminder.type === 'MEDICATION') && newStatus === 'COMPLETED' && patientId) {
                          medicationService.getMedicationSchedulesByPatient(patientId).then(res => {
                            let data = res.data;
                            if (!Array.isArray(data)) data = [];
                            setMedicationSchedules(data);
                          }).catch(() => setMedicationSchedules([]));
                        }
                      } catch {
                        toast.error('Cập nhật trạng thái thất bại!');
                      }
                    }}
                    className="border rounded px-2 py-1 text-xs ml-2"
                  >
                    <option value="PENDING">Chờ xử lý</option>
                    <option value="SENT">Đã gửi</option>
                    <option value="COMPLETED">Hoàn thành</option>
                  </select>
                  <button className="text-blue-600 hover:underline text-xs" onClick={() => handleEditReminder(reminder)}>Sửa</button>
                  <button className="text-red-600 hover:underline text-xs" onClick={() => handleDeleteReminder(reminder)}>Xóa</button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {/* Modal tạo nhắc nhở */}
        {showCreateReminderModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Tạo nhắc nhở mới</h3>
              <div className="space-y-4">
                {/* Dropdown gợi ý từ lịch sắp tới giữ nguyên */}
                {upcomingEvents.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Chọn từ lịch sắp tới</label>
                    <select
                      className="w-full border rounded px-3 py-2"
                      value={selectedEventId}
                      onChange={e => {
                        setSelectedEventId(e.target.value);
                        const selected = upcomingEvents.find(ev => ev.id === e.target.value);
                        if (selected) {
                          setReminderForm(f => ({
                            ...f,
                            reminderType: selected.type,
                            reminderDate: selected.date.length === 16 ? selected.date : selected.date.slice(0, 16),
                            notes: selected.notes,
                            priority: 'MEDIUM'
                          }));
                        }
                      }}
                    >
                      <option value="">-- Chọn từ lịch sắp tới --</option>
                      {upcomingEvents.map(ev => (
                        <option key={ev.id} value={ev.id}>{ev.label}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-1">Loại nhắc nhở</label>
                  <select className="w-full border rounded px-3 py-2" value={reminderForm.reminderType} onChange={e => setReminderForm(f => ({ ...f, reminderType: e.target.value }))}>
                    <option value="MEDICATION">Uống thuốc</option>
                    <option value="APPOINTMENT">Lịch hẹn</option>
                    <option value="FOLLOW_UP">Tái khám</option>
                    <option value="TEST">Xét nghiệm</option>
                  </select>
                  {reminderForm.reminderType === 'MEDICATION' && (!treatmentPlans || treatmentPlans.length === 0) && (
                    <div className="text-sm text-orange-600 mt-1">Bạn chưa có lịch uống thuốc. Vui lòng liên hệ bác sĩ hoặc nhân viên y tế để được hướng dẫn.</div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Thời gian nhắc nhở</label>
                  <input type="datetime-local" className="w-full border rounded px-3 py-2" value={reminderForm.reminderDate} onChange={e => setReminderForm(f => ({ ...f, reminderDate: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Mức độ ưu tiên</label>
                  <select className="w-full border rounded px-3 py-2" value={reminderForm.priority} onChange={e => setReminderForm(f => ({ ...f, priority: e.target.value }))}>
                    <option value="LOW">Thấp</option>
                    <option value="MEDIUM">Trung bình</option>
                    <option value="HIGH">Cao</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button className="px-4 py-2 rounded bg-gray-200" onClick={() => setShowCreateReminderModal(false)}>Hủy</button>
                <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={handleCreateReminder}>Lưu</button>
              </div>
            </div>
          </div>
        )}
        {showEditReminderModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Chỉnh sửa nhắc nhở</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Loại nhắc nhở</label>
                  <select className="w-full border rounded px-3 py-2" value={reminderForm.reminderType} onChange={e => setReminderForm(f => ({ ...f, reminderType: e.target.value }))}>
                    <option value="MEDICATION">Uống thuốc</option>
                    <option value="APPOINTMENT">Lịch hẹn</option>
                    <option value="FOLLOW_UP">Tái khám</option>
                    <option value="TEST">Xét nghiệm</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Thời gian nhắc nhở</label>
                  <input type="datetime-local" className="w-full border rounded px-3 py-2" value={reminderForm.reminderDate} onChange={e => setReminderForm(f => ({ ...f, reminderDate: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Mức độ ưu tiên</label>
                  <select className="w-full border rounded px-3 py-2" value={reminderForm.priority} onChange={e => setReminderForm(f => ({ ...f, priority: e.target.value }))}>
                    <option value="LOW">Thấp</option>
                    <option value="MEDIUM">Trung bình</option>
                    <option value="HIGH">Cao</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button className="px-4 py-2 rounded bg-gray-200" onClick={() => { setShowEditReminderModal(false); setEditReminder(null); }}>Hủy</button>
                <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={handleUpdateReminder}>Lưu</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleEditReminder = (reminder: any) => {
    setEditReminder(reminder);
    setReminderForm({
      reminderType: reminder.reminderType,
      reminderDate: reminder.reminderDate ? reminder.reminderDate.slice(0, 16) : '',
      notes: reminder.notes || '',
      priority: reminder.priority || 'MEDIUM',
    });
    setShowEditReminderModal(true);
  };

  const handleUpdateReminder = async () => {
    if (!editReminder) return;
    if (!reminderForm.reminderType || !reminderForm.reminderDate) {
      toast.error('Vui lòng nhập đủ thông tin!');
      return;
    }
    try {
      await staffService.updateReminder(editReminder.id, {
        id: editReminder.id,
        createdBy: editReminder.createdBy ? { id: editReminder.createdBy.id } : { id: user.id },
        patient: editReminder.patient ? { id: editReminder.patient.id } : { id: patientId },
        reminderType: reminderForm.reminderType || editReminder.reminderType || editReminder.type,
        reminderDate: reminderForm.reminderDate || editReminder.reminderDate || (editReminder.dueDate + (editReminder.dueTime ? `T${editReminder.dueTime}` : '')),
        status: editReminder.status || "PENDING",
        notes: reminderForm.notes,
        priority: reminderForm.priority
      });
      toast.success('Cập nhật nhắc nhở thành công!');
      setShowEditReminderModal(false);
      setEditReminder(null);
      setReminderForm({ reminderType: 'MEDICATION', reminderDate: '', notes: '', priority: 'MEDIUM' });
      // Reload reminders
      staffService.getRemindersByPatient(user.id).then(res => {
        const mapped = (res.data || []).map((reminder: any) => ({
          id: reminder.id,
          createdBy: reminder.createdBy ? { id: reminder.createdBy.id } : undefined,
          patient: reminder.patient ? { id: reminder.patient.id } : undefined,
          reminderType: reminder.reminderType || reminder.type,
          reminderDate: reminder.reminderDate || (reminder.dueDate + (reminder.dueTime ? `T${reminder.dueTime}` : '')),
          status: reminder.status || "PENDING",
          notes: reminder.notes,
          priority: reminder.priority
        }));
        setReminders(mapped);
      });
    } catch {
      toast.error('Cập nhật nhắc nhở thất bại!');
    }
  };

  const handleDeleteReminder = async (reminder: any) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa nhắc nhở này?')) return;
    try {
      await staffService.deleteReminder(reminder.id);
      toast.success('Đã xóa nhắc nhở!');
      // Reload reminders
      staffService.getRemindersByPatient(user.id).then(res => {
        const mapped = (res.data || []).map((reminder: any) => ({
          id: reminder.id,
          createdBy: reminder.createdBy ? { id: reminder.createdBy.id } : undefined,
          patient: reminder.patient ? { id: reminder.patient.id } : undefined,
          reminderType: reminder.reminderType || reminder.type,
          reminderDate: reminder.reminderDate || (reminder.dueDate + (reminder.dueTime ? `T${reminder.dueTime}` : '')),
          status: reminder.status || "PENDING",
          notes: reminder.notes,
          priority: reminder.priority
        }));
        setReminders(mapped);
      });
    } catch {
      toast.error('Xóa nhắc nhở thất bại!');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Thông tin cá nhân', icon: User, color: 'primary' },
    { id: 'test-booking', label: 'Lịch xét nghiệm', icon: ClipboardList, color: 'secondary' },
    { id: 'test-history', label: 'Lịch sử xét nghiệm', icon: FileText, color: 'secondary' },
    { id: 'consultation-history', label: 'Lịch tư vấn', icon: MessageSquare, color: 'accent' },
    { id: 'arv-protocol', label: 'Phác đồ ARV', icon: PillIcon, color: 'green' },
    { id: 'reminders', label: 'Lịch nhắc nhở', icon: Clock, color: 'accent' },
    { id: 'medication-schedule', label: 'Lịch uống thuốc', icon: Pill, color: 'blue' },
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
      
      {/* Modal đổi mật khẩu */}
      {showChangePasswordModal && (
        <Modal
          isOpen={showChangePasswordModal}
          onClose={() => setShowChangePasswordModal(false)}
          title="Đổi mật khẩu"
        >
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu hiện tại
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Nhập mật khẩu hiện tại"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu mới
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Nhập mật khẩu mới"
              />
              <p className="text-xs text-gray-500 mt-1">
                Mật khẩu phải dài ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Xác nhận mật khẩu mới
              </label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Nhập lại mật khẩu mới"
              />
            </div>
            
            {passwordError && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                {passwordError}
              </div>
            )}
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowChangePasswordModal(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmNewPassword('');
                  setPasswordError(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
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
      
      {/* Rating Modal */}
      {renderRatingModal()}
    </div>
  );
};

export default ProfilePage;