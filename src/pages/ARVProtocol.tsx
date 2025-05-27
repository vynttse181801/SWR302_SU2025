import React from 'react';
import { Clock, AlertCircle, Activity, Heart, Pill, RefreshCcw, Baby, AlertTriangle } from 'lucide-react';

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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-heading">
              Phác đồ điều trị ARV
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Thông tin chi tiết về phác đồ điều trị ARV và hướng dẫn sử dụng thuốc theo tiêu chuẩn mới nhất
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Phác đồ bậc 1 */}
          <div className="card group hover:border hover:border-primary-200">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
              <div className="relative bg-white p-8 rounded-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                    <Pill className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">PHÁC ĐỒ ARV BẬC 1</h2>
                </div>

                {/* Phác đồ ưu tiên */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-primary-700 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">✓</span>
                    Phác đồ ưu tiên
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 bg-gray-50 text-left text-sm font-semibold text-gray-900">STT</th>
                          <th className="px-6 py-3 bg-gray-50 text-left text-sm font-semibold text-gray-900">Thành phần phác đồ</th>
                          <th className="px-6 py-3 bg-gray-50 text-left text-sm font-semibold text-gray-900">Ghi chú</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {firstLineRegimens.preferred.map((regimen, index) => (
                          <tr key={index} className="group/row hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
                            <td className="px-6 py-4">
                              <span className="inline-flex rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-700">
                                {regimen.combination}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{regimen.note}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {['TDF: Tenofovir', '3TC: Lamivudine', 'DTG: Dolutegravir'].map((text, i) => (
                      <div key={i} className="text-sm px-3 py-2 rounded-lg bg-gray-50 text-gray-600">
                        {text}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Phác đồ thay thế */}
                <div>
                  <h3 className="text-lg font-semibold text-secondary-700 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-secondary-100 flex items-center justify-center text-secondary-600">
                      <RefreshCcw className="w-4 h-4" />
                    </span>
                    Phác đồ thay thế
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 bg-gray-50 text-left text-sm font-semibold text-gray-900">STT</th>
                          <th className="px-6 py-3 bg-gray-50 text-left text-sm font-semibold text-gray-900">Thành phần phác đồ</th>
                          <th className="px-6 py-3 bg-gray-50 text-left text-sm font-semibold text-gray-900">Ghi chú</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {firstLineRegimens.alternative.map((regimen, index) => (
                          <tr key={index} className="group/row hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
                            <td className="px-6 py-4">
                              <span className="inline-flex rounded-full bg-secondary-50 px-3 py-1 text-sm font-medium text-secondary-700">
                                {regimen.combination}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{regimen.note}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Phác đồ bậc 2 */}
          <div className="card group hover:border hover:border-secondary-200">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-secondary-100 to-accent-100 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
              <div className="relative bg-white p-8 rounded-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-secondary-500 to-accent-500 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">PHÁC ĐỒ ARV BẬC 2</h2>
                </div>

                <div className="p-4 bg-secondary-50 rounded-lg mb-6">
                  <p className="text-gray-700">
                    Áp dụng khi phác đồ bậc 1 thất bại (tải lượng HIV {'>'} 1000 copies/mL 2 lần liên tiếp sau ít nhất 6 tháng điều trị kèm hỗ trợ tuân thủ đầy đủ).
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 bg-gray-50 text-left text-sm font-semibold text-gray-900">STT</th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-sm font-semibold text-gray-900">Thành phần phác đồ</th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-sm font-semibold text-gray-900">Áp dụng khi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {secondLineRegimens.map((regimen, index) => (
                        <tr key={index} className="group/row hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex rounded-full bg-accent-50 px-3 py-1 text-sm font-medium text-accent-700">
                              {regimen.combination}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{regimen.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Phác đồ đặc biệt */}
          <div className="card group hover:border hover:border-accent-200">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-accent-100 to-primary-100 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
              <div className="relative bg-white p-8 rounded-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-accent-500 to-primary-500 flex items-center justify-center">
                    <Baby className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Phác đồ đặc biệt</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-accent-50 rounded-xl">
                    <h3 className="text-lg font-semibold text-accent-900 mb-3">Trẻ em {'<'} 10 tuổi hoặc {'<'} 30kg</h3>
                    <p className="text-accent-700">Có phác đồ riêng theo cân nặng và độ tuổi.</p>
                  </div>
                  <div className="p-6 bg-primary-50 rounded-xl">
                    <h3 className="text-lg font-semibold text-primary-900 mb-3">Phụ nữ mang thai</h3>
                    <p className="text-primary-700">Ưu tiên TDF + 3TC + DTG nếu có thể (DTG an toàn từ tuần 8 thai kỳ).</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hướng dẫn sử dụng */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guidelines.map((guide, index) => (
              <div key={index} className="card group hover:border hover:border-primary-200">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                  <div className="relative bg-white p-6 rounded-xl flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 flex-shrink-0 flex items-center justify-center">
                      {React.cloneElement(guide.icon as React.ReactElement, { className: "w-6 h-6 text-white" })}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{guide.title}</h3>
                      <p className="text-gray-600">{guide.content}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Lưu ý quan trọng */}
          <div className="card group hover:border hover:border-yellow-200">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-100/50 to-orange-100/50 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
              <div className="relative bg-white p-8 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Lưu ý quan trọng</h2>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <span className="text-gray-700">Không tự ý thay đổi phác đồ điều trị khi chưa có chỉ định của bác sĩ</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <span className="text-gray-700">Thông báo ngay cho bác sĩ khi có các phản ứng bất thường</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <span className="text-gray-700">Tái khám định kỳ để được theo dõi và điều chỉnh phác đồ phù hợp</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <span className="text-gray-700">Luôn mang theo thẻ điều trị ARV khi đi khám</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Thông tin liên hệ */}
          <div className="text-center bg-gradient-to-r from-primary-50 via-secondary-50 to-accent-50 rounded-xl p-8">
            <p className="text-gray-600">
              Nếu bạn có bất kỳ thắc mắc nào về phác đồ điều trị, vui lòng liên hệ:
            </p>
            <div className="mt-4 space-y-2">
              <p className="text-primary-700">
                Hotline: <span className="font-semibold">1800 1234</span>
              </p>
              <p className="text-primary-700">
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
