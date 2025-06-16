import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaFilter, FaCalendarAlt, FaClock, FaUserMd, FaGraduationCap, FaAward } from 'react-icons/fa';
import { doctorService } from '../services/api';
import { images } from '../constants/images';
import { User } from '../types';

interface Doctor {
  id: number;
  user: User;
  specialty: string;
  maxAppointmentsPerDay: number;
  notes: string;
}

const DoctorsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await doctorService.getAllDoctors();
        setDoctors(response.data);
        setError(null);
      } catch (err) {
        setError('Không thể tải danh sách bác sĩ. Vui lòng thử lại sau.');
        console.error('Error fetching doctors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const specialties = Array.from(new Set(doctors.map(doctor => doctor.specialty)));

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = (doctor.user?.fullName || doctor.user?.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-center">
          <p className="text-xl font-semibold mb-2">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

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
                  src={doctor.user.avatar || images.doctorTeam}
                  alt={doctor.user.fullName || doctor.user.username}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = images.doctorTeam;
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{doctor.user?.fullName || doctor.user?.username}</h3>
                  <p className="text-white/90">{doctor.specialty}</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-gray-600 mb-4">
                  <FaUserMd className="mr-2" />
                  <span>Chưa có thông tin kinh nghiệm</span>
                </div>
                <p className="text-gray-600 mb-6 line-clamp-3">{doctor.notes || 'Chưa có mô tả.'}</p>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <FaGraduationCap className="mr-2 text-primary-600" />
                      Học vấn
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li className="text-sm">Chưa có thông tin học vấn</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <FaAward className="mr-2 text-primary-600" />
                      Thành tựu
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li className="text-sm">Chưa có thông tin thành tựu</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <FaCalendarAlt className="mr-2 text-primary-600" />
                      Lịch làm việc
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-gray-200 rounded-full text-sm text-gray-700">Chưa có lịch làm việc</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 text-center">
                <button
                  onClick={() => setSelectedDoctor(doctor)}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                  Xem chi tiết & Đặt lịch
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Doctor Detail Modal */}
      <AnimatePresence>
        {selectedDoctor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedDoctor(null)}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 mb-6">
                  <img
                    src={selectedDoctor.user?.avatar || images.doctorTeam}
                    alt={selectedDoctor.user?.fullName || selectedDoctor.user?.username}
                    className="w-32 h-32 rounded-full object-cover border-4 border-primary-100 shadow-md"
                  />
                  <div className="text-center md:text-left">
                    <h2 className="text-3xl font-bold text-gray-900 mb-1">{selectedDoctor.user?.fullName || selectedDoctor.user?.username}</h2>
                    <p className="text-primary-600 text-lg font-semibold mb-2">{selectedDoctor.specialty}</p>
                    <div className="flex items-center text-gray-600 text-sm">
                      <FaUserMd className="mr-2" />
                      <span>Chưa có thông tin kinh nghiệm</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-6">{selectedDoctor.notes || 'Chưa có mô tả.'}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                      <FaGraduationCap className="mr-2 text-primary-600" />
                      Học vấn & Bằng cấp
                    </h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>Chưa có thông tin học vấn</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                      <FaAward className="mr-2 text-primary-600" />
                      Thành tựu & Giải thưởng
                    </h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>Chưa có thông tin thành tựu</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                    <FaCalendarAlt className="mr-2 text-primary-600" />
                    Lịch làm việc
                  </h3>
                  <div className="space-y-4">
                    <p className="text-gray-600">Không có lịch làm việc.</p>
                  </div>
                </div>

                <div className="mt-8 flex justify-center">
                  <button
                    onClick={() => setSelectedDoctor(null)}
                    className="px-8 py-3 bg-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DoctorsPage; 