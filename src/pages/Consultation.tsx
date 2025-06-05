import React, { useState } from 'react';
import { Mail, Phone, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { images } from '../constants/images';
import { useModal } from '../hooks/useModal';
import Modal from '../components/Modal';
import { FaUserMd } from 'react-icons/fa';

const ConsultationPage = () => {
  const navigate = useNavigate();
  const { modalState, showModal, hideModal } = useModal();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    preferredTime: '',
    description: '',
    doctorId: ''
  });

  const [isAnonymous, setIsAnonymous] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<{date: string, slots: string[]}[]>([]);

  // Add mock doctors data
  const doctors = [
    { id: '1', name: 'Bác sĩ Nguyễn Văn A', specialty: 'Nội tổng quát' },
    { id: '2', name: 'Bác sĩ Trần Thị B', specialty: 'Nhi khoa' },
    { id: '3', name: 'Bác sĩ Lê Văn C', specialty: 'Da liễu' }
  ];

  // Mock data for doctor's available time slots
  const mockAvailableSlots = {
    '1': [
      { date: '2024-03-20', slots: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
      { date: '2024-03-21', slots: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
      { date: '2024-03-22', slots: ['09:00', '10:00', '11:00', '14:00', '15:00'] }
    ],
    '2': [
      { date: '2024-03-20', slots: ['13:00', '14:00', '15:00', '16:00'] },
      { date: '2024-03-21', slots: ['13:00', '14:00', '15:00', '16:00'] },
      { date: '2024-03-22', slots: ['13:00', '14:00', '15:00', '16:00'] }
    ],
    '3': [
      { date: '2024-03-20', slots: ['08:00', '09:00', '10:00', '11:00'] },
      { date: '2024-03-21', slots: ['08:00', '09:00', '10:00', '11:00'] },
      { date: '2024-03-22', slots: ['08:00', '09:00', '10:00', '11:00'] }
    ]
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Update available time slots when doctor is selected
    if (name === 'doctorId') {
      setAvailableTimeSlots(mockAvailableSlots[value as keyof typeof mockAvailableSlots] || []);
      setFormData(prev => ({ ...prev, preferredTime: '' })); // Reset selected time
    }
  };

  const toggleAnonymous = () => {
    setIsAnonymous(!isAnonymous);
    if (!isAnonymous) {
      setFormData({
        ...formData,
        name: 'Ẩn danh',
        phone: '',
        email: ''
      });
    } else {
      setFormData({
        ...formData,
        name: '',
        phone: '',
        email: ''
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Giả lập gọi API đăng ký tư vấn
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Hiển thị thông báo thành công
      showModal(
        'Gửi yêu cầu thành công!',
        'Chúng tôi đã nhận được yêu cầu của bạn và sẽ liên hệ trong thời gian sớm nhất.',
        'success',
        'Xem chi tiết',
        () => {
          // Chuyển hướng đến trang Profile với tab consultation-history
          navigate('/profile', { state: { activeTab: 'consultation-history' } });
        }
      );
    } catch (error) {
      // Hiển thị thông báo lỗi
      showModal(
        'Gửi yêu cầu thất bại',
        'Có lỗi xảy ra trong quá trình gửi yêu cầu. Vui lòng thử lại sau.',
        'error'
      );
    }
  };

  const consultationTypes = [
    {
      id: 'phone',
      icon: <Phone className="w-8 h-8" />,
      title: 'Tư vấn qua điện thoại',
      description: 'Nhận tư vấn trực tiếp qua cuộc gọi điện thoại'
    },
    {
      id: 'email',
      icon: <Mail className="w-8 h-8" />,
      title: 'Tư vấn qua email',
      description: 'Nhận tư vấn chi tiết qua email'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-primary-50 py-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute -bottom-8 right-1/4 w-96 h-96 bg-secondary-100 rounded-full mix-blend-multiply blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-100 rounded-full mix-blend-multiply blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-up">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent">
              Đặt lịch tư vấn
            </h1>
            <p className="text-gray-600 text-lg">
              Chọn phương thức tư vấn phù hợp với bạn
            </p>
          </div>

          <div className="relative group animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
            <div className="relative bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
              {/* Privacy Info */}
              <div className="flex justify-between items-start mb-8">
                {/* Image and Text */}
                <div className="flex gap-4 items-start">
                  <img
                    src={images.privacyShield}
                    alt="Privacy Shield"
                    className="w-12 h-12 object-contain"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Bảo mật thông tin
                    </h3>
                    <p className="text-sm text-gray-600">
                      Thông tin của bạn được bảo mật tuyệt đối và chỉ được sử dụng cho mục đích tư vấn
                    </p>
                  </div>
                </div>

                {/* Anonymous Toggle */}
                <button
                  onClick={toggleAnonymous}
                  className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-50 to-secondary-50 hover:from-primary-100 hover:to-secondary-100 rounded-lg transition-colors"
                >
                  {isAnonymous ? (
                    <>
                      <EyeOff size={16} className="text-primary-600" />
                      <span className="text-sm text-primary-700">Đang ẩn danh</span>
                    </>
                  ) : (
                    <>
                      <Eye size={16} className="text-primary-600" />
                      <span className="text-sm text-primary-700">Chế độ ẩn danh</span>
                    </>
                  )}
                </button>
              </div>

              {isAnonymous && (
                <div className="relative group mb-8 animate-fade-up">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                  <div className="relative bg-primary-50 border border-primary-100 p-4 rounded-lg">
                    <div className="flex gap-2">
                      <AlertCircle className="w-5 h-5 text-primary-500 flex-shrink-0" />
                      <p className="text-sm text-primary-700">
                        <strong>Lưu ý:</strong> Khi sử dụng chế độ ẩn danh, nhân viên tư vấn sẽ liên hệ với bạn thông qua phương thức tư vấn đã chọn mà không cần thông tin cá nhân của bạn.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-up" style={{ animationDelay: '0.4s' }}>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Họ và tên {!isAnonymous && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required={!isAnonymous}
                      disabled={isAnonymous}
                      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 ${
                        isAnonymous ? 'bg-gray-100' : ''
                      }`}
                      placeholder={isAnonymous ? 'Ẩn danh' : 'Nhập họ và tên của bạn'}
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={isAnonymous}
                      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 ${
                        isAnonymous ? 'bg-gray-100' : ''
                      }`}
                      placeholder={isAnonymous ? 'Không hiển thị' : 'Nhập số điện thoại của bạn (không bắt buộc)'}
                    />
                  </div>
                </div>

                {/* Email and Doctor Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-up" style={{ animationDelay: '0.5s' }}>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300"
                      placeholder="Nhập địa chỉ email của bạn"
                    />
                  </div>

                  {/* Doctor Selection */}
                  <div className="animate-fade-up" style={{ animationDelay: '0.6s' }}>
                    <div className="flex justify-between items-center mb-4">
                      <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700">
                        Chọn bác sĩ <span className="text-red-500">*</span>
                      </label>
                      <button
                        onClick={() => window.location.href = '/doctors'}
                        className="flex items-center text-primary-600 hover:text-primary-700 transition-colors duration-300"
                      >
                        <FaUserMd className="mr-2" />
                        Xem thông tin bác sĩ
                      </button>
                    </div>
                    <select
                      id="doctorId"
                      name="doctorId"
                      value={formData.doctorId}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300"
                    >
                      <option value="">Chọn bác sĩ</option>
                      {doctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.name} - {doctor.specialty}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Time Selection */}
                <div className="animate-fade-up" style={{ animationDelay: '0.5s' }}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thời gian tư vấn <span className="text-red-500">*</span>
                  </label>
                  {formData.doctorId ? (
                    <div className="space-y-4">
                      {availableTimeSlots.map((daySlot) => (
                        <div key={daySlot.date} className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-3">
                            {new Date(daySlot.date).toLocaleDateString('vi-VN', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                            {daySlot.slots.map((time) => {
                              const dateTime = `${daySlot.date}T${time}`;
                              const isSelected = formData.preferredTime === dateTime;
                              return (
                                <button
                                  key={dateTime}
                                  type="button"
                                  onClick={() => setFormData(prev => ({ ...prev, preferredTime: dateTime }))}
                                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                                    isSelected
                                      ? 'bg-primary-600 text-white'
                                      : 'bg-gray-50 text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                                  }`}
                                >
                                  {time}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 italic">
                      Vui lòng chọn bác sĩ để xem thời gian tư vấn
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="animate-fade-up" style={{ animationDelay: '0.6s' }}>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Nội dung cần tư vấn
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300"
                    placeholder="Mô tả ngắn gọn vấn đề bạn cần được tư vấn"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div className="animate-fade-up" style={{ animationDelay: '0.7s' }}>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg font-semibold hover:from-primary-700 hover:to-secondary-700 transform hover:scale-[1.01] active:scale-[0.99] focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all duration-300"
                  >
                    {isAnonymous ? 'Gửi yêu cầu ẩn danh' : 'Gửi yêu cầu tư vấn'}
                  </button>

                  <div className="mt-6 space-y-2">
                    <p className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-primary-500">✓</span>
                      Bạn sẽ nhận được email phản hồi từ bác sĩ đã chọn
                    </p>
                    <p className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-primary-500">✓</span>
                      Nếu cần hỗ trợ gấp, vui lòng gọi số hotline: <span className="font-semibold">1800 1234</span>
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
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