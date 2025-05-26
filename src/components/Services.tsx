import React from 'react';
import { Link } from 'react-router-dom';

type Service = {
  id: number;
  title: string;
  description: string;
  icon: JSX.Element;
};

const services: Service[] = [
  {
    id: 1,
    title: "Đặt lịch khám",
    description: "Đặt lịch khám với bác sĩ chuyên khoa HIV theo thời gian phù hợp với bạn",
    icon: <div className="w-14 h-14 flex items-center justify-center bg-primary-100 rounded-xl text-primary-600 shadow-sm">📅</div>
  },
  {
    id: 2,
    title: "Kết quả xét nghiệm",
    description: "Xem kết quả xét nghiệm định kỳ, theo dõi các chỉ số sức khỏe quan trọng",
    icon: <div className="w-14 h-14 flex items-center justify-center bg-secondary-100 rounded-xl text-secondary-600 shadow-sm">🔬</div>
  },
  {
    id: 3,
    title: "Quản lý thuốc ARV",
    description: "Theo dõi lịch uống thuốc, nhận thông báo nhắc nhở và quản lý thuốc hiệu quả",
    icon: <div className="w-14 h-14 flex items-center justify-center bg-accent-100 rounded-xl text-accent-600 shadow-sm">💊</div>
  },
  {
    id: 4,
    title: "Tư vấn trực tuyến",
    description: "Kết nối với bác sĩ và chuyên gia y tế qua video call và tin nhắn",
    icon: <div className="w-14 h-14 flex items-center justify-center bg-primary-100 rounded-xl text-primary-600 shadow-sm">🖥️</div>
  },
  {
    id: 5,
    title: "Tư vấn tận nơi",
    description: "Dịch vụ tư vấn tận nhà dành cho bệnh nhân cần hỗ trợ đặc biệt và không thể di chuyển",
    icon: <div className="w-14 h-14 flex items-center justify-center bg-secondary-100 rounded-xl text-secondary-600 shadow-sm">🏠</div>
  },
  {
    id: 6,
    title: "Hồ sơ cá nhân",
    description: "Hồ sơ y tế điện tử giúp theo dõi lịch sử và tiến trình điều trị của bạn",
    icon: <div className="w-14 h-14 flex items-center justify-center bg-accent-100 rounded-xl text-accent-600 shadow-sm">📁</div>
  }
];

const Services: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-heading">
            Dịch vụ của chúng tôi
          </h2>
          <p className="text-gray-600 text-lg">
            Cung cấp các dịch vụ chăm sóc sức khỏe toàn diện, từ khám chữa bệnh đến tư vấn và hỗ trợ tâm lý
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div 
              key={service.id} 
              className="card hover:translate-y-[-4px]"
            >
              <div className="mb-6">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <Link 
                to={`/services/${service.id}`} 
                className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
              >
                Xem chi tiết
                <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.75 6.75L19.25 12L13.75 17.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19 12H4.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;