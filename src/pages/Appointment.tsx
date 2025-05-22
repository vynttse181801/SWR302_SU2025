import React from 'react';

const AppointmentPage = () => {
  return (    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <a href="/dich-vu" className="text-sm text-gray-600 hover:text-black">&larr; Quay lại trang dịch vụ</a>
        </div>
        <h1 className="text-2xl font-bold mb-1">Đặt lịch khám</h1>
        <p className="text-gray-600 mb-6">Đặt lịch khám với bác sĩ chuyên khoa HIV</p>
        <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-lg font-semibold mb-4">Thông tin đặt lịch</h2>
          <p className="text-gray-600 mb-6">Vui lòng điền đầy đủ thông tin để đặt lịch khám</p>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Họ và tên</label>
                <input type="text" className="w-full border rounded px-3 py-2 text-sm" placeholder="Nguyễn Văn A" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                <input type="text" className="w-full border rounded px-3 py-2 text-sm" placeholder="0123456789" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" className="w-full border rounded px-3 py-2 text-sm" placeholder="example@gmail.com" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Ngày khám</label>
                <input type="date" className="w-full border rounded px-3 py-2 text-sm" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Thời gian</label>
                <input type="time" className="w-full border rounded px-3 py-2 text-sm" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Bác sĩ</label>
              <select className="w-full border rounded px-3 py-2 text-sm" required>
                <option value="">Chọn bác sĩ</option>
                <option value="bs1">Bác sĩ Nguyễn A</option>
                <option value="bs2">Bác sĩ Trần B</option>
                <option value="bs3">Bác sĩ Lê C</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Lý do khám</label>
              <textarea className="w-full border rounded px-3 py-2 text-sm" rows={3} placeholder="Mô tả ngắn gọn lý do bạn muốn đặt lịch khám" />
            </div>
            <button type="submit" className="w-full px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors font-semibold">Đặt lịch khám</button>
          </form>
          <p className="text-xs text-gray-500 mt-4">
            Bằng cách đặt lịch, bạn đồng ý với <a href="#" className="underline">điều khoản dịch vụ</a> của chúng tôi.
          </p>
        </div>
      </div>
      <footer className="mt-10 border-t pt-6 text-center text-xs text-gray-500">
        © 2023 HIV Care. Tất cả quyền được bảo lưu. &nbsp; | &nbsp;
        <a href="#" className="hover:underline">Chính sách bảo mật</a> &nbsp; | &nbsp;
        <a href="#" className="hover:underline">Điều khoản sử dụng</a>
      </footer>
    </div>
  );
};

export default AppointmentPage; 