import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { consultationService } from '../services/api';
import { format } from 'date-fns';
import { parseISO } from 'date-fns/parseISO';
import { vi } from 'date-fns/locale';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../hooks/useModal';
import Modal from '../components/Modal';
import PaymentForm from '../components/PaymentForm';

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  avatar: string;
  rating: number;
  experience: number;
  bio: string;
}

interface TimeSlot {
  id: number;
  time: string;
  isAvailable: boolean;
}

interface ConsultationType {
  id: number;
  name: string;
  description?: string;
}

interface ConsultationForm {
  doctorId: number;
  date: Date;
  timeSlotId: number;
  symptoms: string;
  notes: string;
}

const ConsultationPage: React.FC = () => {
  const navigate = useNavigate();
  const { modalState, showModal, hideModal } = useModal();
  const [doctors, setDoctors] = useState<Doctor[]>([
    {
      id: 1,
      name: 'BS. Nguyễn Văn A',
      specialization: 'Chuyên khoa HIV',
      avatar: 'https://i.pravatar.cc/150?img=1',
      rating: 4.8,
      experience: 15,
      bio: 'Bác sĩ chuyên khoa HIV với 15 năm kinh nghiệm'
    },
    {
      id: 2,
      name: 'BS. Trần Thị B',
      specialization: 'Chuyên khoa HIV',
      avatar: 'https://i.pravatar.cc/150?img=2',
      rating: 4.9,
      experience: 12,
      bio: 'Bác sĩ chuyên khoa HIV với 12 năm kinh nghiệm'
    },
    {
      id: 3,
      name: 'BS. Lê Văn C',
      specialization: 'Chuyên khoa HIV',
      avatar: 'https://i.pravatar.cc/150?img=3',
      rating: 4.7,
      experience: 10,
      bio: 'Bác sĩ chuyên khoa HIV với 10 năm kinh nghiệm'
    }
  ]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [consultationTypes, setConsultationTypes] = useState<ConsultationType[]>([]);
  const [formData, setFormData] = useState<ConsultationForm & { consultationTypeId: number }>({
    doctorId: 0,
    date: new Date(),
    timeSlotId: 0,
    symptoms: '',
    notes: '',
    consultationTypeId: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [consultationId, setConsultationId] = useState<number | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await consultationService.getDoctors();
        console.log('Doctors API response:', response.data);
        setDoctors(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Không thể tải danh sách bác sĩ');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        if (formData.doctorId && selectedDate) {
          const response = await consultationService.getTimeSlots(formData.doctorId, selectedDate);
          console.log('Time Slots API response:', response.data);
          setTimeSlots(
            response.data.map((slot: any) => ({
              ...slot,
              time: slot.time || (slot.startTime ? slot.startTime.slice(11, 16) : ''),
              isAvailable: !slot.isBooked
            }))
          );
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Không thể tải khung giờ');
      }
    };

    if (selectedDate) {
      fetchTimeSlots();
    }
  }, [selectedDate]);

  useEffect(() => {
    const fetchConsultationTypes = async () => {
      try {
        const res = await consultationService.getConsultationTypes();
        const data = res.data;
        setConsultationTypes(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, consultationTypeId: data[0].id }));
        }
      } catch (err) {
        // Có thể xử lý lỗi nếu cần
      }
    };
    fetchConsultationTypes();
  }, []);

  const handleDateChange = (value: any) => {
    if (value instanceof Date) {
      setSelectedDate(value);
      setFormData(prev => ({ ...prev, date: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const consultationRes = await consultationService.createConsultation({
        doctorId: formData.doctorId,
        date: formData.date,
        timeSlotId: formData.timeSlotId,
        symptoms: formData.symptoms,
        notes: formData.notes,
        consultationTypeId: formData.consultationTypeId
      });
      setConsultationId(consultationRes.data.id);
      setSelectedDoctor(doctors.find(d => d.id === formData.doctorId) || null);
      setShowPayment(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đặt lịch thất bại. Vui lòng thử lại.');
    }
  };

  const handlePaymentSuccess = (paymentData: any) => {
    setShowPayment(false);
    setSuccess('Thanh toán thành công!');
    setFormData({
      doctorId: 0,
      date: new Date(),
      timeSlotId: 0,
      symptoms: '',
      notes: '',
      consultationTypeId: consultationTypes.length > 0 ? consultationTypes[0].id : 1
    });
    setConsultationId(null);
    setSelectedDoctor(null);
    // Có thể chuyển hướng hoặc cập nhật UI tại đây
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Đặt lịch tư vấn</h1>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{success}</span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Chọn bác sĩ</h2>
              <div className="relative">
                <select
                  value={formData.doctorId}
                  onChange={(e) => setFormData(prev => ({ ...prev, doctorId: parseInt(e.target.value) }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="">Chọn bác sĩ</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialization}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {formData.doctorId && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  {doctors.find(d => d.id === formData.doctorId) && (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={doctors.find(d => d.id === formData.doctorId)?.avatar} 
                          alt="Doctor" 
                          className="w-20 h-20 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {doctors.find(d => d.id === formData.doctorId)?.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {doctors.find(d => d.id === formData.doctorId)?.specialization}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-sm font-medium text-gray-900">Kinh nghiệm</p>
                          <p className="text-sm text-gray-600">
                            {doctors.find(d => d.id === formData.doctorId)?.experience} năm
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-sm font-medium text-gray-900">Đánh giá</p>
                          <p className="text-sm text-gray-600">
                            ★ {doctors.find(d => d.id === formData.doctorId)?.rating.toFixed(1)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Chọn ngày</h2>
                <div className="border rounded-lg overflow-hidden">
                  <Calendar
                    onChange={handleDateChange}
                    value={selectedDate}
                    minDate={new Date()}
                    locale="vi"
                    className="w-full border-0"
                    tileClassName={({ date }) => 
                      format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                        ? 'bg-primary-500 text-white rounded-lg'
                        : ''
                    }
                  />
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p>Ngày đã chọn: {format(selectedDate, 'EEEE, dd/MM/yyyy')}</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Chọn thời gian</h2>
                <div className="grid grid-cols-2 gap-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.id}
                      disabled={!slot.isAvailable}
                      onClick={() => setFormData(prev => ({ ...prev, timeSlotId: slot.id }))}
                      className={`p-3 text-center rounded-lg transition-all ${
                        !slot.isAvailable
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : formData.timeSlotId === slot.id
                          ? 'bg-primary-500 text-white ring-2 ring-primary-300'
                          : 'bg-gray-50 text-gray-900 hover:bg-gray-100 hover:ring-1 hover:ring-gray-300'
                      }`}
                    >
                      <span className="text-lg font-medium">{slot.time}</span>
                      {!slot.isAvailable && (
                        <span className="block text-xs mt-1">Đã đặt</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Chọn loại tư vấn</h2>
              <select
                value={formData.consultationTypeId}
                onChange={e => setFormData(prev => ({ ...prev, consultationTypeId: Number(e.target.value) }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white mb-4"
              >
                {consultationTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Triệu chứng</h2>
              <textarea
                value={formData.symptoms}
                onChange={(e) => setFormData(prev => ({ ...prev, symptoms: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={4}
                placeholder="Mô tả các triệu chứng bạn đang gặp phải"
              />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Ghi chú</h2>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={4}
                placeholder="Nhập ghi chú (nếu có)"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!formData.doctorId || !formData.timeSlotId || !formData.symptoms}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Đặt lịch tư vấn
            </button>
          </div>
        </motion.div>
      </div>

      <Modal
        isOpen={modalState.isOpen}
        onClose={hideModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        buttonText={modalState.buttonText}
        onButtonClick={modalState.onButtonClick}
      />

      {showPayment && consultationId && selectedDoctor ? (
        <PaymentForm
          amount={500000} // Giá tư vấn cố định hoặc lấy từ API
          bookingType="appointment"
          bookingId={consultationId}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentCancel={() => setShowPayment(false)}
        />
      ) : (
        <div className="grid grid-cols-1 gap-8">
        </div>
      )}
    </div>
  );
};

export default ConsultationPage;