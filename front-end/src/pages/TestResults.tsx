import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { testService, consultationService } from '../services/api';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar, Clock, User, FileText, CheckCircle, XCircle, Clock as ClockIcon, Eye, Edit, Trash, Plus } from 'lucide-react';
import { labResultService } from '../services/api';
import { LabResult, LabTestType } from '../types';
import Modal from '../components/Modal';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

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
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'tests' | 'consultations'>('tests');
  const [labBookings, setLabBookings] = useState<LabBooking[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [testTypes, setTestTypes] = useState<LabTestType[]>([]);
  const [selectedResult, setSelectedResult] = useState<LabResult | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    resultValue: '',
    unit: '',
    normalRange: '',
    notes: ''
  });
  const [patientId, setPatientId] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      // Gọi API lấy patientId theo user.id
      api.get(`/patients/user/${user.id}`)
        .then(res => setPatientId(res.data.id))
        .catch(() => setError('Không tìm thấy thông tin bệnh nhân'));
    }
  }, [user]);

  useEffect(() => {
    if (patientId) fetchData();
    // eslint-disable-next-line
  }, [patientId]);

  const fetchData = async () => {
    if (!patientId) return;
    try {
      setLoading(true);
      const [labBookingsRes, consultationsRes, resultsRes, typesRes] = await Promise.all([
        testService.getLabBookingsByPatient(patientId),
        consultationService.getConsultationsByPatient(patientId),
        labResultService.getAllLabResults(),
        testService.getTestTypes()
      ]);
      setLabBookings(labBookingsRes.data);
      setConsultations(consultationsRes.data);
      setLabResults(resultsRes.data);
      setTestTypes(typesRes.data);
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

  const handleShowDetail = (result: LabResult) => {
    setSelectedResult(result);
    setShowDetailModal(true);
  };

  const handleShowEdit = (result: LabResult) => {
    setSelectedResult(result);
    setEditForm({
      resultValue: result.resultValue,
      unit: result.unit || '',
      normalRange: result.normalRange || '',
      notes: result.notes || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateResult = async () => {
    if (!selectedResult) return;
    
    try {
      await labResultService.updateLabResult(selectedResult.id, {
        ...selectedResult,
        resultValue: editForm.resultValue,
        unit: editForm.unit,
        normalRange: editForm.normalRange,
        notes: editForm.notes
      });
      setShowEditModal(false);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error updating lab result:', error);
      alert('Có lỗi xảy ra khi cập nhật kết quả xét nghiệm');
    }
  };

  const handleDeleteResult = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa kết quả xét nghiệm này?')) return;
    
    try {
      await labResultService.deleteLabResult(id);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error deleting lab result:', error);
      alert('Có lỗi xảy ra khi xóa kết quả xét nghiệm');
    }
  };

  const getTestTypeName = (testTypeId: number) => {
    const testType = testTypes.find(t => t.id === testTypeId);
    return testType ? testType.name : 'N/A';
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

      {/* Modal chi tiết */}
      {showDetailModal && selectedResult && (
        <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="Chi tiết kết quả xét nghiệm">
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Thông tin bệnh nhân</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Tên:</strong> {selectedResult.patient.fullName}</div>
                    <div><strong>Email:</strong> {selectedResult.patient.email}</div>
                    <div><strong>SĐT:</strong> {selectedResult.patient.phoneNumber}</div>
                    <div><strong>Ngày sinh:</strong> {selectedResult.patient.dateOfBirth}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Thông tin xét nghiệm</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Loại xét nghiệm:</strong> {getTestTypeName(selectedResult.testType.id)}</div>
                    <div><strong>Ngày xét nghiệm:</strong> {new Date(selectedResult.testDate).toLocaleDateString('vi-VN')}</div>
                    <div><strong>Kết quả:</strong> {selectedResult.resultValue} {selectedResult.unit}</div>
                    {selectedResult.normalRange && (
                      <div><strong>Khoảng bình thường:</strong> {selectedResult.normalRange}</div>
                    )}
                  </div>
                </div>
              </div>

              {selectedResult.notes && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Ghi chú</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700">{selectedResult.notes}</p>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Thông tin người nhập</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm">
                    <div><strong>Người nhập:</strong> {selectedResult.enteredBy.fullName}</div>
                    <div><strong>Ngày tạo:</strong> {new Date(selectedResult.createdAt).toLocaleString('vi-VN')}</div>
                    <div><strong>Ngày cập nhật:</strong> {new Date(selectedResult.updatedAt).toLocaleString('vi-VN')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal chỉnh sửa */}
      {showEditModal && selectedResult && (
        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Chỉnh sửa kết quả xét nghiệm">
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kết quả *
                </label>
                <input
                  type="text"
                  value={editForm.resultValue}
                  onChange={(e) => setEditForm({...editForm, resultValue: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập kết quả xét nghiệm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đơn vị
                </label>
                <input
                  type="text"
                  value={editForm.unit}
                  onChange={(e) => setEditForm({...editForm, unit: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: mg/dL, ng/mL"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Khoảng bình thường
                </label>
                <input
                  type="text"
                  value={editForm.normalRange}
                  onChange={(e) => setEditForm({...editForm, normalRange: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: 70-100 mg/dL"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú
                </label>
                <textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ghi chú về kết quả xét nghiệm"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateResult}
                disabled={!editForm.resultValue}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TestResults;
