import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-t from-primary-900 via-primary-800 to-secondary-900 text-white border-t border-primary-700">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h3 className="text-2xl font-bold mb-4 gradient-heading">HIV Care</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Hệ thống quản lý và chăm sóc sức khỏe HIV toàn diện, hỗ trợ bạn trong suốt quá trình điều trị.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary-200">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">Trang chủ</Link></li>
              <li><Link to="/services" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">Dịch vụ</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">Về chúng tôi</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">Liên hệ</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary-200">Dịch vụ</h3>
            <ul className="space-y-2">
              <li><Link to="/test-booking" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">Đặt lịch khám</Link></li>
              <li><Link to="/profile" state={{ activeTab: 'test-history' }} className="text-gray-300 hover:text-primary-400 transition-colors text-sm">Kết quả xét nghiệm</Link></li>
              <li><Link to="/profile" state={{ activeTab: 'arv-protocol' }} className="text-gray-300 hover:text-primary-400 transition-colors text-sm">Quản lý thuốc ARV</Link></li>
              <li><Link to="/consultation" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">Tư vấn trực tuyến</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary-200">Liên hệ</h3>
            <div className="space-y-3">
              <p className="flex items-center text-gray-300 text-sm">
                <Phone size={18} className="mr-2 text-primary-400" />
                <span>0123-456-789</span>
              </p>
              <p className="flex items-center text-gray-300 text-sm">
                <Mail size={18} className="mr-2 text-primary-400" />
                <span>contact@hivcare.com.vn</span>
              </p>
              <p className="flex items-center text-gray-300 text-sm">
                <MapPin size={18} className="mr-2 text-primary-400" />
                <span>123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh</span>
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-10 border-t border-primary-700 pt-6 text-center text-gray-400 text-xs">
          © {new Date().getFullYear()} HIV Care. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;