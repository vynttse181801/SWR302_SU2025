import React from 'react';

const ContactPage = () => {
  return (    <div className="bg-white min-h-screen py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">Liên hệ với chúng tôi</h1>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          Nếu bạn có bất kỳ câu hỏi hoặc thắc mắc nào, vui lòng liên hệ với chúng tôi qua form bên dưới hoặc thông tin liên hệ của chúng tôi.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="border border-gray-200 rounded-lg p-4 flex flex-col gap-2">
            <div className="font-semibold mb-1">📞 Điện thoại</div>
            <div>Đường dây nóng: 1800 1234</div>
            <div>Hỗ trợ: 024 1234 5678</div>
          </div>
          <div className="border rounded-lg p-4 flex flex-col gap-2">
            <div className="font-semibold mb-1">✉️ Email</div>
            <div>info@hivcare.vn</div>
            <div>support@hivcare.vn</div>
          </div>
          <div className="border rounded-lg p-4 flex flex-col gap-2">
            <div className="font-semibold mb-1">📍 Địa chỉ</div>
            <div>123 Đường Nguyễn Văn A, Quận 1</div>
            <div>Thành phố Hồ Chí Minh, Việt Nam</div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="border rounded-lg p-4">
            <div className="font-semibold mb-2">Giờ làm việc</div>
            <div>Thứ Hai - Thứ Sáu: 8:00 - 17:00</div>
            <div>Thứ Bảy: 8:00 - 12:00</div>
            <div>Chủ Nhật: Đóng cửa</div>
            <div className="text-xs text-gray-500 mt-2">Đường dây nóng hoạt động 24/7</div>
          </div>
          <div className="md:col-span-2 border rounded-lg p-4">
            <div className="font-semibold mb-2">Gửi tin nhắn cho chúng tôi</div>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Họ và tên*</label>
                <input type="text" className="w-full border rounded px-3 py-2 text-sm" placeholder="Nguyễn Văn A" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email*</label>
                <input type="email" className="w-full border rounded px-3 py-2 text-sm" placeholder="example@gmail.com" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                <input type="text" className="w-full border rounded px-3 py-2 text-sm" placeholder="0123456789" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Chủ đề</label>
                <input type="text" className="w-full border rounded px-3 py-2 text-sm" placeholder="Chủ đề nhắn" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Tin nhắn*</label>
                <textarea className="w-full border rounded px-3 py-2 text-sm" rows={3} placeholder="Nội dung tin nhắn của bạn" required></textarea>
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button type="submit" className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors">Gửi tin nhắn</button>
              </div>
            </form>
          </div>
        </div>
        <div className="border rounded-lg p-4 mt-4">
          <div className="font-semibold mb-2">Bản đồ</div>
          <div className="bg-gray-100 h-40 flex items-center justify-center text-gray-500">Bản đồ vị trí của chúng tôi</div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage; 