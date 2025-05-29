import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Microscope, Pill, Monitor, Bell, Clock, ArrowRight } from 'lucide-react';

const ServicesPage = () => {
  const services = [
    {
      id: 1,
      icon: <Monitor className="w-12 h-12" />,
      title: "Tư vấn trực tuyến",
      description: "Kết nối với bác sĩ và chuyên gia y tế qua video call và tin nhắn",
      additionalText: ["Chat 24/7", "Video call bảo mật", "Hồ sơ điện tử"],
      link: "/consultation",
      gradient: "from-primary-500 to-secondary-500"
    },
    {
      id: 2,
      icon: <Calendar className="w-12 h-12" />,
      title: "Đặt lịch khám & xét nghiệm",
      description: "Đặt lịch khám và xét nghiệm HIV theo thời gian phù hợp với bạn",
      additionalText: ["Xét nghiệm nhanh", "Kết quả bảo mật", "Tư vấn miễn phí"],
      link: "/test-booking",
      gradient: "from-secondary-500 to-accent-500"
    },
    {
      id: 3,
      icon: <Bell className="w-12 h-12" />,
      title: "Nhắc nhở lịch khám",
      description: "Hệ thống nhắc nhở thông minh giúp bạn không bỏ lỡ các buổi khám định kỳ",
      additionalText: ["Nhắc nhở qua SMS", "Thông báo trước 24h", "Lịch tái khám"],
      link: "/consultation",
      gradient: "from-accent-500 to-primary-500"
    },
    {
      id: 4,
      icon: <Microscope className="w-12 h-12" />,
      title: "Đặt lịch xét nghiệm",
      description: "Đặt lịch xét nghiệm HIV theo thời gian phù hợp với bạn",
      additionalText: ["Xét nghiệm định kỳ", "Xét nghiệm nhanh", "Bảo mật cao"],
      link: "/test-booking",
      gradient: "from-primary-500 to-secondary-500"
    },
    {
      id: 5,
      icon: <Pill className="w-12 h-12" />,
      title: "Quản lý thuốc ARV",
      description: "Tìm hiểu về phác đồ ARV, lưu ý khi sử dụng và cách quản lý thuốc hiệu quả",
      additionalText: ["Hướng dẫn sử dụng", "Theo dõi tác dụng phụ", "Tư vấn điều trị"],
      link: "/arv-protocol",
      gradient: "from-secondary-500 to-accent-500"
    },
    {
      id: 6,
      icon: <Clock className="w-12 h-12" />,
      title: "Nhắc nhở uống thuốc",
      description: "Hệ thống nhắc nhở thông minh giúp bạn uống thuốc đúng giờ và không bỏ liều",
      additionalText: ["Nhắc nhở theo giờ", "Ghi chép liều dùng", "Báo cáo tuân thủ"],
      link: "/consultation",
      gradient: "from-accent-500 to-primary-500"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary-50 to-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
            Dịch vụ của chúng tôi
          </h1>
          <p className="text-center text-primary-700 text-lg mb-12 max-w-3xl mx-auto leading-relaxed">
            Chúng tôi cung cấp các dịch vụ chăm sóc sức khỏe HIV toàn diện, 
            từ tư vấn đến điều trị và theo dõi sức khỏe.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-8">
            {services.map((service) => (
              <div key={service.id} className="group">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                  <div className="relative bg-white p-6 md:p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      {/* Icon with gradient background */}
                      <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${service.gradient} flex items-center justify-center text-white flex-shrink-0 shadow-md`}>
                        {React.cloneElement(service.icon, { className: "w-8 h-8" })}
                      </div>

                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-3 text-primary-700 group-hover:text-primary-600 transition-colors">{service.title}</h3>
                        <p className="text-primary-700 mb-4">{service.description}</p>

                        {/* Features list */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                          {service.additionalText.map((text, index) => (
                            <div key={index} className="flex items-center text-sm text-secondary-600">
                              <div className="w-1.5 h-1.5 rounded-full bg-secondary-500 mr-2"></div>
                              {text}
                            </div>
                          ))}
                        </div>

                        {/* Call to action */}
                        <Link
                          to={service.link}
                          className="inline-flex items-center text-secondary-600 font-medium hover:text-secondary-700 transition-colors group"
                        >
                          Tìm hiểu thêm
                          <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;