import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaFilter, FaCalendarAlt, FaClock, FaUserMd, FaGraduationCap, FaAward } from 'react-icons/fa';
import nguyenVanA from '../assets/images/nguyen-van-a.jpg';
import tranThiB from '../assets/images/tran-thi-b.jpg';
import leVanC from '../assets/images/le-van-c.jpg';
import { images } from '../constants/images';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  avatar: string;
  education: string[];
  achievements: string[];
  description: string;
  availableDays: string[];
  availableTimeSlots: {
    date: string;
    slots: string[];
  }[];
}

const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'BS. Nguyễn Văn A',
    specialization: 'Chuyên khoa Nội',
    experience: '15 năm kinh nghiệm',
    avatar: nguyenVanA,
    education: [
      'Bác sĩ Y khoa - Đại học Y Hà Nội',
      'Thạc sĩ Nội khoa - Đại học Y Hà Nội',
      'Chứng chỉ hành nghề số: 12345/BYT-CCHN'
    ],
    achievements: [
      'Giải thưởng Bác sĩ xuất sắc năm 2020',
      'Hơn 10.000 ca khám chữa bệnh thành công',
      'Nhiều năm kinh nghiệm trong điều trị bệnh nội khoa'
    ],
    description: 'Bác sĩ Nguyễn Văn A là chuyên gia hàng đầu trong lĩnh vực nội khoa với hơn 15 năm kinh nghiệm. Bác sĩ đã điều trị thành công cho hàng nghìn bệnh nhân và được đánh giá cao về chuyên môn cũng như tâm huyết với nghề.',
    availableDays: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5'],
    availableTimeSlots: [
      {
        date: '2024-03-20',
        slots: ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
      },
      {
        date: '2024-03-21',
        slots: ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
      }
    ]
  },
  {
    id: '2',
    name: 'BS. Trần Thị B',
    specialization: 'Chuyên khoa Nhi',
    experience: '12 năm kinh nghiệm',
    avatar: tranThiB,
    education: [
      'Bác sĩ Y khoa - Đại học Y Dược TP.HCM',
      'Thạc sĩ Nhi khoa - Đại học Y Dược TP.HCM',
      'Chứng chỉ hành nghề số: 12346/BYT-CCHN'
    ],
    achievements: [
      'Giải thưởng Bác sĩ trẻ xuất sắc năm 2019',
      'Hơn 8.000 ca khám chữa bệnh nhi thành công',
      'Chuyên gia tư vấn dinh dưỡng cho trẻ em'
    ],
    description: 'Bác sĩ Trần Thị B là chuyên gia nhi khoa với 12 năm kinh nghiệm trong việc chăm sóc và điều trị bệnh cho trẻ em. Bác sĩ luôn tận tâm và thấu hiểu tâm lý của trẻ, giúp các bé cảm thấy thoải mái trong quá trình khám chữa bệnh.',
    availableDays: ['Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6'],
    availableTimeSlots: [
      {
        date: '2024-03-20',
        slots: ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
      },
      {
        date: '2024-03-21',
        slots: ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
      }
    ]
  },
  {
    id: '3',
    name: 'BS. Lê Văn C',
    specialization: 'Chuyên khoa Tim mạch',
    experience: '20 năm kinh nghiệm',
    avatar: leVanC,
    education: [
      'Bác sĩ Y khoa - Đại học Y Hà Nội',
      'Tiến sĩ Tim mạch - Đại học Y Hà Nội',
      'Chứng chỉ hành nghề số: 12347/BYT-CCHN'
    ],
    achievements: [
      'Giải thưởng Bác sĩ xuất sắc năm 2021',
      'Hơn 15.000 ca khám chữa bệnh tim mạch thành công',
      'Nhiều công trình nghiên cứu về bệnh tim mạch'
    ],
    description: 'Bác sĩ Lê Văn C là chuyên gia đầu ngành về tim mạch với 20 năm kinh nghiệm. Bác sĩ đã thực hiện thành công nhiều ca phẫu thuật tim phức tạp và có nhiều đóng góp trong lĩnh vực nghiên cứu về bệnh tim mạch.',
    availableDays: ['Thứ 2', 'Thứ 4', 'Thứ 6'],
    availableTimeSlots: [
      {
        date: '2024-03-20',
        slots: ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
      },
      {
        date: '2024-03-21',
        slots: ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
      }
    ]
  }
];

const DoctorsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const specialties = Array.from(new Set(mockDoctors.map(doctor => doctor.specialization)));

  const filteredDoctors = mockDoctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || doctor.specialization === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Đội ngũ Bác sĩ Chuyên môn
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
              Đội ngũ bác sĩ giàu kinh nghiệm, tận tâm với nghề, luôn sẵn sàng phục vụ và chăm sóc sức khỏe của bạn
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="container mx-auto px-4 mt-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm bác sĩ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <div className="relative">
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              >
                <option value="">Tất cả chuyên khoa</option>
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
              <FaFilter className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDoctors.map((doctor) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <img
                  src={doctor.avatar}
                  alt={doctor.name}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = images.doctorTeam;
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{doctor.name}</h3>
                  <p className="text-white/90">{doctor.specialization}</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-gray-600 mb-4">
                  <FaUserMd className="mr-2" />
                  <span>{doctor.experience}</span>
                </div>
                <p className="text-gray-600 mb-6 line-clamp-3">{doctor.description}</p>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <FaGraduationCap className="mr-2 text-primary-600" />
                      Học vấn
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {doctor.education.map((edu, index) => (
                        <li key={index} className="text-sm">{edu}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <FaAward className="mr-2 text-primary-600" />
                      Thành tựu
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {doctor.achievements.map((achievement, index) => (
                        <li key={index} className="text-sm">{achievement}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <FaCalendarAlt className="mr-2 text-primary-600" />
                      Lịch làm việc
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {doctor.availableDays.map((day) => (
                        <span
                          key={day}
                          className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm"
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDoctor(doctor)}
                  className="mt-6 w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors duration-300"
                >
                  Xem chi tiết
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Doctor Detail Modal */}
      <AnimatePresence>
        {selectedDoctor && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedDoctor.name}</h2>
                  <button
                    onClick={() => setSelectedDoctor(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <img
                      src={selectedDoctor.avatar}
                      alt={selectedDoctor.name}
                      className="w-full h-64 object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = images.doctorTeam;
                      }}
                    />
                    <div className="mt-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Thông tin chuyên môn</h3>
                      <p className="text-gray-600">{selectedDoctor.description}</p>
                    </div>
                  </div>
                  <div>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Học vấn</h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          {selectedDoctor.education.map((edu, index) => (
                            <li key={index}>{edu}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Thành tựu</h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          {selectedDoctor.achievements.map((achievement, index) => (
                            <li key={index}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Lịch làm việc</h3>
                        <div className="space-y-4">
                          {selectedDoctor.availableTimeSlots.map((daySlot) => (
                            <div key={daySlot.date} className="border border-gray-200 rounded-lg p-4">
                              <h4 className="font-medium text-gray-900 mb-2">
                                {new Date(daySlot.date).toLocaleDateString('vi-VN', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </h4>
                              <div className="grid grid-cols-3 gap-2">
                                {daySlot.slots.map((time) => (
                                  <span
                                    key={time}
                                    className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm text-center"
                                  >
                                    {time}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DoctorsPage; 