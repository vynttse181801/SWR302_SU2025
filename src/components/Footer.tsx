import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">HIV Care</h3>
            <p className="text-gray-300 text-sm">
              Hệ thống quản lý và chăm sóc sức khỏe HIV toàn diện, hỗ trợ bạn trong suốt quá trình điều trị.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white text-sm">Trang chủ</Link></li>
              <li><Link to="/services" className="text-gray-400 hover:text-white text-sm">Dịch vụ</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white text-sm">Về chúng tôi</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white text-sm">Liên hệ</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Dịch vụ</h3>
            <ul className="space-y-2">
              <li><Link to="/appointment" className="text-gray-400 hover:text-white text-sm">Đặt lịch khám</Link></li>
              <li><Link to="/test-results" className="text-gray-400 hover:text-white text-sm">Kết quả xét nghiệm</Link></li>
              <li><Link to="/medication" className="text-gray-400 hover:text-white text-sm">Quản lý thuốc ARV</Link></li>
              <li><Link to="/consultation" className="text-gray-400 hover:text-white text-sm">Tư vấn trực tuyến</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
            <div className="space-y-3">
              <p className="flex items-center text-gray-400 text-sm">
                <Phone size={16} className="mr-2" />
                <span>0123-456-789</span>
              </p>
              <p className="flex items-center text-gray-400 text-sm">
                <Mail size={16} className="mr-2" />
                <span>contact@hivcare.com.vn</span>
              </p>
              <p className="flex items-center text-gray-400 text-sm">
                <MapPin size={16} className="mr-2" />
                <span>123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh</span>
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 HIV Care. Tất cả quyền được bảo lưu. &nbsp; | &nbsp;
            <Link to="/register" className="hover:text-white">Đăng ký ngay</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;