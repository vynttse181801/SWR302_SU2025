import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Microscope, Pill, Monitor, Bell, Clock } from 'lucide-react';

const ServicesPage = () => {
  const services = [
    {
      id: 1,
      icon: <Monitor className="w-12 h-12" />,
      title: "Tư vấn trực tuyến",
      description: "Kết nối với bác sĩ và chuyên gia y tế qua video call và tin nhắn",
      additionalText: ["Chat 24/7", "Video call bảo mật", "Hồ sơ điện tử"],
      link: "/consultation"
    },
    {
      id: 2,      icon: <Calendar className="w-12 h-12" />,
      title: "Đặt lịch khám & xét nghiệm",
      description: "Đặt lịch khám và xét nghiệm HIV theo thời gian phù hợp với bạn",
      additionalText: ["Xét nghiệm nhanh", "Kết quả bảo mật", "Tư vấn miễn phí"],
      link: "/test-booking"
    },
    {
      id: 3,
      icon: <Bell className="w-12 h-12" />,
      title: "Nhắc nhở lịch khám",
      description: "Hệ thống nhắc nhở thông minh giúp bạn không bỏ lỡ các buổi khám định kỳ",
      additionalText: ["Nhắc nhở qua SMS", "Thông báo trước 24h", "Lịch tái khám"],
      link: "/consultation"
    },
    {
      id: 4,      icon: <Microscope className="w-12 h-12" />,
      title: "Đặt lịch xét nghiệm",
      description: "Đặt lịch xét nghiệm HIV theo thời gian phù hợp với bạn",
      additionalText: ["Xét nghiệm định kỳ", "Xét nghiệm nhanh", "Bảo mật cao"],
      link: "/test-booking"
    },
    {
      id: 5,      icon: <Pill className="w-12 h-12" />,
      title: "Quản lý thuốc ARV",
      description: "Tìm hiểu về phác đồ ARV, lưu ý khi sử dụng và cách quản lý thuốc hiệu quả",
      additionalText: ["Hướng dẫn sử dụng", "Theo dõi tác dụng phụ", "Tư vấn điều trị"],
      link: "/arv-protocol"
    },
    {
      id: 6,
      icon: <Clock className="w-12 h-12" />,
      title: "Nhắc nhở uống thuốc",
      description: "Hệ thống nhắc nhở thông minh giúp bạn uống thuốc đúng giờ và không bỏ liều",
      additionalText: ["Nhắc nhở theo giờ", "Ghi chép liều dùng", "Báo cáo tuân thủ"],
      link: "/consultation"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Dịch vụ của chúng tôi
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Chúng tôi cung cấp các dịch vụ chăm sóc sức khỏe HIV toàn diện, từ tư vấn đến điều trị và theo dõi.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {services.map((service) => (
            <Link
              key={service.id}
              to={service.link}
              className="block bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-start gap-6">
                <div className="shrink-0 text-gray-900">
                  {service.icon}
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {service.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {service.additionalText.map((text, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700"
                      >
                        {text}
                      </span>
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-900 hover:text-gray-700">
                    Tìm hiểu thêm →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;