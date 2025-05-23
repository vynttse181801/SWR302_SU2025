import React from 'react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section className="bg-white py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Chăm sóc sức khỏe HIV toàn diện
            </h1>
            <p className="text-gray-600 mb-6">
              Hệ thống quản lý và chăm sóc sức khỏe HIV hiện đại, chu đáo và hiệu quả. Chúng tôi cam kết hỗ trợ bạn trong toàn trình điều trị.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link 
                to="/register" 
                className="px-6 py-3 bg-black text-white font-medium rounded hover:bg-gray-900 transition-colors"
              >
                Bắt đầu ngay
              </Link>
              <Link 
                to="/about" 
                className="px-6 py-3 bg-white text-black border border-black font-medium rounded hover:bg-gray-50 transition-colors"
              >
                Tìm hiểu thêm
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="bg-gray-100 h-64 md:h-80 rounded-lg border border-gray-200"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;