import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Calendar, Microscope, Video } from 'lucide-react';
import { images } from '../constants/images';

type Service = {
  id: number;
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
  features: string[];
  link: string;
  gradient: string;
};

const services: Service[] = [
  {
    id: 1,
    title: "Đặt lịch khám",
    description: "Đặt lịch khám với bác sĩ chuyên khoa HIV theo thời gian phù hợp với bạn",
    image: images.doctorTeam,
    icon: <Calendar className="w-6 h-6" />,
    features: ["Linh hoạt thời gian", "Bác sĩ chuyên khoa", "Nhắc nhở tự động"],
    link: "/test-booking",
    gradient: "from-primary-400 to-secondary-400"
  },
  {
    id: 2,
    title: "Xét nghiệm HIV",
    description: "Xét nghiệm HIV nhanh chóng, chính xác và hoàn toàn bảo mật",
    image: images.laboratory,
    icon: <Microscope className="w-6 h-6" />,
    features: ["Kết quả nhanh chóng", "Bảo mật thông tin", "Tư vấn sau xét nghiệm"],
    link: "/test-booking",
    gradient: "from-secondary-400 to-accent-400"
  },
  {
    id: 3,
    title: "Tư vấn trực tuyến",
    description: "Trao đổi trực tiếp với bác sĩ chuyên khoa qua video call hoặc chat",
    image: images.consultation,
    icon: <Video className="w-6 h-6" />,
    features: ["Video call bảo mật", "Chat 24/7", "Lưu trữ hồ sơ"],
    link: "/consultation",
    gradient: "from-accent-400 to-primary-400"
  }
];

const Services: React.FC = () => {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-primary-100 rounded-full mix-blend-multiply blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-secondary-100 rounded-full mix-blend-multiply blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-primary-50 rounded-full mb-6">
            <p className="text-sm text-primary-600 font-medium">
              Dịch vụ toàn diện
            </p>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
              Các dịch vụ của chúng tôi
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Cung cấp các dịch vụ chăm sóc sức khỏe toàn diện, từ tư vấn đến điều trị
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Link 
              key={service.id} 
              to={service.link}
              className="group relative block animate-fade-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
              <div className="relative h-full bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
                <div className="relative h-48 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} mix-blend-multiply opacity-90`}></div>
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                    {service.icon}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {service.description}
                  </p>

                  {/* Features list */}
                  <ul className="space-y-2 mb-4">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center text-primary-600 font-medium group-hover:text-primary-700">
                    <span className="mr-2">Tìm hiểu thêm</span>
                    <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;