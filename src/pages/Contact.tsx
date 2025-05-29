import React from 'react';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-primary-50 py-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute -bottom-8 right-1/4 w-96 h-96 bg-secondary-100 rounded-full mix-blend-multiply blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-100 rounded-full mix-blend-multiply blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-12 animate-fade-up">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent">
            Liên hệ với chúng tôi
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Nếu bạn có bất kỳ câu hỏi hoặc thắc mắc nào, vui lòng liên hệ với chúng tôi qua form bên dưới hoặc thông tin liên hệ của chúng tôi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
            <div className="relative bg-white p-6 rounded-lg flex flex-col gap-3 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                <Phone className="w-6 h-6" />
              </div>
              <div className="font-semibold text-lg text-gray-900">Điện thoại</div>
              <div className="text-gray-600">Đường dây nóng: <span className="font-medium">1800 1234</span></div>
              <div className="text-gray-600">Hỗ trợ: <span className="font-medium">024 1234 5678</span></div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
            <div className="relative bg-white p-6 rounded-lg flex flex-col gap-3 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                <Mail className="w-6 h-6" />
              </div>
              <div className="font-semibold text-lg text-gray-900">Email</div>
              <div className="text-gray-600">info@hivcare.vn</div>
              <div className="text-gray-600">support@hivcare.vn</div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
            <div className="relative bg-white p-6 rounded-lg flex flex-col gap-3 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="font-semibold text-lg text-gray-900">Địa chỉ</div>
              <div className="text-gray-600">123 Đường Nguyễn Văn A, Quận 1</div>
              <div className="text-gray-600">Thành phố Hồ Chí Minh, Việt Nam</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
            <div className="relative bg-white p-6 rounded-lg hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="font-semibold text-lg text-gray-900">Giờ làm việc</div>
              </div>
              <div className="space-y-2 text-gray-600">
                <div>Thứ Hai - Thứ Sáu: 8:00 - 17:00</div>
                <div>Thứ Bảy: 8:00 - 12:00</div>
                <div>Chủ Nhật: Đóng cửa</div>
                <div className="text-sm text-primary-600 mt-2">Đường dây nóng hoạt động 24/7</div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
            <div className="relative bg-white p-6 rounded-lg hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                  <Send className="w-6 h-6" />
                </div>
                <div className="font-semibold text-lg text-gray-900">Gửi tin nhắn cho chúng tôi</div>
              </div>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên*</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300" 
                    placeholder="Nguyễn Văn A" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300" 
                    placeholder="example@gmail.com" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  <input 
                    type="tel" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300" 
                    placeholder="0123456789" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chủ đề</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300" 
                    placeholder="Chủ đề nhắn" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tin nhắn*</label>
                  <textarea 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300" 
                    rows={4} 
                    placeholder="Nội dung tin nhắn của bạn" 
                    required
                  ></textarea>
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <button 
                    type="submit" 
                    className="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg font-semibold hover:from-primary-700 hover:to-secondary-700 transform hover:scale-[1.01] active:scale-[0.99] focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all duration-300"
                  >
                    Gửi tin nhắn
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="relative group animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <div className="absolute -inset-1 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
          <div className="relative bg-white p-6 rounded-lg hover:shadow-lg transition-all duration-300">
            <div className="font-semibold text-lg text-gray-900 mb-4">Bản đồ</div>
            <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center text-gray-500">
              Bản đồ vị trí của chúng tôi
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage; 