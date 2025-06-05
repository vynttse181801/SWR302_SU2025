import React, { useState } from 'react';
import { Search, AlertCircle } from 'lucide-react';

const TestResults = () => {
  const [formData, setFormData] = useState({
    testId: '',
    dob: '',
    phone: ''
  });

  const [searchStatus, setSearchStatus] = useState<'idle' | 'not_found' | 'found'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Giả lập tìm kiếm kết quả
    // Trong thực tế, đây sẽ là API call đến backend
    setSearchStatus(formData.testId ? 'found' : 'not_found');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tra cứu kết quả xét nghiệm
            </h1>
            <p className="text-gray-600">
              Nhập mã số xét nghiệm và thông tin cá nhân để xem kết quả
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex gap-2">
                <AlertCircle className="text-blue-500 w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">Bảo mật thông tin</p>
                  <p>
                    Kết quả xét nghiệm của bạn được bảo mật tuyệt đối. 
                    Chỉ những người có mã số xét nghiệm và thông tin cá nhân trùng khớp mới có thể xem kết quả.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="testId" className="block text-sm font-medium text-gray-700 mb-1">
                  Mã số xét nghiệm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="testId"
                  name="testId"
                  value={formData.testId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                  placeholder="Nhập mã số xét nghiệm của bạn"
                />
              </div>

              <div>
                <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày sinh <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                  placeholder="Nhập số điện thoại của bạn"
                />
              </div>

              <div className="text-right">
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-3 bg-black text-white rounded-md hover:bg-gray-900 transition-colors"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Tra cứu kết quả
                </button>
              </div>
            </form>

            {searchStatus === 'not_found' && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex gap-2 text-red-700">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Không tìm thấy kết quả</p>
                    <p className="text-sm mt-1">
                      Vui lòng kiểm tra lại mã số xét nghiệm và thông tin cá nhân của bạn.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {searchStatus === 'found' && (
              <div className="mt-6">
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Kết quả xét nghiệm</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">Mã số xét nghiệm</p>
                        <p className="font-medium">{formData.testId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Ngày xét nghiệm</p>
                        <p className="font-medium">26/05/2025</p>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Kết luận</p>
                      <p className="font-medium text-green-600">Âm tính (Negative)</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Kết quả xét nghiệm là âm tính, tuy nhiên bạn nên tái xét nghiệm sau 3 tháng 
                        để có kết quả chính xác nhất.
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Khuyến nghị</p>
                      <ul className="list-disc list-inside text-sm text-gray-500 space-y-1">
                        <li>Tái xét nghiệm sau 3 tháng để khẳng định kết quả</li>
                        <li>Thực hiện các biện pháp phòng ngừa an toàn</li>
                        <li>Liên hệ với chúng tôi nếu có bất kỳ câu hỏi nào</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 text-sm text-gray-500">
                    <p>
                      Nếu bạn cần tư vấn thêm về kết quả xét nghiệm, vui lòng liên hệ:
                      <br />
                      Hotline: <span className="font-semibold">1800 1234</span>
                      <br />
                      Email: <span className="font-semibold">support@hivcare.vn</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestResults;
