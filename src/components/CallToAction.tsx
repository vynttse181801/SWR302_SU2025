import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CallToAction: React.FC = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background với gradient và blur */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600"></div>
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      
      {/* Blur effects */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-primary-500/30 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-secondary-500/30 rounded-full blur-3xl"></div>
      
      <div className="relative container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Bắt đầu hành trình chăm sóc sức khỏe của bạn
          </h2>
          <p className="text-lg text-white/90 mb-10 leading-relaxed">
            Đăng ký ngay hôm nay để sử dụng hệ thống quản lý và chăm sóc sức khỏe HIV hiệu quả.
            Chúng tôi sẽ đồng hành cùng bạn trong suốt quá trình điều trị.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary-600 font-medium rounded-lg hover:bg-primary-50 transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              Đăng ký ngay
              <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/about" 
              className="inline-flex items-center justify-center px-8 py-3 bg-transparent text-white font-medium rounded-lg border-2 border-white/20 hover:bg-white/10 transition-all duration-300"
            >
              Tìm hiểu thêm
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;