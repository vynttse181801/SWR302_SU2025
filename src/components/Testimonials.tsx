import React from 'react';

type Testimonial = {
  id: number;
  name: string;
  role: string;
  text: string;
  avatar: string;
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Nguyễn V.",
    role: "Bệnh nhân",
    text: "Hệ thống quản lý sức khỏe HIV đã giúp tôi duy trì được lịch trình điều trị và quản lý sức khỏe tốt hơn. Tôi rất hài lòng với các chức năng theo dõi.",
    avatar: "N"
  },
  {
    id: 2,
    name: "Trần T.",
    role: "Bệnh nhân",
    text: "Ứng dụng rất dễ sử dụng và giúp tôi không bỏ lỡ lịch uống thuốc. Đặc biệt hữu ích là tính năng nhắc nhở và khả năng trao đổi với bác sĩ chuyên khoa.",
    avatar: "T"
  },
  {
    id: 3,
    name: "Bác sĩ Nguyễn A.",
    role: "Chuyên gia",
    text: "Với tư cách là bác sĩ chuyên khoa, tôi thấy hệ thống giúp theo dõi bệnh nhân hiệu quả hơn, các chỉ số được cập nhật liên tục và hỗ trợ tốt cho việc điều trị dài hạn.",
    avatar: "A"
  }
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
            Phản hồi từ người dùng
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Những chia sẻ từ người sử dụng về những trải nghiệm khi sử dụng hệ thống của chúng tôi.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 text-black flex items-center justify-center font-bold mr-3">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-black">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm italic">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;