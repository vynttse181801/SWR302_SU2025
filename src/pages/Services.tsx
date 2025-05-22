import React from 'react';
import { Calendar, Activity, Pill as Pills, MessageCircle, Users, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServiceDetails = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Dịch vụ của chúng tôi
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Chúng tôi cung cấp các dịch vụ chăm sóc sức khỏe HIV toàn diện, từ tư vấn đến điều trị và theo dõi
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/booking" className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-900 transition-colors inline-block">
              Đặt lịch khám ngay
            </Link>
            <Link to="/booking" className="px-6 py-3 bg-white text-black border border-black rounded-md hover:bg-gray-50 transition-colors">
              Tư vấn trực tuyến
            </Link>
          </div>
        </div>
      </section>

      {/* Appointment Booking Section */}
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
                    <h3 className="font-semibold text-black">Chọ thời gian phù hợp</h3>
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

      {/* Test Results Section */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="md:w-1/2">
              <div className="inline-block bg-gray-100 text-black px-4 py-2 rounded-full text-sm font-medium mb-4">
                Kết quả xét nghiệm
              </div>
              <h2 className="text-2xl font-bold text-black mb-4">
                Truy cập kết quả xét nghiệm CD4 và tải lượng HIV
              </h2>
              <p className="text-gray-600 mb-6">
                Xem kết quả xét nghiệm trực tuyến, theo dõi tiến trình điều trị và tư vấn từ bác sĩ
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Activity className="w-6 h-6 text-black mt-1" />
                  <div>
                    <h3 className="font-semibold text-black">Kết quả xét nghiệm trực tuyến</h3>
                    <p className="text-sm text-gray-600">Truy cập kết quả CD4 và tải lượng HIV từ mọi nơi, mọi thời điểm</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="w-6 h-6 text-black mt-1" />
                  <div>
                    <h3 className="font-semibold text-black">Lịch sử xét nghiệm</h3>
                    <p className="text-sm text-gray-600">Theo dõi lịch sử xét nghiệm và tiến trình điều trị của bạn</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-6 h-6 text-black mt-1" />
                  <div>
                    <h3 className="font-semibold text-black">Trao đổi với bác sĩ</h3>
                    <p className="text-sm text-gray-600">Trao đổi trực tiếp với bác sĩ về kết quả xét nghiệm của bạn</p>
                  </div>
                </div>
              </div>
              <button className="mt-8 px-6 py-3 bg-black text-white rounded-md hover:bg-gray-900 transition-colors">
                Xem kết quả xét nghiệm
              </button>
            </div>
            <div className="md:w-1/2">
              <div className="bg-gray-100 h-96 rounded-lg border border-gray-200"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Medication Management Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <div className="inline-block bg-gray-100 text-black px-4 py-2 rounded-full text-sm font-medium mb-4">
                Quản lý thuốc ARV
              </div>
              <h2 className="text-2xl font-bold text-black mb-4">
                Theo dõi lịch uống thuốc và nhận nhắc nhở
              </h2>
              <p className="text-gray-600 mb-6">
                Quản lý việc uống thuốc ARV, giúp bạn tuân thủ điều trị và theo dõi hiệu quả
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Pills className="w-6 h-6 text-black mt-1" />
                  <div>
                    <h3 className="font-semibold text-black">Lịch uống thuốc</h3>
                    <p className="text-sm text-gray-600">Theo dõi lịch uống thuốc hàng ngày và nhận thông báo nhắc nhở</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Activity className="w-6 h-6 text-black mt-1" />
                  <div>
                    <h3 className="font-semibold text-black">Theo dõi hiệu quả điều trị</h3>
                    <p className="text-sm text-gray-600">Ghi chép và theo dõi các tác dụng phụ và hiệu quả điều trị</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-6 h-6 text-black mt-1" />
                  <div>
                    <h3 className="font-semibold text-black">Hỗ trợ từ chuyên gia</h3>
                    <p className="text-sm text-gray-600">Được tư vấn về cách sử dụng thuốc và xử lý tác dụng phụ</p>
                  </div>
                </div>
              </div>
              <Link to="/booking" className="mt-8 px-6 py-3 bg-black text-white rounded-md hover:bg-gray-900 transition-colors">
                Quản lý thuốc ngay
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
            Bắt đầu hành trình chăm sóc sức khỏe của bạn
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">
            Thay đổi cách quản lý sức khỏe từ ngày hôm nay để bắt đầu nghiệm hệ thống quản lý và chăm sóc sức khỏe HIV toàn diện
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/booking" className="px-6 py-3 bg-white text-black rounded-md hover:bg-gray-100 transition-colors">
              Đặt lịch khám
            </Link>
            <Link to="/booking" className="px-6 py-3 bg-white text-black rounded-md hover:bg-gray-100 transition-colors">
              Tư vấn trực tuyến
            </Link>
            <Link to="/booking" className="px-6 py-3 bg-white text-black rounded-md hover:bg-gray-100 transition-colors">
              Tư vấn tận nơi
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetails;