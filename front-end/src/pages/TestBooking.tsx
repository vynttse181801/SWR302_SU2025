import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { testService } from '../services/api';
import { format, addDays } from 'date-fns';
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
import PaymentForm from '../components/PaymentForm';

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

interface ConsultationType {
  id: number;
  name: string;
  description?: string;
}

const TestBooking = () => {
  const navigate = useNavigate();
  const { modalState, showModal, hideModal } = useModal();
  const [testTypes, setTestTypes] = useState<LabTestType[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [consultationTypes, setConsultationTypes] = useState<ConsultationType[]>([]);
  const [formData, setFormData] = useState<BookingForm & { consultationTypeId: number }>({
    testTypeId: 0,
    date: new Date(),
    timeSlotId: 0,
    notes: '',
    consultationTypeId: 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [selectedTestType, setSelectedTestType] = useState<LabTestType | null>(null);

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

  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        const response = await testService.getLabTestTimeSlots(selectedDate);
        // API trả về mảng string, map thành TimeSlot với id là index+1
        setTimeSlots(
          response.data.map((time: string, idx: number) => ({
            id: idx + 1,
            time,
            isAvailable: true
          }))
        );
      } catch (err: any) {
        setTimeSlots([]);
      }
    };
    fetchTimeSlots();
  }, [selectedDate]);

  useEffect(() => {
    const fetchConsultationTypes = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/consultation-types');
        const data = await res.json();
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

  const handleDateChange = (value: Date | Date[] | null) => {
    if (value && value instanceof Date) {
      setSelectedDate(value);
      setFormData(prev => ({ ...prev, date: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const bookingRes = await testService.bookTest({
        ...formData,
        patientId: 1,
        status: 'pending',
        consultationTypeId: formData.consultationTypeId
      });
      setBookingId(bookingRes.data.id);
      setSelectedTestType(testTypes.find(t => t.id === formData.testTypeId) || null);
      setShowPayment(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đặt lịch thất bại. Vui lòng thử lại.');
    }
  };

  const handlePaymentSuccess = (paymentData: any) => {
    setShowPayment(false);
    setSuccess('Thanh toán thành công!');
    setFormData({
      testTypeId: 0,
      date: new Date(),
      timeSlotId: 0,
      notes: '',
      consultationTypeId: 1
    });
    setBookingId(null);
    setSelectedTestType(null);
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

          {showPayment && bookingId && selectedTestType ? (
            <PaymentForm
              amount={selectedTestType.price}
              bookingType="test"
              bookingId={bookingId}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentCancel={() => setShowPayment(false)}
            />
          ) : (
            <div className="grid grid-cols-1 gap-8">
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

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Chọn ngày</h2>
                <div className="border rounded-lg overflow-hidden">
                  <Calendar
                    onChange={value => handleDateChange(value as Date)}
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
                  {timeSlots.length === 0 ? (
                    <p className="text-gray-500 col-span-2">Không có khung giờ khả dụng cho ngày này.</p>
                  ) : (
                    timeSlots.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => setFormData(prev => ({ ...prev, timeSlotId: slot.id }))}
                        className={`p-3 text-center rounded-lg transition-all ${
                          formData.timeSlotId === slot.id
                            ? 'bg-primary-500 text-white ring-2 ring-primary-300'
                            : 'bg-gray-50 text-gray-900 hover:bg-gray-100 hover:ring-1 hover:ring-gray-300'
                        }`}
                      >
                        <span className="text-lg font-medium">{slot.time}</span>
                      </button>
                    ))
                  )}
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
          )}

          <Modal
            isOpen={modalState.isOpen}
            onClose={hideModal}
            title={modalState.title}
            message={modalState.message}
            type={modalState.type}
            buttonText={modalState.buttonText}
            onButtonClick={modalState.onButtonClick}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default TestBooking;
