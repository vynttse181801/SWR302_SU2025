import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, HeartPulse, Clock, Shield } from 'lucide-react';
import { images } from '../constants/images';

const CallToAction: React.FC = () => {
  const features = [
    {
      icon: <HeartPulse className="w-5 h-5 text-primary-200" />,
      text: 'Đội ngũ y bác sĩ giàu kinh nghiệm'
    },
    {
      icon: <Shield className="w-5 h-5 text-primary-200" />,
      text: 'Bảo mật thông tin tuyệt đối'
    },
    {
      icon: <Clock className="w-5 h-5 text-primary-200" />,
      text: 'Hỗ trợ 24/7'
    }
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
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/30 rounded-full blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-500/30 rounded-full blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-500/30 rounded-full blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      
      <div className="relative container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center animate-fade-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Bắt đầu hành trình chăm sóc
              <span className="bg-gradient-to-r from-primary-200 via-secondary-200 to-accent-200 bg-clip-text text-transparent block mt-2">
                sức khỏe của bạn
              </span>
            </h2>
            <p className="text-lg text-white/90 mb-8 leading-relaxed">
              Đăng ký ngay hôm nay để sử dụng hệ thống quản lý và chăm sóc sức khỏe HIV hiệu quả.
              Chúng tôi sẽ đồng hành cùng bạn trong suốt quá trình điều trị.
            </p>
          </div>

          {/* Features list */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="flex items-center justify-center gap-3 text-white bg-white/10 rounded-lg px-4 py-3 backdrop-blur-sm border border-white/20 transform hover:scale-[1.02] transition-all duration-300"
              >
                {feature.icon}
                <span className="text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Link 
              to="/register" 
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-medium rounded-xl hover:bg-primary-50 transform hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] transition-all duration-300 group"
            >
              <span className="relative">
                Đăng ký ngay
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform"></span>
              </span>
              <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/consultation" 
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-medium rounded-xl hover:bg-white/10 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group"
            >
              <span className="relative">
                Tư vấn miễn phí
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-white transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform"></span>
              </span>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 pt-8 border-t border-white/20 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center transform hover:scale-[1.05] transition-transform duration-300">
                <div className="text-4xl font-bold text-white mb-1 bg-gradient-to-r from-primary-200 via-secondary-200 to-accent-200 bg-clip-text">1000+</div>
                <div className="text-sm text-white/80">Bệnh nhân tin tưởng</div>
              </div>
              <div className="text-center transform hover:scale-[1.05] transition-transform duration-300">
                <div className="text-4xl font-bold text-white mb-1 bg-gradient-to-r from-secondary-200 via-accent-200 to-primary-200 bg-clip-text">24/7</div>
                <div className="text-sm text-white/80">Hỗ trợ liên tục</div>
              </div>
              <div className="text-center transform hover:scale-[1.05] transition-transform duration-300">
                <div className="text-4xl font-bold text-white mb-1 bg-gradient-to-r from-accent-200 via-primary-200 to-secondary-200 bg-clip-text">100%</div>
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