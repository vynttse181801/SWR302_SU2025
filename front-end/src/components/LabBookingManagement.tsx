import React, { useState } from 'react';
import { User, FileText, Calendar, Edit, Trash, Check, X, Eye, Mail, Phone, MapPin, Info } from 'lucide-react';
import Modal from './Modal';
import { testService, staffService } from '../services/api';
import { LabTestType } from '../types';

interface LabBooking {
  id: number;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  date: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  type: string;
  notes?: string;
  patientAddress?: string;
  testTypeId?: number;
  patientId?: number;
}

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
  const [testTypes, setTestTypes] = useState<LabTestType[]>([]);
  const [loadingTestType, setLoadingTestType] = useState(false);
  const [patientDetail, setPatientDetail] = useState<PatientDetail | null>(null);
  const [loadingPatient, setLoadingPatient] = useState(false);

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'SCHEDULED': 'bg-yellow-100 text-yellow-800',
      'CONFIRMED': 'bg-blue-100 text-blue-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts: { [key: string]: string } = {
      'SCHEDULED': 'Đã lên lịch',
      'CONFIRMED': 'Đã xác nhận',
      'COMPLETED': 'Hoàn thành',
      'CANCELLED': 'Đã hủy'
    };
    return texts[status] || status;
  };

  const statusOptions: LabBooking['status'][] = ['SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

  const handleShowDetail = async (booking: LabBooking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
    setLoadingTestType(true);
    setLoadingPatient(true);
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
  };

  const getTestTypeDetail = (booking: LabBooking) => {
    if (!booking) return null;
    if (booking.testTypeId && testTypes.length > 0) {
      return testTypes.find(t => t.id === booking.testTypeId);
    }
    // fallback: match by name
    return testTypes.find(t => t.name === booking.type);
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.type}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>{getStatusText(booking.status)}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    {booking.status === 'SCHEDULED' && (
                      <>
                        <button onClick={() => onConfirmLabBooking(booking.id)} className="text-green-600 hover:text-green-900" title="Duyệt">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => onCancelLabBooking(booking.id)} className="text-red-600 hover:text-red-900" title="Hủy">
                          <X className="w-4 h-4" />
                        </button>
                      </>
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
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Info className="w-5 h-5 text-blue-500" /> Thông tin chi tiết lịch xét nghiệm</h2>
            <div className="mb-4">
              <h3 className="font-semibold text-gray-700 mb-2">Thông tin bệnh nhân</h3>
              {loadingPatient ? (
                <div className="text-gray-500 text-sm">Đang tải thông tin bệnh nhân...</div>
              ) : patientDetail ? (
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2"><User className="w-4 h-4 text-gray-400" /> <span>{patientDetail.fullName}</span></div>
                  <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /> <span>{patientDetail.email}</span></div>
                  <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /> <span>{patientDetail.phoneNumber}</span></div>
                  {patientDetail.dateOfBirth && <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400" /> <span>Ngày sinh: {patientDetail.dateOfBirth}</span></div>}
                  {patientDetail.gender && <div className="flex items-center gap-2"><Info className="w-4 h-4 text-gray-400" /> <span>Giới tính: {patientDetail.gender}</span></div>}
                  {patientDetail.address && <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /> <span>{patientDetail.address}</span></div>}
                  {patientDetail.medicalRecordNumber && <div className="flex items-center gap-2"><Info className="w-4 h-4 text-gray-400" /> <span>Mã hồ sơ: {patientDetail.medicalRecordNumber}</span></div>}
                  {patientDetail.patientCode && <div className="flex items-center gap-2"><Info className="w-4 h-4 text-gray-400" /> <span>Mã bệnh nhân: {patientDetail.patientCode}</span></div>}
                  {patientDetail.bloodType && <div className="flex items-center gap-2"><Info className="w-4 h-4 text-gray-400" /> <span>Nhóm máu: {patientDetail.bloodType}</span></div>}
                  {patientDetail.emergencyContact && <div className="flex items-center gap-2"><Info className="w-4 h-4 text-gray-400" /> <span>Liên hệ khẩn cấp: {patientDetail.emergencyContact}</span></div>}
                  {patientDetail.emergencyPhone && <div className="flex items-center gap-2"><Info className="w-4 h-4 text-gray-400" /> <span>SĐT khẩn cấp: {patientDetail.emergencyPhone}</span></div>}
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
                  if (!testType) return <div className="text-gray-500 text-sm">Không tìm thấy thông tin dịch vụ.</div>;
                  return (
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-gray-400" /> <span className="font-medium">{testType.name}</span></div>
                      <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400" /> <span>Giá: {testType.price?.toLocaleString()} VNĐ</span></div>
                      <div className="flex items-center gap-2"><Info className="w-4 h-4 text-gray-400" /> <span>{testType.description}</span></div>
                      <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400" /> <span>Thời lượng: {testType.durationMinutes} phút</span></div>
                    </div>
                  );
                })()
              )}
            </div>
            {selectedBooking.notes && (
              <div className="mb-2">
                <h3 className="font-semibold text-gray-700 mb-2">Ghi chú</h3>
                <div className="text-sm text-gray-600 bg-gray-50 rounded p-2">{selectedBooking.notes}</div>
              </div>
            )}
            <div className="flex justify-end mt-4">
              <button onClick={() => setShowDetailModal(false)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Đóng</button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default LabBookingManagement; 