import React, { useState } from 'react';
import { User, FileText, Calendar, Edit, Trash, Check, X, Eye, Mail, Phone, MapPin, Info, Plus, ClipboardList } from 'lucide-react';
import Modal from './Modal';
import { testService, staffService, labResultService } from '../services/api';
import { LabTestType, LabBooking, LabResult } from '../types';

interface PatientDetail {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  medicalRecordNumber?: string;
  patientCode?: string;
  bloodType?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
}

interface LabBookingManagementProps {
  labBookings: LabBooking[];
  onConfirmLabBooking: (id: number) => void;
  onCancelLabBooking: (id: number) => void;
  onUpdateLabBookingStatus: (id: number, status: LabBooking['status']) => void;
}

const LabBookingManagement: React.FC<LabBookingManagementProps> = ({ labBookings, onConfirmLabBooking, onCancelLabBooking, onUpdateLabBookingStatus }) => {
  const [selectedBooking, setSelectedBooking] = useState<LabBooking | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [testTypes, setTestTypes] = useState<LabTestType[]>([]);
  const [loadingTestType, setLoadingTestType] = useState(false);
  const [patientDetail, setPatientDetail] = useState<PatientDetail | null>(null);
  const [loadingPatient, setLoadingPatient] = useState(false);
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [loadingResults, setLoadingResults] = useState(false);

  // Form state cho kết quả xét nghiệm
  const [resultForm, setResultForm] = useState({
    resultValue: '',
    unit: '',
    normalRange: '',
    notes: ''
  });

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Confirmed': 'bg-blue-100 text-blue-800',
      'Completed': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800',
      'Results Ready': 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts: { [key: string]: string } = {
      'Pending': 'Chờ xác nhận',
      'Confirmed': 'Đã xác nhận',
      'Completed': 'Hoàn thành',
      'Cancelled': 'Đã hủy',
      'Results Ready': 'Có kết quả'
    };
    return texts[status] || status;
  };

  const statusOptions: LabBooking['status'][] = ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'Results Ready'];

  const handleShowDetail = async (booking: LabBooking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
    setLoadingTestType(true);
    setLoadingPatient(true);
    setLoadingResults(true);
    
    try {
      const res = await testService.getTestTypes();
      setTestTypes(res.data);
    } catch {
      setTestTypes([]);
    } finally {
      setLoadingTestType(false);
    }
    
    // Lấy thông tin bệnh nhân chi tiết nếu có patientId
    if (booking.patientId) {
      try {
        const res = await staffService.getPatientById(booking.patientId);
        setPatientDetail(res.data);
      } catch {
        setPatientDetail(null);
      } finally {
        setLoadingPatient(false);
      }
    } else {
      setPatientDetail(null);
      setLoadingPatient(false);
    }

    // Lấy kết quả xét nghiệm của bệnh nhân
    try {
      const res = await labResultService.getLabResultsByPatient(booking.patientId);
      setLabResults(res.data);
    } catch {
      setLabResults([]);
    } finally {
      setLoadingResults(false);
    }
  };

  const handleShowResultModal = (booking: LabBooking) => {
    setSelectedBooking(booking);
    setShowResultModal(true);
    setResultForm({
      resultValue: '',
      unit: '',
      normalRange: '',
      notes: ''
    });
  };

  const handleSubmitResult = async () => {
    if (!selectedBooking) return;
    
    try {
      const resultData = {
        patient: { id: selectedBooking.patientId },
        testType: { id: selectedBooking.testTypeId },
        testDate: selectedBooking.date,
        resultValue: resultForm.resultValue,
        unit: resultForm.unit,
        normalRange: resultForm.normalRange,
        notes: resultForm.notes,
        enteredBy: { id: 1 } // TODO: Lấy ID của staff hiện tại
      };
      
      await labResultService.createLabResult(resultData);
      
      // Cập nhật trạng thái lịch xét nghiệm thành "Results Ready"
      await testService.updateLabBookingStatus(selectedBooking.id, 'Results Ready');
      
      setShowResultModal(false);
      // Refresh data
      window.location.reload();
    } catch (error) {
      console.error('Error creating lab result:', error);
      alert('Có lỗi xảy ra khi tạo kết quả xét nghiệm');
    }
  };

  const getTestTypeDetail = (booking: LabBooking) => {
    if (!booking) return null;
    if (booking.testTypeId && testTypes.length > 0) {
      return testTypes.find(t => t.id === booking.testTypeId);
    }
    return null;
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bệnh nhân</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {labBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {booking.patientName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.testTypeName}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                    {getStatusText(booking.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    {booking.status === 'Pending' && (
                      <>
                        <button onClick={() => onConfirmLabBooking(booking.id)} className="text-green-600 hover:text-green-900" title="Duyệt">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => onCancelLabBooking(booking.id)} className="text-red-600 hover:text-red-900" title="Hủy">
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    
                    {booking.status === 'Completed' && (
                      <button 
                        onClick={() => handleShowResultModal(booking)} 
                        className="text-purple-600 hover:text-purple-900" 
                        title="Nhập kết quả"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    )}
                    
                    <select
                      value={booking.status}
                      onChange={e => onUpdateLabBookingStatus(booking.id, e.target.value as LabBooking['status'])}
                      className="border rounded px-2 py-1 text-xs"
                    >
                      {statusOptions.map(option => (
                        <option key={option} value={option}>{getStatusText(option)}</option>
                      ))}
                    </select>
                    
                    <button className="text-blue-600 hover:text-blue-900" title="Xem chi tiết" onClick={() => handleShowDetail(booking)}>
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal chi tiết */}
      {showDetailModal && selectedBooking && (
        <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="Thông tin chi tiết lịch xét nghiệm">
          <div className="p-4 max-w-md">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" /> Thông tin chi tiết lịch xét nghiệm
            </h2>
            
            <div className="mb-4">
              <h3 className="font-semibold text-gray-700 mb-2">Thông tin bệnh nhân</h3>
              {loadingPatient ? (
                <div className="text-gray-500 text-sm">Đang tải thông tin bệnh nhân...</div>
              ) : patientDetail ? (
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2"><User className="w-4 h-4 text-gray-400" /> <span>{patientDetail.fullName}</span></div>
                  <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /> <span>{patientDetail.email}</span></div>
                  <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /> <span>{patientDetail.phoneNumber}</span></div>
                  {patientDetail.address && <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /> <span>{patientDetail.address}</span></div>}
                </div>
              ) : (
                <div className="text-gray-500 text-sm">Không tìm thấy thông tin bệnh nhân.</div>
              )}
            </div>
            
            <div className="mb-4">
              <h3 className="font-semibold text-gray-700 mb-2">Dịch vụ xét nghiệm</h3>
              {loadingTestType ? (
                <div className="text-gray-500 text-sm">Đang tải thông tin dịch vụ...</div>
              ) : (
                (() => {
                  const testType = getTestTypeDetail(selectedBooking);
                  return testType ? (
                    <div className="space-y-1 text-sm">
                      <div><strong>Tên xét nghiệm:</strong> {testType.name}</div>
                      <div><strong>Mô tả:</strong> {testType.description}</div>
                      <div><strong>Giá:</strong> {testType.price?.toLocaleString('vi-VN')} VNĐ</div>
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm">Không tìm thấy thông tin dịch vụ.</div>
                  );
                })()
              )}
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <ClipboardList className="w-4 h-4" /> Kết quả xét nghiệm
              </h3>
              {loadingResults ? (
                <div className="text-gray-500 text-sm">Đang tải kết quả xét nghiệm...</div>
              ) : labResults.length > 0 ? (
                <div className="space-y-2">
                  {labResults.map((result, index) => (
                    <div key={result.id} className="border rounded p-2 text-sm">
                      <div><strong>Kết quả:</strong> {result.resultValue} {result.unit}</div>
                      {result.normalRange && <div><strong>Khoảng bình thường:</strong> {result.normalRange}</div>}
                      {result.notes && <div><strong>Ghi chú:</strong> {result.notes}</div>}
                      <div><strong>Ngày xét nghiệm:</strong> {result.testDate}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-sm">Chưa có kết quả xét nghiệm.</div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Modal nhập kết quả xét nghiệm */}
      {showResultModal && selectedBooking && (
        <Modal isOpen={showResultModal} onClose={() => setShowResultModal(false)} title="Nhập kết quả xét nghiệm">
          <div className="p-4 max-w-md">
            <h2 className="text-xl font-bold mb-4">Nhập kết quả xét nghiệm</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kết quả *
                </label>
                <input
                  type="text"
                  value={resultForm.resultValue}
                  onChange={(e) => setResultForm({...resultForm, resultValue: e.target.value})}
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
                  value={resultForm.unit}
                  onChange={(e) => setResultForm({...resultForm, unit: e.target.value})}
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
                  value={resultForm.normalRange}
                  onChange={(e) => setResultForm({...resultForm, normalRange: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: 70-100 mg/dL"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú
                </label>
                <textarea
                  value={resultForm.notes}
                  onChange={(e) => setResultForm({...resultForm, notes: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ghi chú về kết quả xét nghiệm"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowResultModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitResult}
                disabled={!resultForm.resultValue}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Lưu kết quả
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default LabBookingManagement; 