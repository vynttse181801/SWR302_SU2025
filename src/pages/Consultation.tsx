import React, { useState } from 'react';
import { Mail, Phone, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { images } from '../constants/images';
import { useModal } from '../hooks/useModal';
import Modal from '../components/Modal';

const ConsultationPage = () => {
  const navigate = useNavigate();
  const { modalState, showModal, hideModal } = useModal();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    consultationType: 'phone',
    preferredTime: '',
    description: ''
  });

  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const toggleAnonymous = () => {
    setIsAnonymous(!isAnonymous);
    if (!isAnonymous) {
      setFormData({
        ...formData,
        name: 'Ẩn danh',
        phone: 'xxx-xxx-xxxx',
        email: 'anonymous@example.com'
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
                {/* Consultation Types */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-up" style={{ animationDelay: '0.3s' }}>
                  {consultationTypes.map((type) => (
                    <label
                      key={type.id}
                      className="relative group cursor-pointer"
                    >
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                      <div className={`relative flex flex-col items-center p-6 rounded-lg transition-all duration-300
                        ${formData.consultationType === type.id 
                          ? 'border-2 border-primary-500 bg-primary-50/50' 
                          : 'border border-gray-200 hover:border-primary-200'}`}
                      >
                        <input
                          type="radio"
                          name="consultationType"
                          value={type.id}
                          checked={formData.consultationType === type.id}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className={`text-primary-600 mb-3 transform ${formData.consultationType === type.id ? 'scale-110' : ''} transition-transform duration-300`}>
                          {type.icon}
                        </div>
                        <h3 className="font-semibold text-gray-900 text-center mb-2">
                          {type.title}
                        </h3>
                        <p className="text-sm text-gray-600 text-center">
                          {type.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>

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
                      Số điện thoại {formData.consultationType === 'phone' && !isAnonymous && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required={formData.consultationType === 'phone' && !isAnonymous}
                      disabled={isAnonymous}
                      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 ${
                        isAnonymous ? 'bg-gray-100' : ''
                      }`}
                      placeholder={isAnonymous ? 'xxx-xxx-xxxx' : 'Nhập số điện thoại của bạn'}
                    />
                  </div>
                </div>

                {/* Email and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-up" style={{ animationDelay: '0.5s' }}>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email {formData.consultationType === 'email' && !isAnonymous && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required={formData.consultationType === 'email' && !isAnonymous}
                      disabled={isAnonymous}
                      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 ${
                        isAnonymous ? 'bg-gray-100' : ''
                      }`}
                      placeholder={isAnonymous ? 'anonymous@example.com' : 'Nhập địa chỉ email của bạn'}
                    />
                  </div>

                  <div>
                    <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 mb-1">
                      Thời gian mong muốn được tư vấn
                    </label>
                    <input
                      type="datetime-local"
                      id="preferredTime"
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300"
                    />
                  </div>
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
                      {formData.consultationType === 'phone' 
                        ? 'Chúng tôi sẽ gọi điện cho bạn trong thời gian bạn đã chọn'
                        : 'Bạn sẽ nhận được email phản hồi từ chuyên gia của chúng tôi'}
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