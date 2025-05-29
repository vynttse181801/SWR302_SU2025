import React from 'react';
import { Star, Award, Users, Calendar, Rocket, Globe, Activity } from 'lucide-react';

const team = [
  {
    name: 'Bác sĩ Nguyễn A',
    role: 'Chuyên gia HIV',
    desc: 'Bác sĩ chuyên khoa HIV với hơn 15 năm kinh nghiệm, tận tâm trong việc hỗ trợ bệnh nhân và cộng đồng.',
    avatar: 'N',
  },
  {
    name: 'Bác sĩ Trần B',
    role: 'Chuyên gia tư vấn',
    desc: 'Chuyên gia tư vấn tâm lý và sức khỏe cộng đồng, đồng hành cùng người sống với HIV.',
    avatar: 'T',
  },
  {
    name: 'Bác sĩ Lê C',
    role: 'Chuyên gia điều trị',
    desc: 'Bác sĩ điều trị HIV/AIDS, giàu kinh nghiệm trong quản lý và chăm sóc bệnh nhân.',
    avatar: 'L',
  },
];

const timeline = [
  {
    icon: <Star className="w-6 h-6" />,
    title: 'Thành lập',
    year: '2020',
    desc: 'HIV Care được thành lập với sứ mệnh cung cấp dịch vụ chăm sóc sức khỏe HIV toàn diện, hiệu quả và an toàn.',
  },
  {
    icon: <Activity className="w-6 h-6" />,
    title: 'Mở rộng dịch vụ',
    year: '2021',
    desc: 'Mở rộng các dịch vụ chăm sóc sức khỏe HIV, bao gồm tư vấn, điều trị và hỗ trợ trực tuyến.',
  },
  {
    icon: <Rocket className="w-6 h-6" />,
    title: 'Ra mắt ứng dụng di động',
    year: '2022',
    desc: 'Ra mắt ứng dụng di động HIV Care, giúp người dùng dễ dàng tiếp cận các dịch vụ chăm sóc sức khỏe HIV mọi lúc, mọi nơi.',
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: 'Hợp tác quốc tế',
    year: '2023',
    desc: 'Hợp tác với các tổ chức quốc tế và mạng lưới HIV/AIDS để nâng cao chất lượng dịch vụ và hỗ trợ cộng đồng.',
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: 'Hiện tại',
    year: '2025',
    desc: 'Tiếp tục phát triển các giải pháp và dịch vụ, mở rộng hệ sinh thái chăm sóc sức khỏe HIV toàn diện.',
  },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary-50 to-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
            Về chúng tôi
          </h1>
          <p className="text-center text-primary-700 text-lg mb-12 max-w-3xl mx-auto leading-relaxed">
            Tìm hiểu về sứ mệnh, tầm nhìn và đội ngũ của chúng tôi trong việc cung cấp dịch vụ chăm sóc sức khỏe HIV toàn diện.
          </p>

          {/* Mission and Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="card group hover:border hover:border-primary-200">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                <div className="relative bg-white p-8 rounded-xl">
                  <h3 className="text-2xl font-bold mb-4 text-primary-600">Sứ mệnh</h3>
                  <p className="text-primary-700 leading-relaxed">
                    Chúng tôi cam kết mang đến dịch vụ chăm sóc sức khỏe HIV chất lượng cao,
                    tạo môi trường an toàn và tích cực cho người sống chung với HIV/AIDS.
                  </p>
                </div>
              </div>
            </div>
            <div className="card group hover:border hover:border-secondary-200">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-secondary-100 to-accent-100 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                <div className="relative bg-white p-8 rounded-xl">
                  <h3 className="text-2xl font-bold mb-4 text-secondary-600">Tầm nhìn</h3>
                  <p className="text-secondary-700 leading-relaxed">
                    Trở thành đơn vị tiên phong trong việc cung cấp giải pháp chăm sóc sức khỏe HIV
                    tích hợp công nghệ, nâng cao chất lượng cuộc sống cho cộng đồng.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white via-secondary-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
            Đội ngũ chuyên gia
          </h2>
          <p className="text-center text-primary-700 mb-12 max-w-2xl mx-auto">
            Những chuyên gia hàng đầu của chúng tôi luôn sẵn sàng hỗ trợ và đồng hành cùng bạn.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={member.name} className="card group hover:border hover:border-primary-200">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                  <div className="relative bg-white p-8 rounded-xl text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
                      {member.avatar}
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-primary-700">{member.name}</h3>
                    <p className="text-secondary-600 font-medium mb-4">{member.role}</p>
                    <p className="text-primary-700">{member.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-primary-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
            Chặng đường phát triển
          </h2>
          <p className="text-center text-primary-700 mb-12 max-w-2xl mx-auto">
            Những cột mốc quan trọng trong hành trình phát triển của HIV Care.
          </p>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-primary-200 via-secondary-200 to-accent-200"></div>
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div key={item.title} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12'}`}>
                    <div className="card group hover:border hover:border-primary-200">
                      <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                        <div className="relative bg-white p-6 rounded-xl">
                          <div className="text-primary-600 font-bold mb-2">{item.year}</div>
                          <h3 className="text-xl font-bold mb-2 text-primary-700">{item.title}</h3>
                          <p className="text-primary-700">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white shadow-lg">
                      {item.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;