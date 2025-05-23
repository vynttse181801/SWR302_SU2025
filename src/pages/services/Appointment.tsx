import React from 'react';
import { Calendar, Activity, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const AppointmentPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Đặt lịch khám
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Đặt lịch khám với bác sĩ chuyên khoa HIV theo thời gian phù hợp với bạn
          </p>
          <Link 
            to="/booking"
            className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-900 transition-colors inline-block"
          >
            Đặt lịch khám ngay
          </Link>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-2xl font-bold text-black mb-4">
                Đặt lịch khám với bác sĩ chuyên khoa HIV
              </h2>
              <p className="text-gray-600 mb-6">
                Hệ thống đặt lịch trực tuyến giúp bạn tìm kiếm thời gian và cơ sở phù hợp
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-6 h-6 text-black mt-1" />
                  <div>
                    <h3 className="font-semibold text-black">Chọn thời gian phù hợp</h3>
                    <p className="text-sm text-gray-600">Linh hoạt chọn thời gian khám phù hợp với lịch trình của bạn</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Activity className="w-6 h-6 text-black mt-1" />
                  <div>
                    <h3 className="font-semibold text-black">Nhận kết quả nhanh chóng</h3>
                    <p className="text-sm text-gray-600">Kết quả khám và xét nghiệm được cập nhật trực tuyến</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-6 h-6 text-black mt-1" />
                  <div>
                    <h3 className="font-semibold text-black">Trao đổi với bác sĩ</h3>
                    <p className="text-sm text-gray-600">Trao đổi trực tiếp với bác sĩ về tình trạng sức khỏe của bạn</p>
                  </div>
                </div>
              </div>
              <Link to="/booking" className="mt-8 px-6 py-3 bg-black text-white rounded-md hover:bg-gray-900 transition-colors inline-block">
                Đặt lịch khám ngay
              </Link>
            </div>
            <div className="md:w-1/2">
              <div className="bg-gray-100 h-96 rounded-lg border border-gray-200"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Sẵn sàng đặt lịch khám?
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">
            Đặt lịch khám ngay hôm nay để được tư vấn và chăm sóc bởi đội ngũ bác sĩ chuyên môn cao
          </p>
          <Link 
            to="/booking"
            className="px-6 py-3 bg-white text-black rounded-md hover:bg-gray-100 transition-colors"
          >
            Đặt lịch khám ngay
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AppointmentPage; 