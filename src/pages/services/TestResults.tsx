import React from 'react';
import { Activity, FileText, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const TestResultsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Kết quả xét nghiệm
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Xem kết quả xét nghiệm trực tuyến, theo dõi tiến trình điều trị và tư vấn từ bác sĩ
          </p>
          <button className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-900 transition-colors">
            Xem kết quả xét nghiệm
          </button>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
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

      {/* Call to Action */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Theo dõi sức khỏe của bạn
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">
            Truy cập kết quả xét nghiệm và theo dõi tiến trình điều trị của bạn mọi lúc, mọi nơi
          </p>
          <button className="px-6 py-3 bg-white text-black rounded-md hover:bg-gray-100 transition-colors">
            Xem kết quả xét nghiệm
          </button>
        </div>
      </section>
    </div>
  );
};

export default TestResultsPage; 