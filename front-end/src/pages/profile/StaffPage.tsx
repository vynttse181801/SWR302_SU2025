import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, MapPin, Search, Filter, Plus, Edit, Trash, Eye, Bell, FileText, Activity } from 'lucide-react';
import { toast } from 'react-toastify';
import { staffService } from '../../services/api';
import AppointmentManagement from '../../components/AppointmentManagement';
import PatientManagement from '../../components/PatientManagement';
import ReminderManagement from '../../components/ReminderManagement';
import LabBookingManagement from '../../components/LabBookingManagement';
import ConsultationManagement from '../../components/ConsultationManagement';
import { Appointment, LabBooking, User as UserType, OnlineConsultation } from '../../types';

interface Patient {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  medicalRecordNumber: string;
  lastVisit: string;
  nextAppointment?: string;
  emergencyContact?: string;
  bloodType?: string;
  allergies?: string[];
  chronicDiseases?: string[];
  medications?: string[];
}

interface Reminder {
  id: number;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  type: 'MEDICATION' | 'FOLLOW_UP' | 'TEST' | 'APPOINTMENT';
  message: string;
  dueDate: string;
  dueTime?: string;
  status: 'PENDING' | 'SENT' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  notes?: string;
}

const StaffPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'appointments' | 'patients' | 'reminders' | 'labBookings' | 'consultations'>('appointments');
  const [loading, setLoading] = useState(false);

  // State for data
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [labBookings, setLabBookings] = useState<LabBooking[]>([]);
  const [consultations, setConsultations] = useState<OnlineConsultation[]>([]);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const enrichLabBookingsWithPatientName = async (bookings: LabBooking[]) => {
    return Promise.all(bookings.map(async (booking) => {
      if ((!booking.patientName || booking.patientName === '' || booking.patientName === undefined) && booking.patientId) {
        try {
          const res = await staffService.getPatientById(booking.patientId);
          return { ...booking, patientName: res.data.fullName };
        } catch {
          return { ...booking, patientName: 'Không rõ' };
        }
      }
      return booking;
    }));
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // Load appointments
      const appointmentsResponse = await staffService.getAllAppointments();
      setAppointments(appointmentsResponse.data || []);

      // Load patients
      const patientsResponse = await staffService.getAllPatients();
      setPatients(patientsResponse.data || []);

      // Load reminders
      const remindersResponse = await staffService.getAllReminders();
      setReminders(remindersResponse.data || []);

      // Load lab bookings
      const labBookingsResponse = await staffService.getAllLabBookings();
      const enrichedLabBookings = await enrichLabBookingsWithPatientName(labBookingsResponse.data || []);
      setLabBookings(enrichedLabBookings);

      // Load consultations
      const consultationsResponse = await staffService.getAllOnlineConsultations();
      setConsultations(consultationsResponse.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  // Appointment handlers
  const handleUpdateAppointment = async (id: number, data: Partial<Appointment>) => {
    try {
      await staffService.updateAppointment(id, data);
      setAppointments(prev => prev.map(apt => 
        apt.id === id ? { ...apt, ...data } : apt
      ));
      toast.success('Cập nhật lịch hẹn thành công!');
    } catch (error) {
      toast.error('Lỗi khi cập nhật lịch hẹn');
    }
  };

  const handleDeleteAppointment = async (id: number) => {
    try {
      await staffService.deleteAppointment(id);
      setAppointments(prev => prev.filter(apt => apt.id !== id));
      toast.success('Xóa lịch hẹn thành công!');
    } catch (error) {
      toast.error('Lỗi khi xóa lịch hẹn');
    }
  };

  const handleConfirmAppointment = async (id: number) => {
    try {
      await staffService.confirmAppointment(id);
      setAppointments(prev => prev.map(apt => 
        apt.id === id ? { ...apt, status: 'CONFIRMED' as const } : apt
      ));
      toast.success('Xác nhận lịch hẹn thành công!');
    } catch (error) {
      toast.error('Lỗi khi xác nhận lịch hẹn');
    }
  };

  const handleCancelAppointment = async (id: number) => {
    try {
      await staffService.cancelAppointment(id);
      setAppointments(prev => prev.map(apt => 
        apt.id === id ? { ...apt, status: 'CANCELLED' as const } : apt
      ));
      toast.success('Hủy lịch hẹn thành công!');
    } catch (error) {
      toast.error('Lỗi khi hủy lịch hẹn');
    }
  };

  // Patient handlers
  const handleUpdatePatient = async (id: number, data: Partial<Patient>) => {
    try {
      await staffService.updatePatient(id, data);
      setPatients(prev => prev.map(patient => 
        patient.id === id ? { ...patient, ...data } : patient
      ));
      toast.success('Cập nhật hồ sơ bệnh nhân thành công!');
    } catch (error) {
      toast.error('Lỗi khi cập nhật hồ sơ bệnh nhân');
    }
  };

  const handleDeletePatient = async (id: number) => {
    try {
      // Note: This endpoint might not exist in the backend yet
      // await staffService.deletePatient(id);
      setPatients(prev => prev.filter(patient => patient.id !== id));
      toast.success('Xóa hồ sơ bệnh nhân thành công!');
    } catch (error) {
      toast.error('Lỗi khi xóa hồ sơ bệnh nhân');
    }
  };

  const handleCreatePatient = async (data: Omit<Patient, 'id'>) => {
    try {
      // Note: This endpoint might not exist in the backend yet
      // const response = await staffService.createPatient(data);
      const newPatient = { ...data, id: Date.now() }; // Temporary ID
      setPatients(prev => [...prev, newPatient]);
      toast.success('Tạo hồ sơ bệnh nhân thành công!');
    } catch (error) {
      toast.error('Lỗi khi tạo hồ sơ bệnh nhân');
    }
  };

  const handleViewPatientDetails = (id: number) => {
    // This will be handled by the PatientManagement component
    console.log('View patient details:', id);
  };

  // Reminder handlers
  const handleSendReminder = async (id: number) => {
    try {
      await staffService.sendReminder(id);
      setReminders(prev => prev.map(reminder => 
        reminder.id === id ? { ...reminder, status: 'SENT' as const } : reminder
      ));
      toast.success('Gửi nhắc nhở thành công!');
    } catch (error) {
      toast.error('Lỗi khi gửi nhắc nhở');
    }
  };

  const handleCompleteReminder = async (id: number) => {
    try {
      await staffService.completeReminder(id);
      setReminders(prev => prev.map(reminder => 
        reminder.id === id ? { ...reminder, status: 'COMPLETED' as const } : reminder
      ));
      toast.success('Hoàn thành nhắc nhở!');
    } catch (error) {
      toast.error('Lỗi khi hoàn thành nhắc nhở');
    }
  };

  const handleUpdateReminder = async (id: number, data: Partial<Reminder>) => {
    try {
      await staffService.updateReminder(id, data);
      setReminders(prev => prev.map(reminder => 
        reminder.id === id ? { ...reminder, ...data } : reminder
      ));
      toast.success('Cập nhật nhắc nhở thành công!');
    } catch (error) {
      toast.error('Lỗi khi cập nhật nhắc nhở');
    }
  };

  const handleDeleteReminder = async (id: number) => {
    try {
      await staffService.deleteReminder(id);
      setReminders(prev => prev.filter(reminder => reminder.id !== id));
      toast.success('Xóa nhắc nhở thành công!');
    } catch (error) {
      toast.error('Lỗi khi xóa nhắc nhở');
    }
  };

  const handleCreateReminder = async (data: Omit<Reminder, 'id'>) => {
    try {
      await staffService.createReminder(data);
      await loadData(); // Reload reminders
      toast.success('Tạo nhắc nhở thành công!');
    } catch (error) {
      toast.error('Lỗi khi tạo nhắc nhở');
    }
  };

  // Lab booking handlers
  const handleConfirmLabBooking = async (id: number) => {
    try {
      await staffService.updateLabBookingStatus(id, 'confirmed');
      setLabBookings(prev => prev.map(booking => 
        booking.id === id ? { ...booking, status: 'confirmed' as const } : booking
      ));
      toast.success('Xác nhận lịch xét nghiệm thành công!');
    } catch (error) {
      toast.error('Lỗi khi xác nhận lịch xét nghiệm');
    }
  };

  const handleCancelLabBooking = async (id: number) => {
    try {
      await staffService.updateLabBookingStatus(id, 'cancelled');
      setLabBookings(prev => prev.map(booking => 
        booking.id === id ? { ...booking, status: 'cancelled' as const } : booking
      ));
      toast.success('Hủy lịch xét nghiệm thành công!');
    } catch (error) {
      toast.error('Lỗi khi hủy lịch xét nghiệm');
    }
  };

  const handleUpdateLabBookingStatus = async (id: number, status: string) => {
    try {
      await staffService.updateLabBookingStatus(id, status);
      setLabBookings(prev =>
        prev.map(booking =>
          booking.id === id ? { ...booking, status: status as LabBooking['status'] } : booking
        )
      );
      toast.success('Cập nhật trạng thái thành công!');
    } catch (error) {
      toast.error('Cập nhật trạng thái thất bại!');
    }
  };

  // Consultation handlers
  const handleConfirmConsultation = async (id: number) => {
    try {
      await staffService.updateOnlineConsultationStatus(id, 'confirmed');
      setConsultations(prev => prev.map(consultation =>
        consultation.id === id ? { ...consultation, status: 'confirmed' as const } : consultation
      ));
      toast.success('Xác nhận lịch tư vấn thành công!');
    } catch (error) {
      toast.error('Lỗi khi xác nhận lịch tư vấn');
    }
  };

  const handleCancelConsultation = async (id: number) => {
    try {
      await staffService.updateOnlineConsultationStatus(id, 'cancelled');
      setConsultations(prev => prev.map(consultation =>
        consultation.id === id ? { ...consultation, status: 'cancelled' as const } : consultation
      ));
      toast.success('Hủy lịch tư vấn thành công!');
    } catch (error) {
      toast.error('Lỗi khi hủy lịch tư vấn');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="text-center">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur opacity-25"></div>
            <div className="relative animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          </div>
          <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      {/*<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý hành chính</h1>
            <p className="text-gray-600 mt-1">Quản lý lịch hẹn, hồ sơ bệnh nhân và nhắc nhở</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{appointments.length}</div>
              <div className="text-sm text-gray-500">Lịch hẹn hôm nay</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{patients.length}</div>
              <div className="text-sm text-gray-500">Bệnh nhân</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-600">{reminders.filter(r => r.status === 'PENDING').length}</div>
              <div className="text-sm text-gray-500">Nhắc nhở chờ</div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            
            <button
              onClick={() => setActiveTab('patients')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'patients'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Hồ sơ bệnh nhân</span>
            </button>
            <button
              onClick={() => setActiveTab('reminders')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'reminders'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Nhắc nhở</span>
            </button>
            <button
              onClick={() => setActiveTab('labBookings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === 'labBookings' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <FileText className="w-4 h-4" />
              <span>Lịch xét nghiệm</span>
            </button>
            <button
              onClick={() => setActiveTab('consultations')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === 'consultations' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <Activity className="w-4 h-4" />
              <span>Lịch tư vấn</span>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'appointments' && (
            <AppointmentManagement
              appointments={appointments}
              onUpdateAppointment={handleUpdateAppointment}
              onDeleteAppointment={handleDeleteAppointment}
              onConfirmAppointment={handleConfirmAppointment}
              onCancelAppointment={handleCancelAppointment}
            />
          )}

          {activeTab === 'patients' && (
            <PatientManagement
              patients={patients}
              onUpdatePatient={handleUpdatePatient}
              onDeletePatient={handleDeletePatient}
              onCreatePatient={handleCreatePatient}
              onViewPatientDetails={handleViewPatientDetails}
            />
          )}

          {activeTab === 'reminders' && (
            <ReminderManagement
              reminders={reminders}
              onSendReminder={handleSendReminder}
              onCompleteReminder={handleCompleteReminder}
              onUpdateReminder={handleUpdateReminder}
              onDeleteReminder={handleDeleteReminder}
              onCreateReminder={handleCreateReminder}
            />
          )}

          {activeTab === 'labBookings' && (
            <LabBookingManagement
              labBookings={labBookings}
              onConfirmLabBooking={handleConfirmLabBooking}
              onCancelLabBooking={handleCancelLabBooking}
              onUpdateLabBookingStatus={handleUpdateLabBookingStatus}
            />
          )}

          {activeTab === 'consultations' && (
            <ConsultationManagement
              consultations={consultations}
              onConfirmConsultation={handleConfirmConsultation}
              onCancelConsultation={handleCancelConsultation}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffPage; 