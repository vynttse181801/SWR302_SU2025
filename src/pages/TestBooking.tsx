import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { images } from '../constants/images';
import { useModal } from '../hooks/useModal';
import Modal from '../components/Modal';

const TestBooking = () => {
  const navigate = useNavigate();
  const { modalState, showModal, hideModal } = useModal();
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: '',
    phone: '',
    email: '',
    address: '',
    preferredDate: '',
    preferredTime: '',
    testType: 'regular',
    symptoms: '',
    hasPreviousTest: false,
    doctorId: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.checked
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Giả lập gọi API đăng ký
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Hiển thị thông báo thành công
      showModal(
        'Đặt lịch thành công!',
        'Chúng tôi đã nhận được yêu cầu của bạn và sẽ liên hệ trong thời gian sớm nhất.',
        'success',
        'Xem chi tiết',
        () => {
          // Chuyển hướng đến trang Profile với tab test-history
          navigate('/profile', { state: { activeTab: 'test-history' } });
        }
      );
    } catch (error) {
      // Hiển thị thông báo lỗi
      showModal(
        'Đặt lịch thất bại',
        'Có lỗi xảy ra trong quá trình đặt lịch. Vui lòng thử lại sau.',
        'error'
      );
    }
  };

  const testTypes = [
    { id: 'regular', label: 'Xét nghiệm định kỳ', description: 'Kiểm tra sức khỏe định kỳ' },
    { id: 'quick', label: 'Xét nghiệm nhanh', description: 'Kết quả trong 20-30 phút' },
    { id: 'confidential', label: 'Xét nghiệm kín', description: 'Bảo mật thông tin tuyệt đối' }
  ];

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00',
    '14:00', '15:00', '16:00', '17:00'
  ];

  const doctors = [
    {
      id: '1',
      name: 'BS. Nguyễn Văn A',
      specialization: 'Chuyên khoa HIV',
      experience: '15 năm kinh nghiệm',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    {
      id: '2',
      name: 'BS. Trần Thị B',
      specialization: 'Chuyên khoa HIV',
      experience: '12 năm kinh nghiệm',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    {
      id: '3',
      name: 'BS. Lê Văn C',
      specialization: 'Chuyên khoa HIV',
      experience: '10 năm kinh nghiệm',
      avatar: 'https://i.pravatar.cc/150?img=3'
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
              Đặt lịch xét nghiệm
            </h1>
            <p className="text-gray-600 text-lg">
              Chọn dịch vụ xét nghiệm phù hợp với nhu cầu của bạn
            </p>
          </div>

          <div className="relative group animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
            <div className="relative bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
              {/* Privacy Notice */}
              <div className="relative group mb-8">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                <div className="relative bg-primary-50 border border-primary-100 rounded-lg p-4">
                  <div className="flex gap-4">
                    <img
                      src={images.privacyShield}
                      alt="Biểu tượng bảo mật"
                      className="w-12 h-12 object-contain"
                    />
                    <div>
                      <div className="flex items-start gap-2">
                        <Shield className="text-primary-500 w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-primary-700">
                          <p className="font-medium mb-1">Thông tin bảo mật</p>
                          <p>
                            Chúng tôi cam kết bảo mật hoàn toàn thông tin của bạn. 
                            Kết quả xét nghiệm chỉ được thông báo trực tiếp cho bạn.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Test Type Selection */}
                <div className="animate-fade-up" style={{ animationDelay: '0.3s' }}>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Chọn loại xét nghiệm <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {testTypes.map((type) => (
                      <label
                        key={type.id}
                        className="relative group cursor-pointer"
                      >
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                        <div className={`relative p-4 rounded-lg transition-all duration-300
                          ${formData.testType === type.id 
                            ? 'border-2 border-primary-500 bg-primary-50/50' 
                            : 'border border-gray-200 hover:border-primary-200'}`}
                        >
                          <input
                            type="radio"
                            name="testType"
                            value={type.id}
                            checked={formData.testType === type.id}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <h3 className="font-semibold text-gray-900 mb-1">{type.label}</h3>
                          <p className="text-sm text-gray-600">{type.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-up" style={{ animationDelay: '0.4s' }}>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300"
                      placeholder="Nhập họ và tên của bạn"
                    />
                  </div>

                  <div>
                    <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày sinh <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="dob"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                      Giới tính <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300"
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300"
                      placeholder="Nhập số điện thoại của bạn"
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-up" style={{ animationDelay: '0.5s' }}>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300"
                      placeholder="Nhập địa chỉ email của bạn"
                    />
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Địa chỉ
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300"
                      placeholder="Nhập địa chỉ của bạn"
                    />
                  </div>
                </div>

                {/* Test Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-up" style={{ animationDelay: '0.6s' }}>
                  <div>
                    <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày xét nghiệm <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="preferredDate"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 mb-1">
                      Thời gian <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="preferredTime"
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300"
                    >
                      <option value="">Chọn thời gian</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Doctor Selection */}
                <div className="animate-fade-up" style={{ animationDelay: '0.65s' }}>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Chọn bác sĩ <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {doctors.map((doctor) => (
                      <label
                        key={doctor.id}
                        className="relative group cursor-pointer"
                      >
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                        <div className={`relative p-4 rounded-lg transition-all duration-300
                          ${formData.doctorId === doctor.id 
                            ? 'border-2 border-primary-500 bg-primary-50/50' 
                            : 'border border-gray-200 hover:border-primary-200'}`}
                        >
                          <input
                            type="radio"
                            name="doctorId"
                            value={doctor.id}
                            checked={formData.doctorId === doctor.id}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <div className="flex flex-col items-center">
                            <img
                              src={doctor.avatar}
                              alt={doctor.name}
                              className="w-16 h-16 rounded-full mb-3 object-cover"
                            />
                            <h3 className="font-semibold text-gray-900 text-center mb-1">
                              {doctor.name}
                            </h3>
                            <p className="text-sm text-primary-600 mb-1">
                              {doctor.specialization}
                            </p>
                            <p className="text-xs text-gray-500">
                              {doctor.experience}
                            </p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Additional Information */}
                <div className="animate-fade-up" style={{ animationDelay: '0.7s' }}>
                  <div>
                    <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-1">
                      Triệu chứng (nếu có)
                    </label>
                    <textarea
                      id="symptoms"
                      name="symptoms"
                      value={formData.symptoms}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300"
                      placeholder="Mô tả các triệu chứng bạn đang gặp phải (nếu có)"
                    ></textarea>
                  </div>

                  <div className="mt-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        name="hasPreviousTest"
                        checked={formData.hasPreviousTest}
                        onChange={handleCheckboxChange}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                        Tôi đã từng xét nghiệm HIV trước đây
                      </span>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="animate-fade-up" style={{ animationDelay: '0.8s' }}>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg font-semibold hover:from-primary-700 hover:to-secondary-700 transform hover:scale-[1.01] active:scale-[0.99] focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all duration-300"
                  >
                    Đặt lịch xét nghiệm
                  </button>
                </div>
              </form>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 animate-fade-up" style={{ animationDelay: '0.9s' }}>
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                  <div className="relative bg-white rounded-lg overflow-hidden">
                    <img
                      src={images.doctorTeam}
                      alt="Đội ngũ y tế chuyên nghiệp"
                      className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Đội ngũ y tế chuyên nghiệp
                      </h3>
                      <p className="text-sm text-gray-600">
                        Được thực hiện bởi các bác sĩ và chuyên viên xét nghiệm có nhiều năm kinh nghiệm.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                  <div className="relative bg-white rounded-lg overflow-hidden">
                    <img
                      src={images.testResult}
                      alt="Kết quả xét nghiệm"
                      className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Kết quả nhanh chóng, chính xác
                      </h3>
                      <p className="text-sm text-gray-600">
                        Kết quả xét nghiệm được thông báo nhanh chóng và đảm bảo độ chính xác cao.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
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

export default TestBooking;
