import React from 'react';
import { Clock, AlertCircle, Activity, Heart, Pill, RefreshCcw, Baby, AlertTriangle, Droplet, ClipboardList } from 'lucide-react';

const ARVProtocolPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-primary-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-up">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent">
            Thông tin về phác đồ điều trị ARV
            </h1>
            <p className="text-gray-600 text-lg">
            Tổng quan về nguyên tắc, các nhóm thuốc, phác đồ và theo dõi điều trị ARV cho người lớn và trẻ em.
            </p>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl space-y-8">

          {/* Nguyên tắc chung trong điều trị ARV */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-primary-800 mb-4 flex items-center gap-3">
              <Pill size={28} className="text-primary-600" />
              Nguyên tắc chung trong điều trị ARV
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                <span className="font-semibold text-gray-900">Bắt đầu điều trị sớm:</span> Tất cả người nhiễm HIV được khuyến cáo bắt đầu điều trị ARV ngay khi được chẩn đoán, không phụ thuộc vào số lượng tế bào CD4 hoặc giai đoạn lâm sàng. (Nguồn: <a href="https://www.prepwatch.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline transition-colors">prepwatch.org</a>)
              </p>
              <p>
                <span className="font-semibold text-gray-900">Phối hợp thuốc:</span> Sử dụng ít nhất 3 loại thuốc ARV thuộc từ 2 nhóm thuốc khác nhau để đảm bảo hiệu quả điều trị. (Nguồn: <a href="https://www.prepwatch.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline transition-colors">prepwatch.org</a>)
              </p>
              <p>
                <span className="font-semibold text-gray-900">Tuân thủ điều trị:</span> Người bệnh cần uống thuốc đúng liều, đúng giờ, liên tục và suốt đời để đạt hiệu quả tối ưu và ngăn ngừa kháng thuốc. (Nguồn: <a href="https://www.prepwatch.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline transition-colors">prepwatch.org</a>)
              </p>
                  </div>
                </div>

          {/* Các nhóm thuốc ARV chính */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-primary-800 mb-4 flex items-center gap-3">
              <Pill size={28} className="text-primary-600" />
              Các nhóm thuốc ARV chính
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              {/* Nhóm 1: NRTIs */}
              <div>
                <h3 className="text-xl font-semibold text-primary-800 mb-2">1. Nhóm ức chế men sao chép ngược nucleoside (NRTIs)</h3>
                <p>Gồm các thuốc như Zidovudine (AZT), Lamivudine (3TC), Tenofovir (TDF), Abacavir (ABC), giúp ức chế men sao chép ngược của HIV, ngăn chặn sự nhân lên của vi-rút.</p>
              </div>

              {/* Nhóm 2: NNRTIs */}
                <div>
                <h3 className="text-xl font-semibold text-primary-800 mb-2">2. Nhóm ức chế men sao chép ngược không nucleoside (NNRTIs)</h3>
                <p>Gồm các thuốc như Efavirenz (EFV), Nevirapine (NVP), Etravirine (ETR), gắn vào men sao chép ngược của HIV, gây ức chế hoạt động của enzyme.</p>
                  </div>

              {/* Nhóm 3: Integrase Inhibitors */}
              <div>
                <h3 className="text-xl font-semibold text-primary-800 mb-2">3. Nhóm ức chế men tích hợp (Integrase Inhibitors)</h3>
                <p>Gồm các thuốc như Dolutegravir (DTG), Raltegravir (RAL), ngăn chặn enzyme tích hợp của HIV, ngăn không cho DNA của vi-rút tích hợp vào DNA của tế bào chủ.</p>
                </div>

              {/* Nhóm 4: PIs */}
              <div>
                <h3 className="text-xl font-semibold text-primary-800 mb-2">4. Nhóm ức chế protease (PIs)</h3>
                <p>Gồm các thuốc như Lopinavir/ritonavir (LPV/r), Atazanavir/ritonavir (ATV/r), Darunavir/ritonavir (DRV/r), ức chế enzyme protease của HIV, ngăn chặn quá trình cắt protein cần thiết cho sự nhân lên của vi-rút.</p>
              </div>
            </div>
          </div>

          {/* Phác đồ điều trị ARV chi tiết */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-primary-800 mb-4 flex items-center gap-3">
              <Pill size={28} className="text-primary-600" />
              Phác đồ điều trị ARV chi tiết
            </h2>

            {/* Phác đồ bậc 1 */}
            <div className="mb-6 pb-4 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-primary-800 mb-3">1. Phác đồ bậc 1 (khởi đầu)</h3>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Phác đồ ưu tiên:</h4>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>TDF (Tenofovir) + 3TC (Lamivudine) + DTG (Dolutegravir)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Phác đồ thay thế (khi không thể sử dụng DTG):</h4>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>TDF + 3TC + EFV (Efavirenz)</li>
                    <li>TDF + 3TC + NVP (Nevirapine)</li>
                  </ul>
              </div>
            </div>
          </div>

            {/* Phác đồ bậc 2 */}
            <div className="mb-6 pb-4 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-primary-800 mb-3">2. Phác đồ bậc 2 (khi thất bại với bậc 1)</h3>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Phác đồ ưu tiên:</h4>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>AZT (Zidovudine) + 3TC + LPV/r (Lopinavir/ritonavir)</li>
                    <li>AZT + 3TC + ATV/r (Atazanavir/ritonavir)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Phác đồ thay thế (khi không thể sử dụng AZT):</h4>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>TDF + 3TC + LPV/r</li>
                    <li>TDF + 3TC + ATV/r</li>
                  </ul>
              </div>
            </div>
          </div>

            {/* Phác đồ bậc 3 */}
            <div className="mb-6 pb-4 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-primary-800 mb-3">3. Phác đồ bậc 3 (khi thất bại với bậc 2)</h3>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                    <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Lựa chọn thuốc:</h4>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>DRV/r (Darunavir/ritonavir)</li>
                    <li>ETR (Etravirine)</li>
                    <li>RAL (Raltegravir)</li>
                    <li>DTG (Dolutegravir)</li>
                  </ul>
                </div>
                 <p className="text-gray-600 italic">Việc lựa chọn phác đồ bậc 3 cần dựa trên kết quả xét nghiệm kháng thuốc và lịch sử điều trị của người bệnh.</p>
              </div>
          </div>

            {/* Phác đồ điều trị cho trẻ em */}
            <div>
              <h3 className="text-xl font-semibold text-primary-800 mb-3">👶 Phác đồ điều trị cho trẻ em</h3>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Trẻ dưới 3 tuổi:</h4>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>ABC (Abacavir) + 3TC + LPV/r</li>
                  </ul>
                  </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Trẻ từ 3 đến dưới 10 tuổi:</h4>
                   <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>ABC + 3TC + DTG</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Trẻ từ 10 tuổi trở lên:</h4>
                   <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Áp dụng phác đồ như người lớn, ưu tiên TDF + 3TC + DTG.</li>
                </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Theo dõi và đánh giá điều trị */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-primary-800 mb-4 flex items-center gap-3">
              <ClipboardList size={28} className="text-primary-600" />
              Theo dõi và đánh giá điều trị
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Xét nghiệm tải lượng HIV RNA:</h4>
                <p>Được thực hiện định kỳ để đánh giá hiệu quả điều trị.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Xét nghiệm CD4:</h4>
                <p>Đánh giá tình trạng miễn dịch của người bệnh.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Xét nghiệm kháng thuốc:</h4>
                <p>Thực hiện khi nghi ngờ thất bại điều trị để điều chỉnh phác đồ phù hợp.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ARVProtocolPage;
