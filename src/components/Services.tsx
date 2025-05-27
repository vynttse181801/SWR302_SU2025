import React from 'react';
import { Link } from 'react-router-dom';
import { images } from '../constants/images';

type Service = {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
  gradient: string;
};

const services: Service[] = [
  {
    id: 1,
    title: "Đặt lịch khám",
    description: "Đặt lịch khám với bác sĩ chuyên khoa HIV theo thời gian phù hợp với bạn",
    image: images.doctorTeam,
    link: "/appointment",
    gradient: "from-primary-400 to-secondary-400"
  },
  {
    id: 2,
    title: "Xét nghiệm HIV",
    description: "Xét nghiệm HIV nhanh chóng, chính xác và hoàn toàn bảo mật",
    image: images.laboratory,
    link: "/test-booking",
    gradient: "from-secondary-400 to-accent-400"
  },
  {
    id: 3,
    title: "Tư vấn trực tuyến",
    description: "Trao đổi trực tiếp với bác sĩ chuyên khoa qua video call hoặc chat",
    image: images.consultation,
    link: "/consultation",
    gradient: "from-accent-400 to-primary-400"
  }
];

const Services: React.FC = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-heading">
            Dịch vụ của chúng tôi
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Cung cấp các dịch vụ chăm sóc sức khỏe toàn diện, từ tư vấn đến điều trị
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <Link 
              key={service.id} 
              to={service.link}
              className="group relative block"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
              <div className="relative h-full bg-white rounded-xl overflow-hidden shadow-lg transition-transform duration-300 group-hover:-translate-y-1">
                <div className="relative h-48 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} mix-blend-multiply opacity-90`}></div>
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {service.description}
                  </p>
                  <span className="inline-flex items-center text-primary-600 font-medium group-hover:text-primary-700">
                    Tìm hiểu thêm
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
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