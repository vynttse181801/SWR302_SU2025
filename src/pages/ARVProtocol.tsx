import React from 'react';
import { Clock, AlertCircle, Activity, Heart } from 'lucide-react';

const ARVProtocol = () => {
  const firstLineRegimens = {
    preferred: [
      {
        combination: "TDF + 3TC + DTG",
        note: "Phác đồ ưu tiên hàng đầu – hiệu quả cao, ít tác dụng phụ, liều 1 lần/ngày"
      },
      {
        combination: "TDF + FTC + DTG",
        note: "Có thể thay thế 3TC bằng FTC (emtricitabine – tương đương 3TC)"
      }
    ],
    alternative: [
      {
        combination: "TDF + 3TC + EFV",
        note: "Dễ tiếp cận hơn, nhưng nhiều tác dụng phụ thần kinh hơn DTG"
      },
      {
        combination: "AZT + 3TC + EFV",
        note: "Dùng khi không dung nạp TDF hoặc có suy thận"
      },
      {
        combination: "TDF + 3TC + NVP",
        note: "Ít dùng hơn, chỉ thay thế khi EFV chống chỉ định"
      }
    ]
  };

  const secondLineRegimens = [
    {
      combination: "AZT + 3TC + ATV/r",
      note: "Bậc 1 là TDF + 3TC + DTG hoặc EFV"
    },
    {
      combination: "TDF + 3TC + LPV/r",
      note: "Bậc 1 là AZT + 3TC + EFV"
    },
    {
      combination: "AZT + 3TC + LPV/r",
      note: "Phổ biến khi có thất bại NNRTI"
    },
    {
      combination: "TDF + 3TC + ATV/r",
      note: "Nếu AZT không dung nạp hoặc thiếu nguồn cung"
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
            {/* Phác đồ bậc 1 */}
            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-bold mb-6">💊 PHÁC ĐỒ ARV BẬC 1 (First-line Regimens)</h2>
              
              {/* Phác đồ ưu tiên */}
              <div className="mb-8">
                <h3 className="font-semibold text-lg mb-4">✅ Phác đồ ưu tiên (dành cho người lớn & trẻ vị thành niên ≥ 10 tuổi hoặc ≥ 30kg)</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left">STT</th>
                        <th className="px-4 py-2 text-left">Thành phần phác đồ</th>
                        <th className="px-4 py-2 text-left">Ghi chú</th>
                      </tr>
                    </thead>
                    <tbody>
                      {firstLineRegimens.preferred.map((regimen, index) => (
                        <tr key={index} className="border-b">
                          <td className="px-4 py-2">{index + 1}</td>
                          <td className="px-4 py-2 font-medium">{regimen.combination}</td>
                          <td className="px-4 py-2 text-gray-600">{regimen.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  <p>TDF: Tenofovir Disoproxil Fumarate</p>
                  <p>3TC: Lamivudine</p>
                  <p>DTG: Dolutegravir</p>
                </div>
              </div>

              {/* Phác đồ thay thế */}
              <div>
                <h3 className="font-semibold text-lg mb-4">🔄 Phác đồ thay thế (dùng khi không có DTG hoặc có chống chỉ định)</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left">STT</th>
                        <th className="px-4 py-2 text-left">Thành phần phác đồ</th>
                        <th className="px-4 py-2 text-left">Ghi chú</th>
                      </tr>
                    </thead>
                    <tbody>
                      {firstLineRegimens.alternative.map((regimen, index) => (
                        <tr key={index} className="border-b">
                          <td className="px-4 py-2">{index + 1}</td>
                          <td className="px-4 py-2 font-medium">{regimen.combination}</td>
                          <td className="px-4 py-2 text-gray-600">{regimen.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  <p>EFV: Efavirenz</p>
                  <p>AZT: Zidovudine</p>
                  <p>NVP: Nevirapine</p>
                </div>
              </div>
            </div>

            {/* Phác đồ bậc 2 */}
            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-bold mb-6">💊 PHÁC ĐỒ ARV BẬC 2 (Second-line Regimens)</h2>
              <p className="text-gray-600 mb-4">
                Áp dụng khi phác đồ bậc 1 thất bại (tải lượng HIV &gt; 1000 copies/mL 2 lần liên tiếp sau ít nhất 6 tháng điều trị kèm hỗ trợ tuân thủ đầy đủ).
              </p>

              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2">✅ Nguyên tắc xây dựng</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Thay đổi toàn bộ nhóm thuốc NNRTI hoặc PI.</li>
                  <li>Không sử dụng lại thuốc thất bại.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-4">🧩 Phác đồ bậc 2 phổ biến</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left">STT</th>
                        <th className="px-4 py-2 text-left">Thành phần phác đồ</th>
                        <th className="px-4 py-2 text-left">Dùng khi phác đồ bậc 1 là...</th>
                      </tr>
                    </thead>
                    <tbody>
                      {secondLineRegimens.map((regimen, index) => (
                        <tr key={index} className="border-b">
                          <td className="px-4 py-2">{index + 1}</td>
                          <td className="px-4 py-2 font-medium">{regimen.combination}</td>
                          <td className="px-4 py-2 text-gray-600">{regimen.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  <p>ATV/r: Atazanavir/ritonavir</p>
                  <p>LPV/r: Lopinavir/ritonavir</p>
                </div>
              </div>
            </div>

            {/* Phác đồ đặc biệt */}
            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-bold mb-6">👶 Phác đồ đặc biệt</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Trẻ em &lt; 10 tuổi hoặc &lt; 30kg</h3>
                  <p className="text-gray-600">Có phác đồ riêng theo cân nặng.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Phụ nữ mang thai</h3>
                  <p className="text-gray-600">Ưu tiên TDF + 3TC + DTG nếu có thể (DTG an toàn từ tuần 8 thai kỳ).</p>
                </div>
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
            <div className="text-center">
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
