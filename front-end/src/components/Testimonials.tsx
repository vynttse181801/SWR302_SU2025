import React from 'react';
import { Quote, Star } from 'lucide-react';

type Testimonial = {
  id: number;
  name: string;
  role: string;
  text: string;
  avatar: string;
  rating: number;
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Nguyễn V.",
    role: "Bệnh nhân",
    text: "Hệ thống quản lý sức khỏe HIV đã giúp tôi duy trì được lịch trình điều trị và quản lý sức khỏe tốt hơn. Tôi rất hài lòng với các chức năng theo dõi.",
    avatar: "N",
    rating: 5
  },
  {
    id: 2,
    name: "Trần T.",
    role: "Bệnh nhân",
    text: "Ứng dụng rất dễ sử dụng và giúp tôi không bỏ lỡ lịch uống thuốc. Đặc biệt hữu ích là tính năng nhắc nhở và khả năng trao đổi với bác sĩ chuyên khoa.",
    avatar: "T",
    rating: 5
  },
  {
    id: 3,
    name: "Bác sĩ Nguyễn A.",
    role: "Chuyên gia",
    text: "Với tư cách là bác sĩ chuyên khoa, tôi thấy hệ thống giúp theo dõi bệnh nhân hiệu quả hơn, các chỉ số được cập nhật liên tục và hỗ trợ tốt cho việc điều trị dài hạn.",
    avatar: "A",
    rating: 5
  }
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary-100 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-secondary-100 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent">
            Phản hồi từ người dùng
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Những chia sẻ từ người sử dụng về những trải nghiệm khi sử dụng hệ thống của chúng tôi.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => {
            // Determine gradient colors based on index
            const gradients = [
              'from-primary-500/10 to-secondary-500/10',
              'from-secondary-500/10 to-accent-500/10',
              'from-accent-500/10 to-primary-500/10'
            ];
            
            return (
              <div 
                key={testimonial.id} 
                className="relative group transform hover:scale-[1.02] transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Background blur effect */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradients[index]} rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-300`}></div>
                
                {/* Card content */}
                <div className="relative bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                  {/* Quote icon */}
                  <div className="absolute -top-4 -right-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-300
                      ${index === 0 ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white' : 
                        index === 1 ? 'bg-gradient-to-br from-secondary-500 to-secondary-600 text-white' : 
                        'bg-gradient-to-br from-accent-500 to-accent-600 text-white'}`}>
                      <Quote size={16} />
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        className={`fill-current ${
                          index === 0 ? 'text-primary-500' : 
                          index === 1 ? 'text-secondary-500' : 
                          'text-accent-500'
                        }`} 
                      />
                    ))}
                  </div>

                  {/* Testimonial text */}
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    "{testimonial.text}"
                  </p>

                  {/* Author info */}
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-medium shadow-lg transform group-hover:rotate-6 transition-transform duration-300
                      ${index === 0 ? 'bg-gradient-to-br from-primary-500 to-primary-600' : 
                        index === 1 ? 'bg-gradient-to-br from-secondary-500 to-secondary-600' : 
                        'bg-gradient-to-br from-accent-500 to-accent-600'}`}>
                      {testimonial.avatar}
                    </div>
                    <div className="ml-4">
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;