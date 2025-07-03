import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Edit2, 
  Save, 
  X,
  GraduationCap,
  Briefcase,
  Clock,
  Calendar as CalendarIcon,
  ClipboardList,
  MessageSquare,
  FileText,
  ChevronRight,
  Star,
  StarHalf,
  ThumbsUp,
  XCircle,
  CheckCircle
} from 'lucide-react';
import { User as UserType, Doctor, Appointment } from '../../types/index';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { FaFileMedical, FaEye, FaPlus } from 'react-icons/fa';
import api, { consultationService, medicationService, prescriptionService } from '../../services/api';
import ConsultationDetailModal from '../../components/ConsultationDetailModal';
import PatientDetailModal from '../../components/PatientDetailModal';

type TabType = 'profile' | 'schedule' | 'consultation' | 'patient-history';

interface DoctorProfileProps {}

interface DoctorFormData {
  name: string;
  email: string;
  phone: string;
  specialization: string;
  experience: string;
  qualification: string;
}

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  lastVisit: string;
  nextAppointment?: string;
  status: 'active' | 'inactive';
  avatar?: string;
  patientId: string;
}

const DoctorProfile: React.FC<DoctorProfileProps> = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedConsultationStatus, setSelectedConsultationStatus] = useState<string>('all');
  const [editingNote, setEditingNote] = useState<{id: string, note: string} | null>(null);
  const [editingResult, setEditingResult] = useState<{id: string, result: string} | null>(null);
  const [isReminderActive, setIsReminderActive] = useState<boolean>(false);
  const [isConsultationReminderActive, setIsConsultationReminderActive] = useState<boolean>(false);
  const [formData, setFormData] = useState<DoctorFormData>({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phoneNumber || '',
    specialization: ((user as unknown) as Doctor)?.specialization || '',
    experience: ((user as unknown) as Doctor)?.experience?.toString() || '',
    qualification: '',
  });
  const [appointmentPage, setAppointmentPage] = useState(1);
  const [consultationPage, setConsultationPage] = useState(1);
  const PAGE_SIZE = 10;
  const [doctorId, setDoctorId] = useState<number | null>(null);
  const [patientTreatmentPlans, setPatientTreatmentPlans] = useState<any[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [refreshingPatients, setRefreshingPatients] = useState(false);
  const [showCreateProtocolModal, setShowCreateProtocolModal] = useState(false);
  const [selectedPatientForProtocol, setSelectedPatientForProtocol] = useState<Patient | null>(null);
  const [arvProtocols, setArvProtocols] = useState<any[]>([]);
  const [selectedArvProtocolId, setSelectedArvProtocolId] = useState('');
  const [protocolStartDate, setProtocolStartDate] = useState('');
  const [protocolNotes, setProtocolNotes] = useState('');
  const [creatingProtocol, setCreatingProtocol] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null);
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [showPatientDetailModal, setShowPatientDetailModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState<{patientId: string|number, plans: any[]} | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);

  // Đặt biến statuses ở ngoài cùng để dùng chung cho cả hai phần
  const statuses = [
    { value: 'all', label: 'Tất cả' },
    { value: 'pending', label: 'Chưa xác nhận' },
    { value: 'scheduled', label: 'Đã lên lịch' },
    { value: 'confirmed', label: 'Đã xác nhận' },
    { value: 'completed', label: 'Đã hoàn thành' },
    { value: 'cancelled', label: 'Đã hủy' },
    { value: 'canceled', label: 'Đã hủy' },
    { value: 'no-show', label: 'Vắng mặt' },
  ];

  // Hàm chuẩn hóa và mapping trạng thái
  const normalizeStatus = (status: string) => status?.toLowerCase();
  const statusTextMap: Record<string, string> = {
    pending: 'Chưa xác nhận',
    scheduled: 'Đã lên lịch',
    confirmed: 'Đã xác nhận',
    completed: 'Đã hoàn thành',
    cancelled: 'Đã hủy',
    canceled: 'Đã hủy',
    'no-show': 'Vắng mặt'
  };
  const statusColorMap: Record<string, string> = {
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    canceled: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    scheduled: 'bg-blue-100 text-blue-800',
    'no-show': 'bg-gray-100 text-gray-800'
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleViewPatientDetails = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    setSelectedPatient(patient || null);
    setShowPatientDetailModal(true);
  };

  useEffect(() => {
    if (user && user.id) {
      api.get(`/doctors?userId=${user.id}`)
        .then(res => {
          const doctor = Array.isArray(res.data) ? res.data[0] : res.data;
          if (doctor && doctor.id) {
            setDoctorId(doctor.id);
            setDoctor(doctor);
            setFormData({
              name: doctor.name || '',
              email: doctor.email || '',
              phone: doctor.phoneNumber || '',
              specialization: doctor.specialization || '',
              experience: doctor.experience?.toString() || '',
              qualification: doctor.qualification || '',
            });
          }
        })
        .catch(() => setDoctorId(null));
    }
  }, [user]);

  useEffect(() => {
    if (doctorId) {
      // Lấy lịch khám bệnh (appointments)
      api.get(`/appointments?doctorId=${doctorId}`)
        .then(res => setAppointments(res.data))
        .catch(() => setAppointments([]));
      // Lấy lịch tư vấn (consultations)
      consultationService.getConsultationsByDoctor(doctorId)
        .then(res => setConsultations(res.data || []))
        .catch(() => setConsultations([]));
      // Tự động load dữ liệu bệnh nhân
      loadInitialPatientData();
    }
  }, [doctorId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!doctorId || !doctor) return;
      const payload = {
        doctorCode: doctor.doctorCode || '',
        name: formData.name,
        specialization: formData.specialization,
        qualification: formData.qualification,
        licenseNumber: doctor.licenseNumber || '',
        phoneNumber: formData.phone,
        email: formData.email,
        address: doctor.address || '',
        bio: doctor.bio || '',
        status: (doctor.status === 'ACTIVE' || doctor.status === 'INACTIVE') ? doctor.status : 'ACTIVE',
        experience: Number(formData.experience),
        rating: doctor.rating || 0,
        avatar: doctor.avatar || '',
      };
      await api.put(`/doctors/${doctorId}`, payload);
      toast.success('Cập nhật thông tin thành công!');
      // Reload lại dữ liệu
      api.get(`/doctors?userId=${user?.id}`)
        .then(res => {
          const doctorData = Array.isArray(res.data) ? res.data[0] : res.data;
          if (doctorData && doctorData.id) {
            setDoctorId(doctorData.id);
            setDoctor(doctorData);
            setFormData({
              name: doctorData.name || '',
              email: doctorData.email || '',
              phone: doctorData.phoneNumber || '',
              specialization: doctorData.specialization || '',
              experience: doctorData.experience?.toString() || '',
              qualification: doctorData.qualification || '',
            });
          }
        });
      setIsEditing(false);
    } catch (error) {
      toast.error('Cập nhật thông tin thất bại!');
    }
  };

  const handleAppointmentStatusChange = (consultationId: string, newStatus: Appointment['status']) => {
    // Cập nhật consultation status thay vì appointment status
    consultationService.updateOnlineConsultationStatus(consultationId, newStatus)
      .then(() => {
        setConsultations(consultations.map(consultation => 
          consultation.id === consultationId ? { ...consultation, status: newStatus } : consultation
        ));
        toast.success('Cập nhật trạng thái thành công');
      })
      .catch(() => {
        toast.error('Cập nhật trạng thái thất bại');
      });
  };

  const handleViewConsultationDetail = (consultation: any) => {
    setSelectedConsultation(consultation);
    setShowConsultationModal(true);
  };

  const handleUpdateConsultation = (consultationId: string, updatedData: any) => {
    // Cập nhật consultation với dữ liệu mới
    consultationService.updateOnlineConsultation(consultationId, updatedData)
      .then(() => {
        setConsultations(prev => prev.map(consultation =>
          consultation.id === consultationId
            ? { ...consultation, ...updatedData }
            : consultation
        ));
        toast.success('Cập nhật lịch tư vấn thành công');
        setShowConsultationModal(false);
      })
      .catch(() => {
        toast.error('Cập nhật lịch tư vấn thất bại');
      });
  };

  const handleSaveNote = (consultationId: string) => {
    if (editingNote && editingNote.id === consultationId) {
      const noteValue = editingNote.note;
      setConsultations(consultations.map(consultation => 
        consultation.id === consultationId 
          ? { ...consultation, notes: noteValue }
          : consultation
      ));
      setEditingNote(null);
      toast.success('Đã lưu ghi chú thành công');
    }
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (editingNote) {
      setEditingNote({ ...editingNote, note: e.target.value });
    }
  };

  const handleSaveResult = (appointmentId: string) => {
    if (editingResult && editingResult.id === appointmentId) {
      setAppointments(appointments.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, result: editingResult.result }
          : appointment
      ));
      setEditingResult(null);
      toast.success('Đã lưu kết quả khám bệnh thành công');
    }
  };

  const handleResultChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (editingResult) {
      setEditingResult({ ...editingResult, result: e.target.value });
    }
  };

  // Lọc appointments
  const filteredAppointments = appointments.filter(appointment => {
    if (selectedStatus === 'all') return true;
    return normalizeStatus(appointment.status) === normalizeStatus(selectedStatus);
  });
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    const dateA = new Date(`${a.appointmentDate}T${a.appointmentTime}`);
    const dateB = new Date(`${b.appointmentDate}T${b.appointmentTime}`);
    return dateB.getTime() - dateA.getTime();
  });
  const paginatedAppointments = sortedAppointments.slice((appointmentPage - 1) * PAGE_SIZE, appointmentPage * PAGE_SIZE);

  // Lọc consultations
  const filteredConsultations = consultations.filter(
    (c) => selectedConsultationStatus === 'all' || normalizeStatus(c.status) === normalizeStatus(selectedConsultationStatus)
  );
  const sortedConsultations = [...filteredConsultations].sort((a, b) => {
    const dateA = new Date(a.startTime);
    const dateB = new Date(b.startTime);
    return dateB.getTime() - dateA.getTime();
  });
  const paginatedConsultations = sortedConsultations.slice((consultationPage - 1) * PAGE_SIZE, consultationPage * PAGE_SIZE);

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Thông tin cá nhân</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            {isEditing ? (
              <>
                <X size={20} />
                <span>Hủy</span>
              </>
            ) : (
              <>
                <Edit2 size={20} />
                <span>Chỉnh sửa</span>
              </>
            )}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
              <User className="text-blue-500" size={24} />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
              <Mail className="text-blue-500" size={24} />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
              <Phone className="text-blue-500" size={24} />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
              <GraduationCap className="text-blue-500" size={24} />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bằng cấp</label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
              <GraduationCap className="text-blue-500" size={24} />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Chuyên môn</label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
              <Briefcase className="text-blue-500" size={24} />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Kinh nghiệm</label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                />
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200"
              >
                Lưu thay đổi
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );

  const renderScheduleTab = () => {
    const statuses = [
      { value: 'all', label: 'Tất cả' },
      { value: 'pending', label: 'Chưa xác nhận' },
      { value: 'confirmed', label: 'Đã xác nhận' },
      { value: 'completed', label: 'Đã hoàn thành' },
      { value: 'cancelled', label: 'Đã hủy' },
    ];

    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex items-center space-x-4">
            <CalendarIcon className="w-5 h-5 text-primary-600" />
            <input
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          {filteredAppointments.length > 0 && (selectedStatus === 'pending' || selectedStatus === 'confirmed' || selectedStatus === 'all') && (
            <div className="flex justify-center md:justify-start w-full md:w-auto">
              <button
                onClick={() => setIsReminderActive(!isReminderActive)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-sm md:text-base ${
                  isReminderActive ? 'bg-yellow-500 text-white hover:bg-yellow-600' : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                {isReminderActive ? 'Đã bật nhắc nhở' : 'Nhắc nhở lịch khám'}
              </button>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <label htmlFor="status-filter" className="text-sm font-medium text-gray-700 sr-only">Lọc theo trạng thái</label>
            <select
              id="status-filter"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="block w-full md:w-auto px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500/20 focus:border-primary-500/20 sm:text-sm"
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Appointments List */}
        <div className="grid gap-4">
          {paginatedAppointments.length > 0 ? (
            paginatedAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center">
                      <User size={24} className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {appointment.patient?.fullName || appointment.patientName || 'Không rõ tên bệnh nhân'}
                      </h3>
                      <div className="text-sm text-gray-500">
                        <b>Dịch vụ:</b> {appointment.medicalService?.name || 'Không rõ'}
                      </div>
                      <div className="text-sm text-gray-500">
                        <b>Thời gian:</b> {appointment.appointmentDate || appointment.date} {appointment.appointmentTime || appointment.time}
                      </div>
                      <div className="text-sm text-gray-500">
                        <b>Trạng thái:</b> {statusTextMap[normalizeStatus(appointment.status)] || appointment.status}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm ${statusColorMap[normalizeStatus(appointment.status)] || 'bg-gray-100 text-gray-800'}`}>
                      {statusTextMap[normalizeStatus(appointment.status)] || appointment.status}
                    </span>
                  </div>
                </div>
                {/* Doctor's Note / Patient Notes */}
                {appointment.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-full bg-secondary-50 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-secondary-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-medium text-gray-900">Ghi chú</h4>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-line">{appointment.notes}</p>
                      </div>
                    </div>
                  </div>
                )}
                {/* Result Input/Display (for completed) */}
                {appointment.status === 'completed' && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-full bg-secondary-50 flex items-center justify-center flex-shrink-0">
                        <ClipboardList className="w-4 h-4 text-secondary-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Kết quả khám bệnh</h4>
                        {editingResult && editingResult.id === appointment.id ? (
                          <div>
                            <textarea
                              value={editingResult.result}
                              onChange={handleResultChange}
                              rows={4}
                              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                              placeholder="Nhập kết quả khám bệnh..."
                            ></textarea>
                            <button
                              onClick={() => handleSaveResult(appointment.id)}
                              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600"
                            >
                              Lưu kết quả
                            </button>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm text-gray-700 whitespace-pre-line">{appointment.result || 'Chưa có kết quả.'}</p>
                            <button
                              onClick={() => setEditingResult({ id: appointment.id, result: appointment.result || '' })}
                              className="mt-2 text-primary-600 hover:text-primary-800 text-sm font-medium"
                            >
                              {appointment.result ? 'Sửa kết quả' : 'Nhập kết quả'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {/* Actions */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-2">
                  {appointment.status === 'completed' && (
                    <Link
                      to={`/test-results?appointmentId=${appointment.id}`}
                      className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 text-sm"
                    >
                      <FaFileMedical className="mr-2" />
                      Xem chi tiết
                    </Link>
                  )}
                  {appointment.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleAppointmentStatusChange(appointment.id, 'cancelled')}
                        className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm"
                      >
                        <XCircle className="mr-2" size={16} />
                        Hủy
                      </button>
                      <button
                        onClick={() => handleAppointmentStatusChange(appointment.id, 'confirmed')}
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm"
                      >
                        <CheckCircle className="mr-2" size={16} />
                        Xác nhận
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có bệnh nhân nào</h3>
              <p className="text-gray-500">
                Chưa có bệnh nhân nào đặt lịch khám với bác sĩ này
              </p>
            </div>
          )}
        </div>
        {/* Pagination */}
        {sortedAppointments.length > PAGE_SIZE && (
          <div className="flex justify-center mt-4 gap-2">
            <button
              onClick={() => setAppointmentPage(p => Math.max(1, p - 1))}
              disabled={appointmentPage === 1}
              className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
            >Trước</button>
            <span>Trang {appointmentPage} / {Math.ceil(sortedAppointments.length / PAGE_SIZE)}</span>
            <button
              onClick={() => setAppointmentPage(p => p + 1)}
              disabled={appointmentPage >= Math.ceil(sortedAppointments.length / PAGE_SIZE)}
              className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
            >Sau</button>
          </div>
        )}
      </div>
    );
  };

  const renderConsultationTab = () => {
    const statuses = [
      { value: 'all', label: 'Tất cả' },
      { value: 'pending', label: 'Chưa xác nhận' },
      { value: 'confirmed', label: 'Đã xác nhận' },
      { value: 'completed', label: 'Đã hoàn thành' },
      { value: 'cancelled', label: 'Đã hủy' },
    ];

    console.log('Consultations:', consultations, 'User:', user);
    const filteredConsultations = consultations.filter(
      (c) => selectedConsultationStatus === 'all' || normalizeStatus(c.status) === normalizeStatus(selectedConsultationStatus)
    );
    const sortedConsultations = [...filteredConsultations].sort((a, b) => {
      const dateA = new Date(a.startTime);
      const dateB = new Date(b.startTime);
      return dateB.getTime() - dateA.getTime();
    });
    const paginatedConsultations = sortedConsultations.slice((consultationPage - 1) * PAGE_SIZE, consultationPage * PAGE_SIZE);

    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex items-center space-x-4">
            <CalendarIcon className="w-5 h-5 text-primary-600" />
            <input
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          {/* Single Reminder Button */}
          {filteredConsultations.length > 0 && (selectedConsultationStatus === 'pending' || selectedConsultationStatus === 'confirmed' || selectedConsultationStatus === 'all') && (
            <div className="flex justify-center md:justify-start w-full md:w-auto">
              <button
                onClick={() => setIsConsultationReminderActive(!isConsultationReminderActive)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-sm md:text-base ${
                  isConsultationReminderActive ? 'bg-yellow-500 text-white hover:bg-yellow-600' : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                {isConsultationReminderActive ? 'Đã bật nhắc nhở' : 'Nhắc nhở lịch tư vấn'}
              </button>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <label htmlFor="consultation-status-filter" className="text-sm font-medium text-gray-700 sr-only">Lọc theo trạng thái</label>
            <select
              id="consultation-status-filter"
              value={selectedConsultationStatus}
              onChange={(e) => setSelectedConsultationStatus(e.target.value)}
              className="block w-full md:w-auto px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500/20 focus:border-primary-500/20 sm:text-sm"
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4">
          {paginatedConsultations.length > 0 ? (
            paginatedConsultations.map((consultation: any) => (
              <div
                key={consultation.id}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center">
                      <User size={24} className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {consultation.patientName || 'Không rõ tên bệnh nhân'}
                      </h3>
                      <div className="text-sm text-gray-500">
                        <b>Loại tư vấn:</b> {consultation.consultationType || 'Không rõ'}
                      </div>
                      <div className="text-sm text-gray-500">
                        <b>Thời gian:</b> {consultation.startTime ? new Date(consultation.startTime).toLocaleString('vi-VN') : 'Không rõ'}
                      </div>
                      {consultation.meetingLink && (
                        <div className="text-sm text-blue-600">
                          <a href={consultation.meetingLink} target="_blank" rel="noopener noreferrer">Link phòng họp</a>
                        </div>
                      )}
                      <div className="text-sm text-gray-500">
                        <b>Trạng thái:</b> {statusTextMap[normalizeStatus(consultation.status)] || consultation.status}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm ${statusColorMap[normalizeStatus(consultation.status)] || 'bg-gray-100 text-gray-800'}`}>
                      {statusTextMap[normalizeStatus(consultation.status)] || consultation.status}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewConsultationDetail(consultation)}
                        className="flex items-center space-x-1 px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <FaEye className="w-3 h-3" />
                        <span>Chi tiết</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  {consultation.status === 'completed' ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-700">Ghi chú buổi tư vấn</h4>
                        {editingNote?.id === consultation.id ? (
                          <button
                            onClick={() => handleSaveNote(consultation.id)}
                            className="px-3 py-1 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors duration-200"
                          >
                            Lưu ghi chú
                          </button>
                        ) : (
                          <button
                            onClick={() => setEditingNote({ id: consultation.id, note: consultation.notes || '' })}
                            className="px-3 py-1 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors duration-200"
                          >
                            Chỉnh sửa
                          </button>
                        )}
                      </div>
                      {editingNote?.id === consultation.id ? (
                        <textarea
                          value={editingNote ? editingNote.note : ''}
                          onChange={handleNoteChange}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          rows={4}
                          placeholder="Nhập ghi chú về buổi tư vấn..."
                        />
                      ) : (
                        <p className="text-sm text-gray-600">
                          {consultation.notes || 'Chưa có ghi chú cho buổi tư vấn này'}
                        </p>
                      )}
                    </div>
                  ) : (
                    consultation.notes && (
                      <p className="text-sm text-gray-600">{consultation.notes}</p>
                    )
                  )}
                </div>
                {consultation.status === 'pending' && (
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-3">
                    <button
                      onClick={() => handleAppointmentStatusChange(consultation.id, 'cancelled')}
                      className="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600 transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={() => handleAppointmentStatusChange(consultation.id, 'confirmed')}
                      className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors duration-200"
                    >
                      Xác nhận
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có lịch tư vấn</h3>
              <p className="text-gray-500">
                {selectedConsultationStatus === 'all' 
                  ? 'Không có lịch tư vấn nào cho ngày này'
                  : `Không có lịch tư vấn ${
                      selectedConsultationStatus === 'pending' ? 'chưa xác nhận' :
                      selectedConsultationStatus === 'confirmed' ? 'đã xác nhận' :
                      selectedConsultationStatus === 'completed' ? 'đã hoàn thành' :
                      selectedConsultationStatus === 'cancelled' ? 'đã hủy' :
                      ''
                    } cho ngày này`}
              </p>
            </div>
          )}
        </div>
        {/* Pagination */}
        {sortedConsultations.length > PAGE_SIZE && (
          <div className="flex justify-center mt-4 gap-2">
            <button
              onClick={() => setConsultationPage(p => Math.max(1, p - 1))}
              disabled={consultationPage === 1}
              className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
            >Trước</button>
            <span>Trang {consultationPage} / {Math.ceil(sortedConsultations.length / PAGE_SIZE)}</span>
            <button
              onClick={() => setConsultationPage(p => p + 1)}
              disabled={consultationPage >= Math.ceil(sortedConsultations.length / PAGE_SIZE)}
              className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
            >Sau</button>
          </div>
        )}
      </div>
    );
  };

  // Thêm hàm load dữ liệu bệnh nhân ban đầu
  const loadInitialPatientData = () => {
    if (!doctorId) return;
    
    setLoadingPatients(true);
    
    // Lấy tất cả appointments của bác sĩ để có danh sách bệnh nhân
    api.get(`/appointments?doctorId=${doctorId}`)
      .then(res => {
        const appointments = res.data || [];
        
        // Lấy danh sách unique patients từ appointments
        const uniquePatients: { [id: string]: Patient } = {};
        
        appointments.forEach((appointment: any) => {
          const patient = appointment.patient;
          if (patient && patient.id && !uniquePatients[patient.id]) {
            uniquePatients[patient.id] = {
              id: patient.id,
              patientId: patient.patientId || patient.id,
              name: patient.fullName || patient.name || 'Không rõ tên',
              age: patient.age || 0,
              gender: patient.gender || 'male',
              lastVisit: appointment.appointmentDate || appointment.date || '',
              nextAppointment: undefined,
              status: patient.status || 'active',
              avatar: patient.avatar || `https://i.pravatar.cc/150?img=${patient.id}`
            };
          }
        });
        
        setPatients(Object.values(uniquePatients));
        
        // Sau đó lấy treatment plans để hiển thị thông tin phác đồ
        return api.get(`/patient-treatment-plans?doctorId=${doctorId}`);
      })
      .then(res => {
        const treatmentPlans = res.data || [];
        setPatientTreatmentPlans(treatmentPlans);
      })
      .catch(() => {
        setPatients([]);
        setPatientTreatmentPlans([]);
      })
      .finally(() => setLoadingPatients(false));
  };

  // Thêm hàm refresh dữ liệu bệnh nhân
  const refreshPatientData = () => {
    if (!doctorId) return;
    
    setRefreshingPatients(true);
    
    // Lấy tất cả appointments của bác sĩ để có danh sách bệnh nhân
    api.get(`/appointments?doctorId=${doctorId}`)
      .then(res => {
        const appointments = res.data || [];
        
        // Lấy danh sách unique patients từ appointments
        const uniquePatients: { [id: string]: Patient } = {};
        
        appointments.forEach((appointment: any) => {
          const patient = appointment.patient;
          if (patient && patient.id && !uniquePatients[patient.id]) {
            uniquePatients[patient.id] = {
              id: patient.id,
              patientId: patient.patientId || patient.id,
              name: patient.fullName || patient.name || 'Không rõ tên',
              age: patient.age || 0,
              gender: patient.gender || 'male',
              lastVisit: appointment.appointmentDate || appointment.date || '',
              nextAppointment: undefined,
              status: patient.status || 'active',
              avatar: patient.avatar || `https://i.pravatar.cc/150?img=${patient.id}`
            };
          }
        });
        
        setPatients(Object.values(uniquePatients));
        
        // Sau đó lấy treatment plans để hiển thị thông tin phác đồ
        return api.get(`/patient-treatment-plans?doctorId=${doctorId}`);
      })
      .then(res => {
        const treatmentPlans = res.data || [];
        setPatientTreatmentPlans(treatmentPlans);
        toast.success('Đã cập nhật dữ liệu bệnh nhân');
      })
      .catch(() => {
        setPatients([]);
        setPatientTreatmentPlans([]);
        toast.error('Không thể cập nhật dữ liệu bệnh nhân');
      })
      .finally(() => setRefreshingPatients(false));
  };

  // Thêm hàm lấy danh sách ARV protocols
  const loadArvProtocols = () => {
    api.get('/arv-protocols')
      .then(res => setArvProtocols(res.data || []))
      .catch(() => setArvProtocols([]));
  };

  // Thêm hàm tạo phác đồ ARV mới
  const handleCreateProtocol = () => {
    if (!selectedPatientForProtocol || !selectedArvProtocolId || !protocolStartDate || !doctorId) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setCreatingProtocol(true);
    const newTreatmentPlan = {
      patient: { id: selectedPatientForProtocol.id },
      doctor: { id: doctorId },
      arvProtocol: { id: selectedArvProtocolId },
      startDate: protocolStartDate,
      notes: protocolNotes || ''
    };

    api.post('/patient-treatment-plans', newTreatmentPlan)
      .then(() => {
        toast.success('Tạo phác đồ ARV thành công!');
        setShowCreateProtocolModal(false);
        setSelectedPatientForProtocol(null);
        setSelectedArvProtocolId('');
        setProtocolStartDate('');
        setProtocolNotes('');
        // Refresh dữ liệu
        refreshPatientData();
      })
      .catch(() => {
        toast.error('Tạo phác đồ ARV thất bại!');
      })
      .finally(() => setCreatingProtocol(false));
  };

  // Thêm hàm mở modal tạo phác đồ
  const openCreateProtocolModal = (patient: Patient) => {
    setSelectedPatientForProtocol(patient);
    setShowCreateProtocolModal(true);
    loadArvProtocols();
  };

  // PrescriptionForm cho bác sĩ kê đơn thuốc cho bệnh nhân
  const PrescriptionForm: React.FC<{ patientId: string|number, treatmentPlans: any[], onSuccess?: () => void, onClose?: () => void }> = ({ patientId, treatmentPlans, onSuccess, onClose }) => {
    const [medications, setMedications] = useState<any[]>([]);
    const [form, setForm] = useState({
      treatmentPlanId: '',
      notes: ''
    });
    const [details, setDetails] = useState([
      { medicationId: '', dosage: '', times: [''], durationDays: '', notes: '' }
    ]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      medicationService.getAllMedications().then(res => setMedications(res.data || []));
    }, []);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    };

    const handleDetailChange = (idx: number, field: string, value: string) => {
      setDetails(ds => ds.map((d, i) => i === idx ? { ...d, [field]: value } : d));
    };

    // Thao tác với times (giờ uống)
    const handleTimeChange = (detailIdx: number, timeIdx: number, value: string) => {
      setDetails(ds => ds.map((d, i) => i === detailIdx ? { ...d, times: d.times.map((t, j) => j === timeIdx ? value : t) } : d));
    };
    const addTime = (detailIdx: number) => {
      setDetails(ds => ds.map((d, i) => i === detailIdx ? { ...d, times: [...d.times, ''] } : d));
    };
    const removeTime = (detailIdx: number, timeIdx: number) => {
      setDetails(ds => ds.map((d, i) => i === detailIdx ? { ...d, times: d.times.filter((_, j) => j !== timeIdx) } : d));
    };

    const addDetail = () => setDetails(ds => [...ds, { medicationId: '', dosage: '', times: [''], durationDays: '', notes: '' }]);
    const removeDetail = (idx: number) => setDetails(ds => ds.filter((_, i) => i !== idx));

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!form.treatmentPlanId || details.some(d => !d.medicationId || !d.dosage || !d.durationDays || d.times.some(t => !t))) {
        toast.error('Vui lòng nhập đủ thông tin cho tất cả các thuốc!');
        return;
      }
      setLoading(true);
      try {
        await prescriptionService.createPrescription({
          treatmentPlanId: Number(form.treatmentPlanId),
          notes: form.notes,
          details: details.map(d => ({
            medicationId: Number(d.medicationId),
            dosage: d.dosage,
            frequency: d.times.filter(Boolean).join(','),
            durationDays: Number(d.durationDays),
            notes: d.notes
          }))
        });
        toast.success('Kê đơn thuốc thành công!');
        setForm({ treatmentPlanId: '', notes: '' });
        setDetails([{ medicationId: '', dosage: '', times: [''], durationDays: '', notes: '' }]);
        onSuccess && onSuccess();
      } catch {
        toast.error('Kê đơn thuốc thất bại!');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
          <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"><X size={20} /></button>
          <form onSubmit={handleSubmit} className="">
            <h4 className="font-semibold mb-2">Kê đơn thuốc ARV</h4>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Phác đồ điều trị</label>
              <select name="treatmentPlanId" className="w-full border rounded px-3 py-2" value={form.treatmentPlanId} onChange={handleFormChange} required>
                <option value="">-- Chọn phác đồ --</option>
                {treatmentPlans.map(plan => (
                  <option key={plan.id} value={plan.id}>{plan.notes || `Phác đồ #${plan.id}`} (Bắt đầu: {plan.startDate})</option>
                ))}
              </select>
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Ghi chú đơn thuốc</label>
              <textarea name="notes" className="w-full border rounded px-3 py-2" value={form.notes} onChange={handleFormChange} />
            </div>
            <h5 className="font-semibold mb-2 mt-4">Danh sách thuốc</h5>
            {details.map((detail, idx) => (
              <div key={idx} className="border rounded p-3 mb-2 relative bg-gray-50">
                <div className="mb-2">
                  <label className="block text-xs font-medium mb-1">Thuốc</label>
                  <select name="medicationId" className="w-full border rounded px-3 py-2" value={detail.medicationId} onChange={e => handleDetailChange(idx, 'medicationId', e.target.value)} required>
                    <option value="">-- Chọn thuốc --</option>
                    {medications.map(med => (
                      <option key={med.id} value={med.id}>{med.name}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-2">
                  <label className="block text-xs font-medium mb-1">Liều lượng</label>
                  <input name="dosage" className="w-full border rounded px-3 py-2" value={detail.dosage} onChange={e => handleDetailChange(idx, 'dosage', e.target.value)} required />
                </div>
                <div className="mb-2">
                  <label className="block text-xs font-medium mb-1">Giờ uống</label>
                  {detail.times.map((time, tIdx) => (
                    <div key={tIdx} className="flex items-center gap-2 mb-1">
                      <input
                        type="time"
                        value={time}
                        onChange={e => handleTimeChange(idx, tIdx, e.target.value)}
                        className="border rounded px-2 py-1"
                        required
                      />
                      {detail.times.length > 1 && (
                        <button type="button" onClick={() => removeTime(idx, tIdx)} className="text-red-500">X</button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => addTime(idx)} className="text-blue-600 text-sm">+ Thêm giờ</button>
                </div>
                <div className="mb-2">
                  <label className="block text-xs font-medium mb-1">Số ngày điều trị</label>
                  <input name="durationDays" type="number" min="1" className="w-full border rounded px-3 py-2" value={detail.durationDays} onChange={e => handleDetailChange(idx, 'durationDays', e.target.value)} required />
                </div>
                <div className="mb-2">
                  <label className="block text-xs font-medium mb-1">Ghi chú</label>
                  <input name="notes" className="w-full border rounded px-3 py-2" value={detail.notes} onChange={e => handleDetailChange(idx, 'notes', e.target.value)} />
                </div>
                {details.length > 1 && (
                  <button type="button" className="absolute top-2 right-2 text-red-500 hover:text-red-700" onClick={() => removeDetail(idx)}><X size={16} /></button>
                )}
              </div>
            ))}
            <button type="button" className="mb-4 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200" onClick={addDetail}>+ Thêm thuốc</button>
            <button type="submit" className="btn-gradient-primary px-4 py-2 rounded text-white" disabled={loading}>{loading ? 'Đang lưu...' : 'Kê đơn'}</button>
          </form>
        </div>
      </div>
    );
  };

  const renderPatientHistoryTab = () => {
    return (
      <div className="space-y-6">
        {/* Header với nút refresh */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Lịch sử bệnh nhân</h2>
          <button
            onClick={refreshPatientData}
            disabled={refreshingPatients}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
          >
            {refreshingPatients ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Đang cập nhật...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Cập nhật dữ liệu</span>
              </>
            )}
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm bệnh nhân..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang điều trị</option>
              <option value="inactive">Ngừng điều trị</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loadingPatients && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-2 text-gray-600">Đang tải danh sách bệnh nhân...</p>
          </div>
        )}

        {/* Patient List */}
        {!loadingPatients && (
          <div className="space-y-4">
            {patients.length > 0 ? (
              patients.map((patient) => {
                // Lấy phác đồ hiện tại của bệnh nhân
                const currentPlan = patientTreatmentPlans
                  .filter((plan: any) => plan.patient?.id === patient.id)
                  .sort((a: any, b: any) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())[0];
                
                // Lấy tất cả phác đồ của bệnh nhân
                const patientPlans = patientTreatmentPlans
                  .filter((plan: any) => plan.patient?.id === patient.id)
                  .sort((a: any, b: any) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

                return (
                  <div key={patient.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={patient.avatar || 'https://i.pravatar.cc/150?img=4'}
                          alt={patient.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="text-lg font-semibold">{patient.name}</h3>
                          <p className="text-gray-600">
                            {patient.gender === 'male' ? 'Nam' : 'Nữ'}
                          </p>
                          {/* <p className="text-sm text-gray-600">
                            Mã BN: {patient.patientId}
                          </p> */}
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openCreateProtocolModal(patient)}
                          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm"
                        >
                          <FaPlus className="mr-2" />
                          Tạo phác đồ ARV
                        </button>
                        <button
                          onClick={() => handleViewPatientDetails(patient.id)}
                          className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm"
                        >
                          <FaEye className="mr-2" />
                          Xem chi tiết
                        </button>
                      </div>
                    </div>
                    
                    {/* Treatment Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Phác đồ hiện tại</h4>
                        {currentPlan ? (
                          <>
                            <p className="text-blue-700">{currentPlan.arvProtocol?.name || 'Không rõ'}</p>
                            <div className="text-sm text-blue-600 mt-1">
                              <p>Từ: {currentPlan.startDate ? formatDate(currentPlan.startDate) : 'Không rõ'}</p>
                              {currentPlan.endDate && (
                                <p>Đến: {formatDate(currentPlan.endDate)}</p>
                              )}
                              {!currentPlan.endDate && (
                                <p className="text-green-600 font-medium">Đang áp dụng</p>
                              )}
                            </div>
                          </>
                        ) : (
                          <div>
                            <p className="text-gray-500">Chưa có phác đồ ARV</p>
                            <button
                              onClick={() => openCreateProtocolModal(patient)}
                              className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                              + Tạo phác đồ ARV
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-800 mb-2">Lịch khám</h4>
                        {patient.lastVisit && (
                          <p className="text-green-700 text-sm">
                            Lần khám cuối: {formatDate(patient.lastVisit)}
                          </p>
                        )}
                        {patient.nextAppointment && (
                          <p className="text-green-700 text-sm">
                            Lịch hẹn tiếp: {formatDate(patient.nextAppointment)}
                          </p>
                        )}
                        {!patient.lastVisit && (
                          <p className="text-gray-500 text-sm">Chưa có lịch khám</p>
                        )}
                        <p className="text-sm mt-1">
                          Trạng thái:{' '}
                          <span
                            className={`font-medium ${
                              patient.status === 'active'
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            {patient.status === 'active' ? 'Đang điều trị' : 'Ngừng điều trị'}
                          </span>
                        </p>
                      </div>
                    </div>
                    
                    {/* Treatment History */}
                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Lịch sử phác đồ ARV</h4>
                      <div className="space-y-2">
                        {patientPlans.length > 0 ? (
                          patientPlans.map((plan: any, index: number) => (
                            <div key={plan.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                              <div>
                                <p className="font-medium">{plan.arvProtocol?.name || 'Không rõ'}</p>
                                <p className="text-sm text-gray-600">
                                  {formatDate(plan.startDate)} - {plan.endDate ? formatDate(plan.endDate) : 'Hiện tại'}
                                </p>
                                {plan.notes && (
                                  <p className="text-xs text-gray-500 mt-1">Ghi chú: {plan.notes}</p>
                                )}
                              </div>
                              <span className={`px-2 py-1 rounded text-xs ${
                                plan.endDate ? 'bg-gray-200 text-gray-700' : 'bg-green-200 text-green-700'
                              }`}>
                                {plan.endDate ? 'Đã kết thúc' : 'Đang áp dụng'}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-gray-500">Chưa có lịch sử phác đồ ARV</p>
                            <button
                              onClick={() => openCreateProtocolModal(patient)}
                              className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                              + Tạo phác đồ ARV đầu tiên
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Prescription Form */}
                    {user?.role?.roleName === 'ROLE_DOCTOR' && (
                      <button
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={() => setShowPrescriptionModal({patientId: patient.id, plans: patientPlans})}
                      >
                        Kê đơn thuốc
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Không có bệnh nhân nào</h3>
                <p className="text-gray-500">
                  Chưa có bệnh nhân nào đặt lịch khám với bác sĩ này
                </p>
              </div>
            )}
          </div>
        )}

        {/* Modal tạo phác đồ ARV */}
        {showCreateProtocolModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Tạo phác đồ ARV mới</h3>
                <button
                  onClick={() => setShowCreateProtocolModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bệnh nhân
                  </label>
                  <input
                    type="text"
                    value={selectedPatientForProtocol?.name || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chọn phác đồ ARV *
                  </label>
                  <select
                    value={selectedArvProtocolId}
                    onChange={(e) => setSelectedArvProtocolId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Chọn phác đồ ARV</option>
                    {arvProtocols.map(protocol => (
                      <option key={protocol.id} value={protocol.id}>
                        {protocol.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày bắt đầu *
                  </label>
                  <input
                    type="date"
                    value={protocolStartDate}
                    onChange={(e) => setProtocolStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ghi chú
                  </label>
                  <textarea
                    value={protocolNotes}
                    onChange={(e) => setProtocolNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập ghi chú về phác đồ điều trị..."
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowCreateProtocolModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreateProtocol}
                  disabled={creatingProtocol || !selectedArvProtocolId || !protocolStartDate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {creatingProtocol ? 'Đang tạo...' : 'Tạo phác đồ'}
                </button>
              </div>
            </div>
          </div>
        )}

        {showPrescriptionModal && (
          <PrescriptionForm
            patientId={showPrescriptionModal.patientId}
            treatmentPlans={showPrescriptionModal.plans}
            onSuccess={() => { setShowPrescriptionModal(null); refreshPatientData(); }}
            onClose={() => setShowPrescriptionModal(null)}
          />
        )}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'schedule':
        return renderScheduleTab();
      case 'consultation':
        return renderConsultationTab();
      case 'patient-history':
        return renderPatientHistoryTab();
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Vertical Tab Bar */}
          <div className="w-full md:w-64 space-y-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                activeTab === 'profile'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <User size={20} />
              <span>Thông tin cá nhân</span>
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                activeTab === 'schedule'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Calendar size={20} />
              <span>Lịch khám bệnh</span>
            </button>
            <button
              onClick={() => setActiveTab('consultation')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                activeTab === 'consultation'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <MessageSquare size={20} />
              <span>Lịch tư vấn</span>
            </button>
            <button
              onClick={() => setActiveTab('patient-history')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                activeTab === 'patient-history'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <ClipboardList size={20} />
              <span>Lịch sử bệnh nhân</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1">
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* Consultation Detail Modal */}
      <ConsultationDetailModal
        isOpen={showConsultationModal}
        onClose={() => {
          setShowConsultationModal(false);
          setSelectedConsultation(null);
        }}
        consultation={selectedConsultation}
        onUpdate={handleUpdateConsultation}
      />

      {/* Patient Detail Modal */}
      <PatientDetailModal
        isOpen={showPatientDetailModal}
        onClose={() => setShowPatientDetailModal(false)}
        patient={selectedPatient}
      />
    </div>
  );
};

export default DoctorProfile; 