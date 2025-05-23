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
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/services/appointment"
              className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-900 transition-colors"
            >
              Đặt lịch khám
            </Link>
            <Link 
              to="/services/test-results"
              className="px-6 py-3 bg-white text-black border border-black rounded-md hover:bg-gray-50 transition-colors"
            >
              Kết quả xét nghiệm
            </Link>
            <Link 
              to="/services/medication"
              className="px-6 py-3 bg-white text-black border border-black rounded-md hover:bg-gray-50 transition-colors"
            >
              Quản lý thuốc
            </Link>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Appointment Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  <Calendar className="w-12 h-12 text-black" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-black">Đặt lịch khám</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Đặt lịch khám với bác sĩ chuyên khoa HIV theo thời gian phù hợp với bạn
                </p>
                <Link 
                  to="/services/appointment"
                  className="text-black hover:text-gray-700 text-sm font-medium"
                >
                  Tìm hiểu thêm →
                </Link>
              </div>
            </div>

            {/* Test Results Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  <Activity className="w-12 h-12 text-black" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-black">Kết quả xét nghiệm</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Xem kết quả xét nghiệm định kỳ, theo dõi các chỉ số sức khỏe quan trọng
                </p>
                <Link 
                  to="/services/test-results"
                  className="text-black hover:text-gray-700 text-sm font-medium"
                >
                  Tìm hiểu thêm →
                </Link>
              </div>
            </div>

            {/* Medication Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  <Pills className="w-12 h-12 text-black" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-black">Quản lý thuốc ARV</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Theo dõi lịch uống thuốc, nhận thông báo nhắc nhở và quản lý thuốc hiệu quả
                </p>
                <Link 
                  to="/services/medication"
                  className="text-black hover:text-gray-700 text-sm font-medium"
                >
                  Tìm hiểu thêm →
                </Link>
              </div>
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
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/services/appointment"
              className="px-6 py-3 bg-white text-black rounded-md hover:bg-gray-100 transition-colors"
            >
              Đặt lịch khám
            </Link>
            <Link 
              to="/services/test-results"
              className="px-6 py-3 bg-white text-black rounded-md hover:bg-gray-100 transition-colors"
            >
              Xem kết quả xét nghiệm
            </Link>
            <Link 
              to="/services/medication"
              className="px-6 py-3 bg-white text-black rounded-md hover:bg-gray-100 transition-colors"
            >
              Quản lý thuốc
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetails;