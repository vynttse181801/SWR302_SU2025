import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { images } from '../constants/images';
import SearchBar from './SearchBar';

const Hero: React.FC = () => {
  const handleSearch = (query: string) => {
    // TODO: Implement search functionality
    console.log('Searching for:', query);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-50/50 via-white to-transparent py-20 md:py-32">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-secondary-100 rounded-full blur-3xl opacity-50"></div>
      </div>

      {/* SearchBar absolutely at the top right */}
      <div className="absolute top-8 right-4 sm:top-10 sm:right-10 z-20 pointer-events-none">
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-md pointer-events-auto">
          <SearchBar />
        </div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left content */}
          <div className="md:w-1/2 md:pr-12 animate-fade-in">
            <div className="inline-block px-4 py-2 bg-primary-50 rounded-full mb-6">
              <p className="text-sm text-primary-600 font-medium">
                Chăm sóc sức khỏe thông minh
              </p>
            </div>
            
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
                Chăm sóc sức khỏe
              </span>{' '}
              <br />
              <span className="text-gray-900">HIV toàn diện</span>
            </h1>

            <p className="text-gray-600 text-lg mb-8 leading-relaxed max-w-xl">
              Hệ thống quản lý và chăm sóc sức khỏe HIV hiện đại, chu đáo và hiệu quả. 
              Chúng tôi cam kết hỗ trợ bạn trong toàn trình điều trị.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Link 
                to="/test-bookings" 
                className="inline-flex items-center px-8 py-3 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold
                  hover:from-primary-600 hover:to-secondary-600 transform hover:scale-105 transition-all duration-300
                  shadow-lg hover:shadow-primary-500/25"
              >
                Bắt đầu ngay
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link 
                to="/about" 
                className="inline-flex items-center px-8 py-3 rounded-lg border-2 border-primary-500/20 text-primary-600 font-semibold
                  hover:bg-primary-50 hover:border-primary-500 transition-all duration-300"
              >
                Tìm hiểu thêm
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-primary-600" />
                </div>
                <p className="text-sm text-gray-600">
                  <span className="block font-semibold text-gray-900">100% Bảo mật</span>
                  Thông tin được mã hóa
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-secondary-50 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-secondary-600" />
                </div>
                <p className="text-sm text-gray-600">
                  <span className="block font-semibold text-gray-900">Hỗ trợ 24/7</span>
                  Luôn sẵn sàng giúp đỡ
                </p>
              </div>
            </div>
          </div>
          
          {/* Right image */}
          <div className="md:w-1/2 relative animate-fade-up">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-2xl blur opacity-75"></div>
            <div className="relative">
              <img
                src={images.doctorTeam}
                alt="Đội ngũ y tế chuyên nghiệp"
                className="rounded-xl shadow-xl w-full object-cover aspect-[4/3] transform hover:scale-[1.02] transition-transform duration-300"
              />
              
              {/* Floating cards */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg max-w-xs animate-fade-up" style={{ animationDelay: '0.3s' }}>
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

              <div className="absolute -top-6 -right-6 bg-white p-4 rounded-lg shadow-lg animate-fade-up" style={{ animationDelay: '0.6s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
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
