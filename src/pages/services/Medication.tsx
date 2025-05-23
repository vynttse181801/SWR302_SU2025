import React from 'react';
import { Pill as Pills, Activity, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const MedicationPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Quản lý thuốc ARV
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Theo dõi lịch uống thuốc, nhận thông báo nhắc nhở và quản lý thuốc hiệu quả
          </p>
          <Link 
            to="/booking"
            className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-900 transition-colors inline-block"
          >
            Quản lý thuốc ngay
          </Link>
        </div>
      </section>

      {/* Main Content */}
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
            Bắt đầu quản lý thuốc ARV
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">
            Theo dõi lịch uống thuốc và nhận hỗ trợ từ đội ngũ chuyên gia của chúng tôi
          </p>
          <Link 
            to="/booking"
            className="px-6 py-3 bg-white text-black rounded-md hover:bg-gray-100 transition-colors"
          >
            Quản lý thuốc ngay
          </Link>
        </div>
      </section>
    </div>
  );
};

export default MedicationPage; 