import React from 'react';
import { Link } from 'react-router-dom';

type Service = {
  id: number;
  title: string;
  description: string;
  icon: JSX.Element;
};

// Note: This is a simplified version using div elements instead of actual SVG icons
// In a real implementation, you would use proper SVG icons or import from a library
const services: Service[] = [
  {
    id: 1,
    title: "Đặt lịch khám",
    description: "Đặt lịch khám với bác sĩ chuyên khoa HIV theo thời gian phù hợp với bạn",
    icon: <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg text-black">📅</div>
  },
  {
    id: 2,
    title: "Kết quả xét nghiệm",
    description: "Xem kết quả xét nghiệm định kỳ, theo dõi các chỉ số sức khỏe quan trọng",
    icon: <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg text-black">🔬</div>
  },
  {
    id: 3,
    title: "Quản lý thuốc ARV",
    description: "Theo dõi lịch uống thuốc, nhận thông báo nhắc nhở và quản lý thuốc hiệu quả",
    icon: <div className="w-12 h-12 flex items-center justify-center bg-primary-100 rounded-lg text-primary-600">💊</div>
  },
  {
    id: 4,
    title: "Tư vấn trực tuyến",
    description: "Kết nối với bác sĩ và chuyên gia y tế qua video call và tin nhắn",
    icon: <div className="w-12 h-12 flex items-center justify-center bg-primary-100 rounded-lg text-primary-600">🖥️</div>
  },
  {
    id: 5,
    title: "Tư vấn tận nơi",
    description: "Dịch vụ tư vấn tận nhà dành cho bệnh nhân cần hỗ trợ đặc biệt và không thể di chuyển",
    icon: <div className="w-12 h-12 flex items-center justify-center bg-primary-100 rounded-lg text-primary-600">🏠</div>
  },
  {
    id: 6,
    title: "Hồ sơ cá nhân",
    description: "Hồ sơ y tế điện tử giúp theo dõi lịch sử và tiến trình điều trị của bạn",
    icon: <div className="w-12 h-12 flex items-center justify-center bg-primary-100 rounded-lg text-primary-600">📁</div>
  }
];

const Services: React.FC = () => {
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Dịch vụ của chúng tôi
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Chúng tôi cung cấp các dịch vụ chăm sóc sức khỏe HIV toàn diện, từ tư vấn đến điều trị và theo dõi.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (          <div key={service.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4">{service.icon}</div>
              <h3 className="font-bold text-lg mb-2 text-black">{service.title}</h3>
              <p className="text-gray-600 text-sm">{service.description}</p>
              <Link 
                to={service.id === 1 ? "/booking" : `/dich-vu/${service.id}`} 
                className="mt-4 text-black hover:text-gray-700 text-sm font-medium"
              >
                Tìm hiểu thêm →
              </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
