import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { consultationService } from '../services/api';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar } from 'react-calendar';
import type { Value } from 'react-calendar/dist/cjs/shared/types';
import 'react-calendar/dist/Calendar.css';
import { Mail, Phone, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { images } from '../constants/images';
import { useModal } from '../hooks/useModal';
import Modal from '../components/Modal';
import { FaUserMd } from 'react-icons/fa';

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  avatar: string;
  rating: number;
  experience: number;
  description: string;
}

interface TimeSlot {
  id: number;
  time: string;
  isAvailable: boolean;
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
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [formData, setFormData] = useState<ConsultationForm>({
    doctorId: 0,
    date: new Date(),
    timeSlotId: 0,
    symptoms: '',
    notes: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await consultationService.getDoctors();
        setDoctors(data);
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
        const slots = await consultationService.getTimeSlots(selectedDate);
        setTimeSlots(slots);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Không thể tải khung giờ');
      }
    };

    if (selectedDate) {
      fetchTimeSlots();
    }
  }, [selectedDate]);

  const handleDateChange = (value: Value) => {
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
      await consultationService.createConsultation(formData);
      setSuccess('Đặt lịch tư vấn thành công!');
      setFormData({
        doctorId: 0,
        date: new Date(),
        timeSlotId: 0,
        symptoms: '',
        notes: '',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đặt lịch thất bại. Vui lòng thử lại.');
    }
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Chọn bác sĩ</h2>
              <div className="space-y-4">
                {doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.doctorId === doctor.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, doctorId: doctor.id }))}
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={doctor.avatar}
                        alt={doctor.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">{doctor.name}</h3>
                        <p className="text-sm text-gray-500">{doctor.specialization}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-500">
                            {doctor.experience} năm kinh nghiệm
                          </span>
                          <span className="text-sm text-yellow-500">
                            ★ {doctor.rating.toFixed(1)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{doctor.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Chọn ngày</h2>
                <Calendar
                  onChange={handleDateChange}
                  value={selectedDate}
                  minDate={new Date()}
                  locale="vi"
                  className="w-full border-0"
                />
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Chọn giờ</h2>
                <div className="grid grid-cols-3 gap-4">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.id}
                      disabled={!slot.isAvailable}
                      onClick={() => setFormData(prev => ({ ...prev, timeSlotId: slot.id }))}
                      className={`p-3 text-center rounded-lg transition-colors ${
                        !slot.isAvailable
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : formData.timeSlotId === slot.id
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
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
                disabled={!formData.doctorId || !formData.timeSlotId}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
                  !formData.doctorId || !formData.timeSlotId
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700'
                }`}
              >
                Đặt lịch
              </button>
            </div>
          </div>
        </motion.div>
      </div>
      {/* Add Modal component */}
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

export default ConsultationPage;