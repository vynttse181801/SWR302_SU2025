import React from 'react';
import { CheckCircle2, Shield, Clock, Activity, UserCheck, Users } from 'lucide-react';
import { images } from '../constants/images';

const benefits = [
  {
    id: 1,
    title: "Bảo mật và riêng tư",
    description: "Chúng tôi đảm bảo thông tin và dữ liệu của bạn được bảo mật tuyệt đối và chỉ được tiếp cận bởi người có quyền.",    icon: <Shield className="w-8 h-8 text-blue-600" />
  },
  {
    id: 2,
    title: "Tiện nghi và dễ sử dụng",
    description: "Giao diện thân thiện, dễ sử dụng giúp bạn dễ dàng theo dõi sức khỏe của mình.",
    icon: <UserCheck className="w-8 h-8 text-purple-600" />
  },
  {
    id: 3,
    title: "Đổi ngày kết quả xét nghiệm",
    description: "Dễ dàng theo dõi kết quả xét nghiệm, cập nhật thông tin sức khỏe và lịch hẹn tái khám.",    icon: <Clock className="w-8 h-8 text-green-600" />
  },
  {
    id: 4,
    title: "Theo dõi sức khỏe toàn diện",
    description: "Hệ thống giúp theo dõi toàn diện sức khỏe của bạn, dự đoán và cảnh báo những thay đổi về sức khỏe trước khi trở nên nghiêm trọng.",
    icon: <Activity className="w-8 h-8 text-red-600" />
  },
  {
    id: 5,
    title: "Cộng đồng hỗ trợ",
    description: "Kết nối với cộng đồng người cùng hoàn cảnh để chia sẻ kinh nghiệm và hỗ trợ tinh thần.",    icon: <Users className="w-8 h-8 text-indigo-600" />
  }
];

const Benefits: React.FC = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left side - Image */}
          <div className="lg:w-1/2">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-2xl blur opacity-75"></div>
              <div className="relative">
                <img
                  src={images.consultation}
                  alt="Tư vấn sức khỏe"
                  className="rounded-xl shadow-xl w-full object-cover aspect-[4/3]"
                />
                {/* Stats card */}
                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-lg shadow-xl">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-600">24/7</div>
                      <div className="text-sm text-gray-600">Hỗ trợ</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary-600">100%</div>
                      <div className="text-sm text-gray-600">Bảo mật</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Benefits list */}
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-heading">
              Tối ưu hóa việc quản lý sức khỏe
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Hệ thống quản lý và chăm sóc sức khỏe HIV của chúng tôi mang đến nhiều lợi ích thiết thực
            </p>
            
            <div className="grid gap-6">
              {benefits.map((benefit) => (
                <div 
                  key={benefit.id} 
                  className="group relative"
                >
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative flex items-start p-4 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-primary-100 to-secondary-100 mr-4">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-900">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;