import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Đặt lịch xét nghiệm
            </h1>
            <p className="text-gray-600">
              Điền thông tin của bạn để đặt lịch xét nghiệm HIV
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <div className="flex gap-2">
                <AlertCircle className="text-blue-500 w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">Thông tin bảo mật</p>
                  <p>
                    Chúng tôi cam kết bảo mật hoàn toàn thông tin của bạn. 
                    Kết quả xét nghiệm chỉ được thông báo trực tiếp cho bạn.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Loại xét nghiệm */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn loại xét nghiệm <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {testTypes.map((type) => (
                    <label
                      key={type.id}
                      className={`relative border rounded-lg p-4 cursor-pointer transition-colors
                        ${formData.testType === type.id 
                          ? 'border-black bg-gray-50' 
                          : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <input
                        type="radio"
                        name="testType"
                        value={type.id}
                        checked={formData.testType === type.id}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span className="block font-medium mb-1">{type.label}</span>
                      <span className="block text-sm text-gray-500">{type.description}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Thông tin cá nhân */}
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                  placeholder="Nhập địa chỉ của bạn"
                />
              </div>

              {/* Thời gian xét nghiệm */}
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                  >
                    <option value="">Chọn thời gian</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Thông tin bổ sung */}
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                  placeholder="Mô tả các triệu chứng bạn đang gặp phải (nếu có)"
                ></textarea>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="hasPreviousTest"
                  name="hasPreviousTest"
                  checked={formData.hasPreviousTest}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-black focus:ring-black"
                />
                <label htmlFor="hasPreviousTest" className="text-sm text-gray-700">
                  Tôi đã từng xét nghiệm HIV trước đây
                </label>
              </div>

              <div className="text-right">
                <button
                  type="submit"
                  className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-900 transition-colors"
                >
                  Đặt lịch xét nghiệm
                </button>
              </div>
            </form>

            <div className="mt-8 text-sm text-gray-600">
              <p>
                Sau khi đặt lịch, chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ để xác nhận.
                <br />
                Nếu cần hỗ trợ gấp, vui lòng gọi số hotline: <span className="font-semibold">1800 1234</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestBooking;
