import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { images } from '../constants/images';

const TestBooking = () => {
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
    hasPreviousTest: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-primary-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            {/* Hero section với hình ảnh */}
            <div className="relative mb-8">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-2xl blur opacity-75"></div>
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src={images.laboratory}
                  alt="Phòng xét nghiệm hiện đại"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center p-6">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg gradient-heading">
                    Đặt lịch xét nghiệm
                  </h1>
                </div>
              </div>
            </div>
            <p className="text-gray-600">
              Điền thông tin của bạn để đặt lịch xét nghiệm HIV
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 transition-all duration-300 hover:shadow-xl">
            <div className="bg-primary-50 border border-primary-100 rounded-lg p-4 mb-8">
              <div className="flex gap-4">
                <img
                  src={images.privacyShield}
                  alt="Biểu tượng bảo mật"
                  className="w-16 h-16 object-contain"
                />
                <div className="flex-1">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="text-primary-500 w-5 h-5 flex-shrink-0 mt-0.5" />
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

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Loại xét nghiệm */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Chọn loại xét nghiệm <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {testTypes.map((type) => (
                    <label
                      key={type.id}
                      className="relative group"
                    >
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                      <div className={`relative bg-white rounded-lg p-4 cursor-pointer transition-all duration-300
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
                        <span className="block font-medium mb-1 text-gray-900">{type.label}</span>
                        <span className="block text-sm text-gray-500">{type.description}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Thông tin cá nhân */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              {/* Thời gian xét nghiệm */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </div>

              {/* Thông tin bổ sung */}
              <div className="space-y-6">
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
                </div>                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                  <label className="relative flex items-center gap-3 p-2 cursor-pointer">
                    <input
                      type="checkbox"
                      id="hasPreviousTest"
                      name="hasPreviousTest"
                      checked={formData.hasPreviousTest}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-2 border-gray-300 text-primary-600 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        Tôi đã từng xét nghiệm HIV trước đây
                      </span>
                      <span className="text-xs text-gray-500 mt-0.5">
                        Thông tin này giúp bác sĩ theo dõi lịch sử xét nghiệm của bạn tốt hơn
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg font-semibold hover:from-primary-700 hover:to-secondary-700 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all duration-300"
                >
                  Đặt lịch xét nghiệm
                </button>

                <div className="mt-6 text-sm text-gray-600">
                  <p>
                    Sau khi đặt lịch, chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ để xác nhận.
                    <br />
                    Nếu cần hỗ trợ gấp, vui lòng gọi số hotline: <span className="font-semibold">1800 1234</span>
                  </p>
                </div>
              </div>
            </form>
          </div>

          {/* Thêm phần thông tin về đội ngũ y tế */}
          <div className="mt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                <div className="relative bg-white rounded-lg overflow-hidden">
                  <img
                    src={images.doctorTeam}
                    alt="Đội ngũ y tế chuyên nghiệp"
                    className="w-full h-48 object-cover"
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
                    className="w-full h-48 object-cover"
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
  );
};

export default TestBooking;
