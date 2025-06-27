import React, { useState } from 'react';
import { User, Activity, Calendar, Edit, Trash, Check, X, Eye, MessageSquare } from 'lucide-react';
import Modal from './Modal';
import { consultationService } from '../services/api';
import { OnlineConsultation } from '../types';

interface ConsultationManagementProps {
  consultations: OnlineConsultation[];
  onConfirmConsultation: (id: number) => void;
  onCancelConsultation: (id: number) => void;
  onUpdateConsultationStatus: (id: number, status: string) => void;
}

const ConsultationManagement: React.FC<ConsultationManagementProps> = ({ 
  consultations, 
  onConfirmConsultation, 
  onCancelConsultation,
  onUpdateConsultationStatus 
}) => {
  const [selectedConsultation, setSelectedConsultation] = useState<OnlineConsultation | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notes, setNotes] = useState('');

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'Scheduled': 'bg-yellow-100 text-yellow-800',
      'Confirmed': 'bg-blue-100 text-blue-800',
      'Completed': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts: { [key: string]: string } = {
      'Scheduled': 'Đã lên lịch',
      'Confirmed': 'Đã xác nhận',
      'Completed': 'Hoàn thành',
      'Cancelled': 'Đã hủy'
    };
    return texts[status] || status;
  };

  const statusOptions = ['Scheduled', 'Confirmed', 'Completed', 'Cancelled'];

  const handleShowDetail = (consultation: OnlineConsultation) => {
    setSelectedConsultation(consultation);
    setShowDetailModal(true);
  };

  const handleShowNotesModal = (consultation: OnlineConsultation) => {
    setSelectedConsultation(consultation);
    setNotes(consultation.notes || '');
    setShowNotesModal(true);
  };

  const handleUpdateNotes = async () => {
    if (!selectedConsultation) return;
    
    try {
      await consultationService.updateOnlineConsultation(selectedConsultation.id, {
        ...selectedConsultation,
        notes: notes
      });
      setShowNotesModal(false);
      // Refresh data
      window.location.reload();
    } catch (error) {
      console.error('Error updating consultation notes:', error);
      alert('Có lỗi xảy ra khi cập nhật ghi chú');
    }
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
            {consultations.map((consultation) => (
              <tr key={consultation.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {consultation.appointment.patient?.fullName || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {consultation.appointment.patient?.email || 'N/A'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {consultation.startTime ? new Date(consultation.startTime).toLocaleDateString('vi-VN') : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {consultation.consultationType.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(consultation.appointment.status)}`}>
                    {getStatusText(consultation.appointment.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    {consultation.appointment.status === 'Scheduled' && (
                      <>
                        <button onClick={() => onConfirmConsultation(consultation.id)} className="text-green-600 hover:text-green-900" title="Duyệt">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => onCancelConsultation(consultation.id)} className="text-red-600 hover:text-red-900" title="Hủy">
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    
                    <button 
                      onClick={() => handleShowNotesModal(consultation)} 
                      className="text-purple-600 hover:text-purple-900" 
                      title="Cập nhật ghi chú"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    
                    <select
                      value={consultation.appointment.status}
                      onChange={e => onUpdateConsultationStatus(consultation.id, e.target.value)}
                      className="border rounded px-2 py-1 text-xs"
                    >
                      {statusOptions.map(option => (
                        <option key={option} value={option}>{getStatusText(option)}</option>
                      ))}
                    </select>
                    
                    <button className="text-blue-600 hover:text-blue-900" title="Xem chi tiết" onClick={() => handleShowDetail(consultation)}>
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
      {showDetailModal && selectedConsultation && (
        <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="Thông tin chi tiết lịch tư vấn">
          <div className="p-4 max-w-md">
            <h2 className="text-xl font-bold mb-4">Thông tin chi tiết lịch tư vấn</h2>
            
            <div className="mb-4">
              <h3 className="font-semibold text-gray-700 mb-2">Thông tin bệnh nhân</h3>
              <div className="space-y-1 text-sm">
                <div><strong>Tên:</strong> {selectedConsultation.appointment.patient?.fullName || 'N/A'}</div>
                <div><strong>Email:</strong> {selectedConsultation.appointment.patient?.email || 'N/A'}</div>
                <div><strong>SĐT:</strong> {selectedConsultation.appointment.patient?.phoneNumber || 'N/A'}</div>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="font-semibold text-gray-700 mb-2">Thông tin tư vấn</h3>
              <div className="space-y-1 text-sm">
                <div><strong>Loại tư vấn:</strong> {selectedConsultation.consultationType.name}</div>
                <div><strong>Bác sĩ:</strong> {selectedConsultation.appointment.doctor?.fullName || 'N/A'}</div>
                <div><strong>Thời gian bắt đầu:</strong> {selectedConsultation.startTime ? new Date(selectedConsultation.startTime).toLocaleString('vi-VN') : 'N/A'}</div>
                <div><strong>Thời gian kết thúc:</strong> {selectedConsultation.endTime ? new Date(selectedConsultation.endTime).toLocaleString('vi-VN') : 'N/A'}</div>
                <div><strong>Trạng thái:</strong> {getStatusText(selectedConsultation.appointment.status)}</div>
                {selectedConsultation.meetingLink && (
                  <div><strong>Link meeting:</strong> {selectedConsultation.meetingLink}</div>
                )}
              </div>
            </div>

            {selectedConsultation.notes && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">Ghi chú</h3>
                <div className="text-sm text-gray-600 bg-gray-50 rounded p-2">
                  {selectedConsultation.notes}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Modal cập nhật ghi chú */}
      {showNotesModal && selectedConsultation && (
        <Modal isOpen={showNotesModal} onClose={() => setShowNotesModal(false)} title="Cập nhật ghi chú">
          <div className="p-4 max-w-md">
            <h2 className="text-xl font-bold mb-4">Cập nhật ghi chú</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ghi chú
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập ghi chú cho lịch tư vấn"
                rows={4}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowNotesModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateNotes}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ConsultationManagement; 