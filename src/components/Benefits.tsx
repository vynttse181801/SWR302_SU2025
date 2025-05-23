import React from 'react';
import { CheckCircle2, Shield, Clock, Activity, UserCheck, Users } from 'lucide-react';

const benefits = [
  {
    id: 1,
    title: "Bảo mật và riêng tư",
    description: "Chúng tôi đảm bảo thông tin và dữ liệu của bạn được bảo mật tuyệt đối và chỉ được tiếp cận bởi người có quyền.",
    icon: <Shield className="w-8 h-8 text-black" />
  },
  {
    id: 2,
    title: "Tiện nghi và dễ sử dụng",
    description: "Giao diện thân thiện, dễ sử dụng giúp bạn dễ dàng theo dõi sức khỏe của mình.",
    icon: <UserCheck className="w-8 h-8 text-primary-600" />
  },
  {
    id: 3,
    title: "Đổi ngày kết quả xét nghiệm",
    description: "Dễ dàng theo dõi kết quả xét nghiệm, cập nhật thông tin sức khỏe và lịch hẹn tái khám.",
    icon: <Clock className="w-8 h-8 text-primary-600" />
  },
  {
    id: 4,
    title: "Theo dõi sức khỏe toàn diện",
    description: "Hệ thống giúp theo dõi toàn diện sức khỏe của bạn, dự đoán và cảnh báo những thay đổi về sức khỏe trước khi trở nên nghiêm trọng.",
    icon: <Activity className="w-8 h-8 text-primary-600" />
  },
  {
    id: 5,
    title: "Cộng đồng hỗ trợ",
    description: "Kết nối với cộng đồng người cùng hoàn cảnh để chia sẻ kinh nghiệm và hỗ trợ tinh thần.",
    icon: <Users className="w-8 h-8 text-primary-600" />
  }
];

const Benefits: React.FC = () => {
  return (
    <section className="py-12 md:py-20 bg-white border-t border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
            Lợi ích của hệ thống
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Tối ưu hóa việc quản lý sức khỏe hệ thống quản lý và chăm sóc sức khỏe HIV của chúng tôi
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit) => (
            <div key={benefit.id} className="flex items-start">
              <div className="mr-4 mt-1">
                {benefit.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-black">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;