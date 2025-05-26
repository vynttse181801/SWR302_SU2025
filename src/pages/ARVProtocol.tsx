import React from 'react';
import { Clock, AlertCircle, Activity, Heart } from 'lucide-react';

const ARVProtocol = () => {
  const protocols = [
    {
      type: "Phác đồ bậc 1",
      combinations: [
        "TLD (Tenofovir + Lamivudine + Dolutegravir)",
        "TLE (Tenofovir + Lamivudine + Efavirenz)"
      ],
      notes: "Đây là phác đồ ưu tiên cho người bệnh mới bắt đầu điều trị"
    },
    {
      type: "Phác đồ bậc 2",
      combinations: [
        "ATV/r (Atazanavir/ritonavir) + 2 NRTI",
        "LPV/r (Lopinavir/ritonavir) + 2 NRTI"
      ],
      notes: "Áp dụng khi phác đồ bậc 1 thất bại"
    }
  ];

  const guidelines = [
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Thời điểm uống thuốc",
      content: "Uống thuốc đúng giờ mỗi ngày, cách nhau 24 giờ"
    },
    {
      icon: <AlertCircle className="w-6 h-6" />,
      title: "Tuân thủ điều trị",
      content: "Không được bỏ liều, uống đủ thuốc theo chỉ định"
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: "Theo dõi tác dụng phụ",
      content: "Ghi nhận và báo cáo các tác dụng phụ với bác sĩ"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Chế độ sinh hoạt",
      content: "Duy trì lối sống lành mạnh, tránh rượu bia"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Phác đồ điều trị ARV
            </h1>
            <p className="text-gray-600">
              Thông tin về phác đồ điều trị ARV và hướng dẫn sử dụng thuốc
            </p>
          </div>

          <div className="space-y-8">
            {/* Các phác đồ điều trị */}
            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-bold mb-6">Phác đồ điều trị</h2>
              <div className="space-y-6">
                {protocols.map((protocol, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                    <h3 className="font-semibold text-lg mb-3">{protocol.type}</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 mb-3">
                      {protocol.combinations.map((combo, idx) => (
                        <li key={idx}>{combo}</li>
                      ))}
                    </ul>
                    <p className="text-sm text-gray-500">{protocol.notes}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hướng dẫn sử dụng */}
            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-bold mb-6">Hướng dẫn sử dụng thuốc</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {guidelines.map((guide, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="text-black">
                      {guide.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{guide.title}</h3>
                      <p className="text-gray-600 text-sm">{guide.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lưu ý quan trọng */}
            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-6">
              <div className="flex gap-3">
                <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-yellow-800 mb-2">Lưu ý quan trọng</h3>
                  <ul className="list-disc list-inside space-y-2 text-yellow-700 text-sm">
                    <li>Không tự ý thay đổi phác đồ điều trị khi chưa có chỉ định của bác sĩ</li>
                    <li>Thông báo ngay cho bác sĩ khi có các phản ứng bất thường</li>
                    <li>Tái khám định kỳ để được theo dõi và điều chỉnh phác đồ phù hợp</li>
                    <li>Luôn mang theo thẻ điều trị ARV khi đi khám</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Thông tin liên hệ */}
            <div className="bg-gray-100 rounded-lg p-6 text-center">
              <p className="text-gray-600 text-sm">
                Nếu bạn có bất kỳ thắc mắc nào về phác đồ điều trị, vui lòng liên hệ:
                <br />
                Hotline: <span className="font-semibold">1800 1234</span>
                <br />
                Email: <span className="font-semibold">support@hivcare.vn</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARVProtocol;
