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
      icon: <Phone className="w-6 h-6" />,
      title: 'Tư vấn qua điện thoại',
      description: 'Nhận tư vấn trực tiếp qua cuộc gọi điện thoại'
    },
    {
      id: 'email',
      icon: <Mail className="w-6 h-6" />,
      title: 'Tư vấn qua email',
      description: 'Nhận tư vấn chi tiết qua email'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Đặt lịch tư vấn
            </h1>
            <p className="text-gray-600">
              Chọn phương thức tư vấn phù hợp với bạn
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <div className="flex justify-end mb-6">
              <button
                onClick={toggleAnonymous}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                {isAnonymous ? (
                  <>
                    <EyeOff size={16} />
                    <span className="text-sm">Đang ẩn danh</span>
                  </>
                ) : (
                  <>
                    <Eye size={16} />
                    <span className="text-sm">Chế độ ẩn danh</span>
                  </>
                )}
              </button>
            </div>            {isAnonymous && (
              <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-lg mb-6">
                <p className="text-sm text-yellow-800">
                  <strong>Lưu ý:</strong> Khi sử dụng chế độ ẩn danh, nhân viên tư vấn sẽ liên hệ với bạn thông qua phương thức tư vấn đã chọn mà không cần thông tin cá nhân của bạn.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {consultationTypes.map((type) => (
                  <label
                    key={type.id}
                    className={`flex flex-col items-center p-6 rounded-lg border-2 cursor-pointer transition-colors
                      ${formData.consultationType === type.id 
                        ? 'border-black bg-gray-50' 
                        : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <input
                      type="radio"
                      name="consultationType"
                      value={type.id}
                      checked={formData.consultationType === type.id}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="text-gray-900 mb-3">
                      {type.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 text-center mb-2">
                      {type.title}
                    </h3>
                    <p className="text-sm text-gray-600 text-center">
                      {type.description}
                    </p>
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
                    className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black ${
                      isAnonymous ? 'bg-gray-100' : ''
                    }`}
                    placeholder={isAnonymous ? 'Ẩn danh' : 'Nhập họ và tên của bạn'}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại {formData.consultationType === 'phone' && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required={formData.consultationType === 'phone'}
                    disabled={isAnonymous}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black ${
                      isAnonymous ? 'bg-gray-100' : ''
                    }`}
                    placeholder={isAnonymous ? 'xxx-xxx-xxxx' : 'Nhập số điện thoại của bạn'}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email {formData.consultationType === 'email' && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required={formData.consultationType === 'email'}
                  disabled={isAnonymous}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black ${
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                  placeholder="Mô tả ngắn gọn vấn đề bạn cần được tư vấn"
                ></textarea>
              </div>

              <div className="text-right">
                <button
                  type="submit"
                  className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-900 transition-colors"
                >
                  {isAnonymous ? 'Gửi yêu cầu ẩn danh' : 'Gửi yêu cầu tư vấn'}
                </button>
              </div>
            </form>

            <div className="mt-8 text-sm text-gray-600">
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
        </div>
      </div>
    </div>
  );
};

export default ConsultationPage;