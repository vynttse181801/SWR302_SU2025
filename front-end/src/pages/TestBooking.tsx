import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { testService } from '../services/api';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Shield } from 'lucide-react';
import { FaUserMd } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { images } from '../constants/images';
import { useModal } from '../hooks/useModal';
import Modal from '../components/Modal';
import nguyenVanA from '../assets/images/nguyen-van-a.jpg';
import tranThiB from '../assets/images/tran-thi-b.jpg';
import leVanC from '../assets/images/le-van-c.jpg';
import { LabTestType } from '../types';

interface TimeSlot {
  id: number;
  time: string;
  isAvailable: boolean;
}

interface BookingForm {
  testTypeId: number;
  date: Date;
  timeSlotId: number;
  notes: string;
}

const TestBooking = () => {
  const navigate = useNavigate();
  const { modalState, showModal, hideModal } = useModal();
  const [testTypes, setTestTypes] = useState<LabTestType[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [formData, setFormData] = useState<BookingForm>({
    testTypeId: 0,
    date: new Date(),
    timeSlotId: 0,
    notes: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestTypes = async () => {
      try {
        const response = await testService.getTestTypes();
        setTestTypes(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Không thể tải danh sách xét nghiệm');
      } finally {
        setLoading(false);
      }
    };

    fetchTestTypes();
  }, []);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setFormData(prev => ({ ...prev, date }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await testService.bookTest({
        ...formData,
        patientId: 1,
        status: 'pending'
      });
      setSuccess('Đặt lịch xét nghiệm thành công!');
      setFormData({
        testTypeId: 0,
        date: new Date(),
        timeSlotId: 0,
        notes: '',
      });
      navigate('/test-bookings');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đặt lịch thất bại. Vui lòng thử lại.');
    }
  };

  const hardcodedTimeSlots: TimeSlot[] = [
    { id: 1, time: '08:00', isAvailable: true },
    { id: 2, time: '09:00', isAvailable: true },
    { id: 3, time: '10:00', isAvailable: true },
    { id: 4, time: '11:00', isAvailable: true },
    { id: 5, time: '14:00', isAvailable: true },
    { id: 6, time: '15:00', isAvailable: true },
    { id: 7, time: '16:00', isAvailable: true },
    { id: 8, time: '17:00', isAvailable: true },
  ];

  const doctors = [
    {
      id: '1',
      name: 'BS. Nguyễn Văn A',
      specialization: 'Chuyên khoa HIV',
      experience: '15 năm kinh nghiệm',
      avatar: nguyenVanA
    },
    {
      id: '2',
      name: 'BS. Trần Thị B',
      specialization: 'Chuyên khoa HIV',
      experience: '12 năm kinh nghiệm',
      avatar: tranThiB
    },
    {
      id: '3',
      name: 'BS. Lê Văn C',
      specialization: 'Chuyên khoa HIV',
      experience: '10 năm kinh nghiệm',
      avatar: leVanC
    }
  ];

  console.log('Doctor avatars:', doctors.map(d => ({ name: d.name, avatar: d.avatar })));

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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Đặt lịch xét nghiệm</h1>

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
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Chọn loại xét nghiệm</h2>
              <div className="space-y-4">
                {testTypes.map((type) => (
                  <div
                    key={type.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.testTypeId === type.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, testTypeId: type.id }))}
                  >
                    <h3 className="font-medium text-gray-900">{type.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                    <p className="text-sm text-gray-900 mt-2">
                      Thời gian: {type.durationMinutes} phút
                    </p>
                    <p className="text-sm font-medium text-primary-600 mt-1">
                      {type.price.toLocaleString('vi-VN')} VNĐ
                    </p>
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
                  {hardcodedTimeSlots.map((slot) => (
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
                disabled={!formData.testTypeId || !formData.timeSlotId}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Đặt lịch xét nghiệm
              </button>
            </div>
          </div>

          <Modal
            isOpen={modalState.isOpen}
            onClose={hideModal}
            title={modalState.title}
            content={modalState.content}
            image={modalState.image}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default TestBooking;
