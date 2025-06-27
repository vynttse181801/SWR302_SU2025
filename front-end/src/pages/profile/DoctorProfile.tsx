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
import { FaFileMedical, FaEye } from 'react-icons/fa';
import api from '../../services/api';

type TabType = 'profile' | 'schedule' | 'consultation' | 'patient-history';

interface DoctorProfileProps {}

interface DoctorFormData {
  name: string;
  email: string;
  phone: string;
  specialization: string;
  experience: string;
  education: string;
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
    experience: ((user as unknown) as Doctor)?.experience || '',
    education: ((user as unknown) as Doctor)?.education || '',
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleViewPatientDetails = (patientId: string) => {
    // TODO: Implement patient details view
    console.log('View patient details:', patientId);
  };

  useEffect(() => {
    if (user && user.id) {
      // Lấy lịch khám bệnh (appointments)
      api.get(`/appointments?doctorId=${user.id}`)
        .then(res => setAppointments(res.data))
        .catch(() => setAppointments([]));
      // Lấy lịch tư vấn (consultations)
      api.get('/online-consultations')
        .then(res => {
          // Lọc theo doctorId
          const filtered = (res.data || []).filter((c: any) => c.appointment?.doctor?.id === user.id);
          setConsultations(filtered);
        })
        .catch(() => setConsultations([]));
    }
  }, [user]);

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
      if (!user) return;
      
      const updatedUser = {
        ...user,
        id: Number(user.id),
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phone,
        role: user.role,
        username: user.username
      };

      await updateUser(updatedUser);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleAppointmentStatusChange = (appointmentId: string, newStatus: Appointment['status']) => {
    setAppointments(appointments.map(apt => 
      apt.id === appointmentId ? { ...apt, status: newStatus } : apt
    ));
    toast.success('Cập nhật trạng thái thành công');
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

  // Filter appointments based on selected status
  const filteredAppointments = appointments.filter(appointment => {
    if (selectedStatus === 'all') return true;
    if (selectedStatus === 'pending') {
      // Chỉ hiển thị lịch pending mà bác sĩ này phụ trách
      return appointment.status === 'pending' && String(appointment.doctorId) === String(user?.id);
    }
    return appointment.status === selectedStatus;
  });

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

            <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
              <GraduationCap className="text-blue-500" size={24} />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Học vấn</label>
                <input
                  type="text"
                  name="education"
                  value={formData.education}
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

    const filteredAppointments = appointments.filter(appointment => {
      if (selectedStatus === 'all') return true;
      if (selectedStatus === 'pending') {
        // Chỉ hiển thị lịch pending mà bác sĩ này phụ trách
        return appointment.status === 'pending' && String(appointment.doctorId) === String(user?.id);
      }
      return appointment.status === selectedStatus;
    });

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
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
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
                        <b>Trạng thái:</b> {appointment.status === 'pending' ? 'Chưa xác nhận' : appointment.status === 'confirmed' ? 'Đã xác nhận' : appointment.status === 'completed' ? 'Đã hoàn thành' : appointment.status === 'cancelled' ? 'Đã hủy' : appointment.status}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.status === 'pending' ? 'Chưa xác nhận' : appointment.status === 'confirmed' ? 'Đã xác nhận' : appointment.status === 'completed' ? 'Đã hoàn thành' : 'Đã hủy'}
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
            <div className="text-center py-8 text-gray-500">
              Không có lịch khám nào
            </div>
          )}
        </div>
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
      (c) => String(c.appointment?.doctor?.id) === String(user?.id)
    );

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
          {filteredConsultations.length > 0 ? (
            filteredConsultations.map((consultation: any) => (
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
                        {consultation.appointment?.patient?.fullName || 'Không rõ tên bệnh nhân'}
                      </h3>
                      <div className="text-sm text-gray-500">
                        <b>Loại tư vấn:</b> {consultation.consultationType?.name || 'Không rõ'}
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
                        <b>Trạng thái:</b> {consultation.status === 'pending' ? 'Chưa xác nhận' : consultation.status === 'confirmed' ? 'Đã xác nhận' : consultation.status === 'completed' ? 'Đã hoàn thành' : consultation.status === 'cancelled' ? 'Đã hủy' : consultation.status}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      consultation.status === 'completed' ? 'bg-green-100 text-green-800' :
                      consultation.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {consultation.status === 'pending' ? 'Chưa xác nhận' : consultation.status === 'confirmed' ? 'Đã xác nhận' : consultation.status === 'completed' ? 'Đã hoàn thành' : 'Đã hủy'}
                    </span>
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
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
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
      </div>
    );
  };

  const renderPatientHistoryTab = () => {
    const patients: Patient[] = [
      {
        id: '1',
        patientId: 'P001',
        name: 'Nguyễn Văn A',
        age: 35,
        gender: 'male',
        lastVisit: '2024-02-15',
        nextAppointment: '2024-03-15',
        status: 'active',
        avatar: 'https://i.pravatar.cc/150?img=1'
      },
      {
        id: '2',
        patientId: 'P002',
        name: 'Trần Thị B',
        age: 28,
        gender: 'female',
        lastVisit: '2024-02-10',
        status: 'active',
        avatar: 'https://i.pravatar.cc/150?img=2'
      },
      {
        id: '3',
        patientId: 'P003',
        name: 'Lê Văn C',
        age: 45,
        gender: 'male',
        lastVisit: '2024-01-20',
        nextAppointment: '2024-03-20',
        status: 'inactive',
        avatar: 'https://i.pravatar.cc/150?img=3'
      }
    ];

    return (
      <div className="space-y-6">
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

        {/* Patient List */}
        <div className="space-y-4">
          {patients.map((patient) => (
            <div key={patient.id} className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={patient.avatar || 'https://i.pravatar.cc/150?img=4'}
                  alt={patient.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold">{patient.name}</h3>
                  <p className="text-gray-600">
                    {patient.age} tuổi • {patient.gender === 'male' ? 'Nam' : 'Nữ'}
                  </p>
                  <div className="space-y-1 mt-2">
                    <p className="text-sm text-gray-600">
                      Lần khám cuối: {formatDate(patient.lastVisit)}
                    </p>
                    {patient.nextAppointment && (
                      <p className="text-sm text-gray-600">
                        Lịch hẹn tiếp: {formatDate(patient.nextAppointment)}
                      </p>
                    )}
                    <p className="text-sm">
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
              </div>
              <div className="flex justify-end gap-2">
                <Link
                  to={`/arv-protocol?patientId=${patient.patientId}`}
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 text-sm"
                >
                  <FaFileMedical className="mr-2" />
                  Phác đồ ARV
                </Link>
                <button
                  onClick={() => handleViewPatientDetails(patient.patientId)}
                  className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm"
                >
                  <FaEye className="mr-2" />
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
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
    </div>
  );
};

export default DoctorProfile; 