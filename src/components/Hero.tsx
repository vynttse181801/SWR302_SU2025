import React from 'react';
import { Link } from 'react-router-dom';

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
          <div className="md:w-1/2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-secondary-600/10 rounded-2xl"></div>
              <div className="bg-gradient-to-r from-gray-100 to-white h-72 md:h-96 rounded-2xl shadow-lg relative overflow-hidden">
                {/* Add hero image here */}
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent-500/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-primary-600/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;