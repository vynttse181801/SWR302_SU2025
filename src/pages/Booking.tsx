import React, { useState } from 'react';

const Booking = () => {
  const [bookingData, setBookingData] = useState({
    fullName: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    doctor: '',
    reason: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý logic đặt lịch ở đây
    console.log('Booking data:', bookingData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Đặt lịch khám</h1>
      <p className="text-gray-600 mb-6">Đặt lịch khám với bác sĩ chuyên khoa HIV</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Thông tin cá nhân</h2>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Họ và tên</label>
              <input
                type="text"
                name="fullName"
                value={bookingData.fullName}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Số điện thoại</label>
              <input
                type="tel"
                name="phone"
                value={bookingData.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={bookingData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Thông tin lịch hẹn</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Ngày khám</label>
              <input
                type="date"
                name="date"
                value={bookingData.date}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Thời gian</label>
              <input
                type="time"
                name="time"
                value={bookingData.time}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bác sĩ</label>
            <select
              name="doctor"
              value={bookingData.doctor}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Chọn bác sĩ</option>
              <option value="doctor1">Bác sĩ A</option>
              <option value="doctor2">Bác sĩ B</option>
              <option value="doctor3">Bác sĩ C</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Lý do khám</label>
            <textarea
              name="reason"
              value={bookingData.reason}
              onChange={handleChange}
              className="w-full p-2 border rounded-md h-32 resize-none"
              placeholder="Mô tả ngắn gọn lý do bạn muốn đặt lịch khám"
              required
            />
          </div>
        </div>        <button
          type="submit"
          className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-900 transition-colors"
        >
          Đặt lịch khám
        </button>
      </form>
    </div>
  );
};

export default Booking;
