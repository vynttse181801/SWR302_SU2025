import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const features = [
  {
    id: 1,
    title: "Cổng thông tin bệnh nhân",
    description: "Quản lý thông tin cá nhân và lịch sử điều trị của bạn"
  },
  {
    id: 2,
    title: "Quản lý thuốc ARV",
    description: "Theo dõi lịch uống thuốc và nhận thông báo nhắc nhở"
  },
  {
    id: 3,
    title: "Kết quả xét nghiệm",
    description: "Xem kết quả xét nghiệm định kỳ và theo dõi sức khỏe"
  },
  {
    id: 4,
    title: "Tư vấn trực tuyến",
    description: "Kết nối với bác sĩ và chuyên gia y tế qua video call"
  }
];

const SystemAccess: React.FC = () => {
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
            Truy cập hệ thống
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Chọn vai trò của bạn để có thể cập nhật thông tin sức khỏe HIV hiệu quả
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-lg mb-2 text-center">Đăng ký nhận thông tin</h3>
            <div className="space-y-4 mt-4">
              {features.slice(0, 2).map((feature) => (
                <div key={feature.id} className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-black mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-lg mb-2 text-center">Điều trị</h3>
            <div className="space-y-4 mt-4">
              {features.slice(1, 3).map((feature) => (
                <div key={feature.id} className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-lg mb-2 text-center">Quản lý sức khỏe</h3>
            <div className="space-y-4 mt-4">
              {features.slice(2, 4).map((feature) => (
                <div key={feature.id} className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
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

export default SystemAccess;