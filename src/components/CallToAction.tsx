import React from 'react';
import { Link } from 'react-router-dom';

const CallToAction: React.FC = () => {
  return (
    <section className="py-16 bg-black text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          Bắt đầu hành trình chăm sóc sức khỏe của bạn
        </h2>
        <p className="text-white/90 max-w-2xl mx-auto mb-8">
          Đăng ký ngay hôm nay để sử dụng hệ thống quản lý và chăm sóc sức khỏe HIV hiệu quả.
        </p>
        <Link 
          to="/register" 
          className="inline-block px-8 py-3 bg-white text-black font-medium rounded-md hover:bg-gray-100 transition-colors"
        >
          Đăng ký ngay
        </Link>
      </div>
    </section>
  );
};

export default CallToAction;