import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { images } from '../constants/images';

const CallToAction: React.FC = () => {
  const features = [
    'Đội ngũ y bác sĩ giàu kinh nghiệm',
    'Bảo mật thông tin tuyệt đối',
    'Hỗ trợ 24/7',
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src={images.doctorTeam}
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/95 via-secondary-600/95 to-accent-600/95"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      
      {/* Blur effects */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-primary-500/30 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-secondary-500/30 rounded-full blur-3xl"></div>
      
      <div className="relative container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Bắt đầu hành trình chăm sóc sức khỏe của bạn
          </h2>
          <p className="text-lg text-white/90 mb-8 leading-relaxed">
            Đăng ký ngay hôm nay để sử dụng hệ thống quản lý và chăm sóc sức khỏe HIV hiệu quả.
            Chúng tôi sẽ đồng hành cùng bạn trong suốt quá trình điều trị.
          </p>

          {/* Features list */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center justify-center gap-2 text-white">
                <CheckCircle2 className="w-5 h-5 text-primary-200" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary-600 font-medium rounded-lg hover:bg-primary-50 transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              Đăng ký ngay
              <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/consultation" 
              className="inline-flex items-center justify-center px-8 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              Tư vấn miễn phí
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">1000+</div>
                <div className="text-sm text-white/80">Bệnh nhân tin tưởng</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-sm text-white/80">Hỗ trợ liên tục</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">100%</div>
                <div className="text-sm text-white/80">Bảo mật</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;