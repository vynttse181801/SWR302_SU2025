import React from 'react';
import { Link } from 'react-router-dom';
import { images } from '../constants/images';

const Hero: React.FC = () => {
  return (
    <section className="bg-gradient-to-b from-primary-50/50 to-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              <span className="gradient-heading">Chăm sóc sức khỏe</span>{' '}
              <br />HIV toàn diện
            </h1>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Hệ thống quản lý và chăm sóc sức khỏe HIV hiện đại, chu đáo và hiệu quả. Chúng tôi cam kết hỗ trợ bạn trong toàn trình điều trị.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/register" 
                className="btn-primary"
              >
                Bắt đầu ngay
              </Link>
              <Link 
                to="/about" 
                className="btn-outline"
              >
                Tìm hiểu thêm
              </Link>
            </div>
          </div>
          
          <div className="md:w-1/2 relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-2xl blur opacity-75"></div>
            <div className="relative">
              <img
                src={images.doctorTeam}
                alt="Đội ngũ y tế chuyên nghiệp"
                className="rounded-xl shadow-xl w-full object-cover aspect-[4/3]"
              />
              {/* Floating card trên hình ảnh */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg max-w-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={images.privacyShield}
                    alt="Bảo mật"
                    className="w-12 h-12 object-contain"
                  />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Bảo mật tuyệt đối</h3>
                    <p className="text-xs text-gray-600">Thông tin của bạn được bảo vệ an toàn</p>
                  </div>
                </div>
              </div>
              {/* Floating card thứ 2 */}
              <div className="absolute -top-6 -right-6 bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                    24/7
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Hỗ trợ liên tục</h3>
                    <p className="text-xs text-gray-600">Luôn sẵn sàng giúp đỡ bạn</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;