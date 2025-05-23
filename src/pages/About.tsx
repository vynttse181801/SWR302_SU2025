import React from 'react';

const team = [
  {
    name: 'Bác sĩ Nguyễn A',
    role: 'Chuyên gia HIV',
    desc: 'Bác sĩ chuyên khoa HIV với hơn 15 năm kinh nghiệm, tận tâm trong việc hỗ trợ bệnh nhân và cộng đồng.',
  },
  {
    name: 'Bác sĩ Trần B',
    role: 'Chuyên gia tư vấn',
    desc: 'Chuyên gia tư vấn tâm lý và sức khỏe cộng đồng, đồng hành cùng người sống với HIV.',
  },
  {
    name: 'Bác sĩ Lê C',
    role: 'Chuyên gia điều trị',
    desc: 'Bác sĩ điều trị HIV/AIDS, giàu kinh nghiệm trong quản lý và chăm sóc bệnh nhân.',
  },
];

const timeline = [
  {
    title: 'Thành lập',
    desc: 'HIV Care được thành lập với sứ mệnh cung cấp dịch vụ chăm sóc sức khỏe HIV toàn diện, hiệu quả và an toàn.',
  },
  {
    title: 'Mở rộng dịch vụ',
    desc: 'Mở rộng các dịch vụ chăm sóc sức khỏe HIV, bao gồm tư vấn, điều trị và hỗ trợ trực tuyến, giúp bệnh nhân quản lý sức khỏe tốt hơn.',
  },
  {
    title: 'Ra mắt ứng dụng di động',
    desc: 'Ra mắt ứng dụng di động HIV Care, giúp người dùng dễ dàng tiếp cận các dịch vụ chăm sóc sức khỏe HIV mọi lúc, mọi nơi.',
  },
  {
    title: 'Hợp tác quốc tế',
    desc: 'Hợp tác với các tổ chức quốc tế và mạng lưới HIV/AIDS để nâng cao chất lượng dịch vụ và hỗ trợ cộng đồng.',
  },
  {
    title: 'Hiện tại',
    desc: 'Tiếp tục phát triển các giải pháp và dịch vụ, mở rộng hệ sinh thái chăm sóc sức khỏe HIV toàn diện cho bệnh nhân và cộng đồng.',
  },
];

const AboutPage = () => {
  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">Về chúng tôi</h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Tìm hiểu về sứ mệnh, tầm nhìn và đội ngũ của chúng tôi trong việc cung cấp dịch vụ chăm sóc sức khỏe HIV toàn diện.
        </p>        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <span className="inline-block bg-black text-white px-4 py-1.5 rounded-full text-xs font-medium">Sứ mệnh</span>
              <div className="h-px flex-1 bg-gray-200"></div>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-black">Sứ mệnh của chúng tôi</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Sứ mệnh của chúng tôi là cung cấp dịch vụ chăm sóc sức khỏe HIV toàn diện, chất lượng và hiệu quả, giúp người sống chung với HIV có cuộc sống khỏe mạnh và hạnh phúc.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-600">Cung cấp dịch vụ chăm sóc sức khỏe đa dạng, dễ tiếp cận và an toàn cho mọi đối tượng.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-600">Hỗ trợ bệnh nhân trong suốt quá trình điều trị, từ tư vấn, xét nghiệm đến quản lý thuốc.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-600">Xây dựng cộng đồng hỗ trợ và nâng cao nhận thức về HIV/AIDS.</span>
              </li>
            </ul>
          </div>
          
          <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <span className="inline-block bg-black text-white px-4 py-1.5 rounded-full text-xs font-medium">Tầm nhìn</span>
              <div className="h-px flex-1 bg-gray-200"></div>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-black">Tầm nhìn của chúng tôi</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Chúng tôi hướng tới một tương lai nơi mọi người sống chung với HIV đều có thể tiếp cận dịch vụ chăm sóc sức khỏe chất lượng cao, không bị kỳ thị và phân biệt đối xử.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-600">Đẩy mạnh ứng dụng công nghệ số vào chăm sóc sức khỏe, hỗ trợ người bệnh mọi lúc, mọi nơi.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-600">Xây dựng hệ sinh thái dịch vụ toàn diện và bền vững.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-600">Góp phần xóa bỏ kỳ thị và phân biệt đối xử trong cộng đồng người sống chung với HIV.</span>
              </li>
            </ul>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">Đội ngũ của chúng tôi</h2>
        <p className="text-center text-gray-600 mb-8 max-w-xl mx-auto">
          Đội ngũ y bác sĩ và chuyên gia giàu kinh nghiệm, tận tâm trong việc chăm sóc sức khỏe HIV.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {team.map((member, idx) => (
            <div key={idx} className="bg-gray-50 rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-gray-200 mb-4 flex items-center justify-center text-3xl text-gray-400">
                <span>👤</span>
              </div>
              <h3 className="font-bold text-lg mb-1 text-gray-900">{member.name}</h3>
              <p className="text-primary-600 text-sm font-medium mb-1">{member.role}</p>
              <p className="text-gray-600 text-sm">{member.desc}</p>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">Lịch sử phát triển</h2>
        <p className="text-center text-gray-600 mb-8 max-w-xl mx-auto">
          Hành trình phát triển của chúng tôi trong việc cung cấp dịch vụ chăm sóc sức khỏe HIV.
        </p>
        <div className="max-w-2xl mx-auto mb-16">
          <ol className="relative border-l border-gray-200">
            {timeline.map((item, idx) => (
              <li key={idx} className="mb-10 ml-6">
                <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-primary-600 rounded-full ring-8 ring-white text-white text-sm font-bold">{idx + 1}</span>
                <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="bg-gray-900 text-white py-12 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Tham gia cùng chúng tôi</h2>
          <p className="mb-6 text-white/90 max-w-xl mx-auto">
            Đăng ký ngay hôm nay để trải nghiệm dịch vụ chăm sóc sức khỏe HIV toàn diện cùng chúng tôi.
          </p>
          <a href="/dang-ky" className="inline-block px-8 py-3 bg-white text-primary-600 font-medium rounded-md hover:bg-gray-100 transition-colors">Đăng ký ngay</a>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 