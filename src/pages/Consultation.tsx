import React, { useState } from 'react';
import { Mail, Phone, Eye, EyeOff } from 'lucide-react';

const ConsultationPage = () => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
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
    <div className="min-h-screen bg-gradient-to-b from-secondary-50 via-white to-secondary-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 gradient-heading">
              Đặt lịch tư vấn
            </h1>
            <p className="text-gray-600">
              Chọn phương thức tư vấn phù hợp với bạn
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 transition-all duration-300 hover:shadow-xl">
            <div className="flex justify-end mb-6">
              <button
                onClick={toggleAnonymous}
                className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-secondary-50 to-accent-50 hover:from-secondary-100 hover:to-accent-100 rounded-lg transition-colors"
              >
                {isAnonymous ? (
                  <>
                    <EyeOff size={16} className="text-secondary-600" />
                    <span className="text-sm text-secondary-700">Đang ẩn danh</span>
                  </>
                ) : (
                  <>
                    <Eye size={16} className="text-secondary-600" />
                    <span className="text-sm text-secondary-700">Chế độ ẩn danh</span>
                  </>
                )}
              </button>
            </div>

            {isAnonymous && (
              <div className="bg-accent-50 border border-accent-100 p-4 rounded-lg mb-6">
                <p className="text-sm text-accent-800">
                  <strong>Lưu ý:</strong> Khi sử dụng chế độ ẩn danh, nhân viên tư vấn sẽ liên hệ với bạn thông qua phương thức tư vấn đã chọn mà không cần thông tin cá nhân của bạn.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {consultationTypes.map((type) => (
                  <label
                    key={type.id}
                    className="relative group"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-secondary-100 to-accent-100 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                    <div className={`relative flex flex-col items-center p-6 rounded-lg cursor-pointer transition-all duration-300
                      ${formData.consultationType === type.id 
                        ? 'border-2 border-secondary-500 bg-secondary-50/50' 
                        : 'border border-gray-200 hover:border-secondary-200'}`}
                    >
                      <input
                        type="radio"
                        name="consultationType"
                        value={type.id}
                        checked={formData.consultationType === type.id}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className={`text-secondary-600 mb-3 ${formData.consultationType === type.id ? 'scale-110' : ''} transition-transform duration-300`}>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500/20 focus:border-secondary-500 transition-all duration-300 ${
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
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500/20 focus:border-secondary-500 transition-all duration-300 ${
                      isAnonymous ? 'bg-gray-100' : ''
                    }`}
                    placeholder={isAnonymous ? 'xxx-xxx-xxxx' : 'Nhập số điện thoại của bạn'}
                  />
                </div>
              </div>

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
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500/20 focus:border-secondary-500 transition-all duration-300 ${
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500/20 focus:border-secondary-500 transition-all duration-300"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Nội dung cần tư vấn
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500/20 focus:border-secondary-500 transition-all duration-300"
                  placeholder="Mô tả ngắn gọn vấn đề bạn cần được tư vấn"
                ></textarea>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-secondary-600 to-accent-600 text-white rounded-lg font-semibold hover:from-secondary-700 hover:to-accent-700 focus:ring-2 focus:ring-secondary-500/20 focus:outline-none transition-all duration-300"
                >
                  {isAnonymous ? 'Gửi yêu cầu ẩn danh' : 'Gửi yêu cầu tư vấn'}
                </button>

                <div className="mt-6 text-sm text-gray-600">
                  <p className="mb-2">
                    {formData.consultationType === 'phone' 
                      ? '✓ Chúng tôi sẽ gọi điện cho bạn trong thời gian bạn đã chọn'
                      : '✓ Bạn sẽ nhận được email phản hồi từ chuyên gia của chúng tôi'}
                  </p>
                  <p>
                    Nếu cần hỗ trợ gấp, vui lòng gọi số hotline: <span className="font-semibold">1800 1234</span>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationPage;