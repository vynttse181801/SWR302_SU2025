import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { testBookingService } from '../services/api';
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

interface TestType {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
}

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
  const [testTypes, setTestTypes] = useState<TestType[]>([]);
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
        const types = await testBookingService.getTestTypes();
        setTestTypes(types);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Không thể tải danh sách xét nghiệm');
      } finally {
        setLoading(false);
      }
    };

    fetchTestTypes();
  }, []);

  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        const slots = await testBookingService.getTimeSlots(selectedDate);
        setTimeSlots(slots);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Không thể tải khung giờ');
      }
    };

    if (selectedDate) {
      fetchTimeSlots();
    }
  }, [selectedDate]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setFormData(prev => ({ ...prev, date }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await testBookingService.createBooking(formData);
      setSuccess('Đặt lịch xét nghiệm thành công!');
      setFormData({
        testTypeId: 0,
        date: new Date(),
        timeSlotId: 0,
        notes: '',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đặt lịch thất bại. Vui lòng thử lại.');
    }
  };

  const testTypesData = [
    { id: 'regular', label: 'Xét nghiệm định kỳ', description: 'Kiểm tra sức khỏe định kỳ' },
    { id: 'quick', label: 'Xét nghiệm nhanh', description: 'Kết quả trong 20-30 phút' },
    { id: 'confidential', label: 'Xét nghiệm kín', description: 'Bảo mật thông tin tuyệt đối' }
  ];

  const timeSlotsData = [
    '08:00', '09:00', '10:00', '11:00',
    '14:00', '15:00', '16:00', '17:00'
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
                      Thời gian: {type.duration} phút
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
                className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
                  !formData.testTypeId || !formData.timeSlotId
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

export default TestBooking;
