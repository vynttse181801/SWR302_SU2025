import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { testService, consultationService } from '../services/api';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar, Clock, User, FileText, CheckCircle, XCircle, Clock as ClockIcon } from 'lucide-react';

interface LabBooking {
  id: number;
  testTypeName: string;
  date: string;
  timeSlot: string;
  status: string;
  notes: string;
}

interface Consultation {
  id: number;
  consultationType: string;
  startTime: string;
  endTime: string;
  notes: string;
  status: string;
  doctorName: string;
}

const TestResults: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tests' | 'consultations'>('tests');
  const [labBookings, setLabBookings] = useState<LabBooking[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [labBookingsRes, consultationsRes] = await Promise.all([
        testService.getLabBookingsByPatient(1), // Cần lấy patientId từ context
        consultationService.getConsultationsByPatient(1) // Cần lấy patientId từ context
      ]);
      
      setLabBookings(labBookingsRes.data);
      setConsultations(consultationsRes.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'confirmed':
        return 'text-green-600 bg-green-100';
      case 'pending':
      case 'scheduled':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
      case 'scheduled':
        return <ClockIcon className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Lịch sử đặt lịch</h1>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {/* Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('tests')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'tests'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Lịch xét nghiệm ({labBookings.length})
                </button>
                <button
                  onClick={() => setActiveTab('consultations')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'consultations'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Lịch tư vấn ({consultations.length})
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          {activeTab === 'tests' && (
            <div className="space-y-6">
              {labBookings.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có lịch xét nghiệm</h3>
                  <p className="mt-1 text-sm text-gray-500">Bạn chưa đặt lịch xét nghiệm nào.</p>
                </div>
              ) : (
                labBookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <FileText className="w-5 h-5 text-primary-600" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{booking.testTypeName}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{format(new Date(booking.date), 'dd/MM/yyyy')}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{booking.timeSlot}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          <span className="ml-1">{booking.status}</span>
                        </span>
                      </div>
                    </div>
                    {booking.notes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">{booking.notes}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'consultations' && (
            <div className="space-y-6">
              {consultations.length === 0 ? (
                <div className="text-center py-12">
                  <User className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có lịch tư vấn</h3>
                  <p className="mt-1 text-sm text-gray-500">Bạn chưa đặt lịch tư vấn nào.</p>
                </div>
              ) : (
                consultations.map((consultation) => (
                  <div key={consultation.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-secondary-600" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{consultation.consultationType}</h3>
                          <p className="text-sm text-gray-600">Bác sĩ: {consultation.doctorName}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{format(new Date(consultation.startTime), 'dd/MM/yyyy')}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>
                                {format(new Date(consultation.startTime), 'HH:mm')} - {format(new Date(consultation.endTime), 'HH:mm')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(consultation.status)}`}>
                          {getStatusIcon(consultation.status)}
                          <span className="ml-1">{consultation.status}</span>
                        </span>
                      </div>
                    </div>
                    {consultation.notes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">{consultation.notes}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default TestResults;
