import React from 'react';
import { CheckCircle2, Shield, Clock, Activity, UserCheck, Users } from 'lucide-react';
import { images } from '../constants/images';

const benefits = [
  {
    id: 1,
    title: "Bảo mật và riêng tư",
    description: "Chúng tôi đảm bảo thông tin và dữ liệu của bạn được bảo mật tuyệt đối và chỉ được tiếp cận bởi người có quyền.",    
    icon: <Shield className="w-8 h-8 text-primary-600" />,
    gradient: "from-primary-500/10 to-primary-500/20"
  },
  {
    id: 2,
    title: "Tiện nghi và dễ sử dụng",
    description: "Giao diện thân thiện, dễ sử dụng giúp bạn dễ dàng theo dõi sức khỏe của mình.",
    icon: <UserCheck className="w-8 h-8 text-secondary-600" />,
    gradient: "from-secondary-500/10 to-secondary-500/20"
  },
  {
    id: 3,
    title: "Đổi ngày kết quả xét nghiệm",
    description: "Dễ dàng theo dõi kết quả xét nghiệm, cập nhật thông tin sức khỏe và lịch hẹn tái khám.",    
    icon: <Clock className="w-8 h-8 text-accent-600" />,
    gradient: "from-accent-500/10 to-accent-500/20"
  },
  {
    id: 4,
    title: "Theo dõi sức khỏe toàn diện",
    description: "Hệ thống giúp theo dõi toàn diện sức khỏe của bạn, dự đoán và cảnh báo những thay đổi về sức khỏe trước khi trở nên nghiêm trọng.",
    icon: <Activity className="w-8 h-8 text-primary-600" />,
    gradient: "from-primary-500/10 to-primary-500/20"
  },
  {
    id: 5,
    title: "Cộng đồng hỗ trợ",
    description: "Kết nối với cộng đồng người cùng hoàn cảnh để chia sẻ kinh nghiệm và hỗ trợ tinh thần.",    
    icon: <Users className="w-8 h-8 text-secondary-600" />,
    gradient: "from-secondary-500/10 to-secondary-500/20"
  }
];

const Benefits: React.FC = () => {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary-100 rounded-full mix-blend-multiply blur-3xl opacity-70"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-secondary-100 rounded-full mix-blend-multiply blur-3xl opacity-70"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left side - Image */}
          <div className="lg:w-1/2">
            <div className="relative animate-fade-up">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-2xl blur opacity-75"></div>
              <div className="relative">
                <img
                  src={images.consultation}
                  alt="Tư vấn sức khỏe"
                  className="rounded-xl shadow-xl w-full object-cover aspect-[4/3] transform hover:scale-[1.02] transition-transform duration-300"
                />
                {/* Stats card */}
                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-lg shadow-xl animate-fade-up" style={{ animationDelay: '0.3s' }}>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                        24/7
                      </div>
                      <div className="text-sm text-gray-600 font-medium">Hỗ trợ</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-secondary-600 to-accent-600 bg-clip-text text-transparent">
                        100%
                      </div>
                      <div className="text-sm text-gray-600 font-medium">Bảo mật</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Benefits list */}
          <div className="lg:w-1/2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="inline-block px-4 py-2 bg-primary-50 rounded-full mb-6">
              <p className="text-sm text-primary-600 font-medium">
                Ưu điểm nổi bật
              </p>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
                Tối ưu hóa việc quản lý
              </span>{' '}
              <br />
              <span className="text-gray-900">sức khỏe của bạn</span>
            </h2>

            <p className="text-gray-600 mb-12 text-lg leading-relaxed">
              Hệ thống quản lý và chăm sóc sức khỏe HIV của chúng tôi mang đến nhiều lợi ích thiết thực
            </p>
            
            <div className="grid gap-6">
              {benefits.map((benefit, index) => (
                <div 
                  key={benefit.id} 
                  className="group relative animate-fade-up"
                  style={{ animationDelay: `${0.2 * (index + 1)}s` }}
                >
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative flex items-start p-4 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${benefit.gradient} mr-4`}>
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-900">{benefit.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
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