import React, { useState } from 'react';
import { X, Edit2, Save, Calendar, Clock, User, Video, FileText, Phone, Mail } from 'lucide-react';

interface ConsultationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultation: any;
  onUpdate: (consultationId: string, updatedData: any) => void;
}

const ConsultationDetailModal: React.FC<ConsultationDetailModalProps> = ({
  isOpen,
  onClose,
  consultation,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    notes: consultation?.notes || '',
    status: consultation?.status || 'pending',
    meetingLink: consultation?.meetingLink || ''
  });

  const handleInputChange = (field: string, value: string) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onUpdate(consultation.id, editedData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData({
      notes: consultation?.notes || '',
      status: consultation?.status || 'pending',
      meetingLink: consultation?.meetingLink || ''
    });
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
      case 'canceled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'Chưa xác nhận',
      confirmed: 'Đã xác nhận',
      completed: 'Đã hoàn thành',
      cancelled: 'Đã hủy',
      canceled: 'Đã hủy'
    };
    return statusMap[status.toLowerCase()] || status;
  };

  if (!isOpen || !consultation) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Chi tiết lịch tư vấn</h2>
          <div className="flex items-center space-x-2">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                <span>Chỉnh sửa</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Patient Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Thông tin bệnh nhân</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Tên bệnh nhân</p>
                <p className="font-medium text-gray-900">{consultation.patientName || 'Không rõ'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">ID bệnh nhân</p>
                <p className="font-medium text-gray-900">{consultation.patientId || 'Không rõ'}</p>
              </div>
              {consultation.patientPhone && (
                <div>
                  <p className="text-sm text-gray-600">Số điện thoại</p>
                  <p className="font-medium text-gray-900 flex items-center space-x-1">
                    <Phone className="w-4 h-4" />
                    <span>{consultation.patientPhone}</span>
                  </p>
                </div>
              )}
              {consultation.patientEmail && (
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900 flex items-center space-x-1">
                    <Mail className="w-4 h-4" />
                    <span>{consultation.patientEmail}</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Consultation Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Thông tin lịch tư vấn</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Loại tư vấn</p>
                <p className="font-medium text-gray-900">{consultation.consultationType || 'Không rõ'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Trạng thái</p>
                {isEditing ? (
                  <select
                    value={editedData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="pending">Chưa xác nhận</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="completed">Đã hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                ) : (
                  <span className={`inline-flex px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(consultation.status)}`}>
                    {getStatusText(consultation.status)}
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600">Ngày tư vấn</p>
                <p className="font-medium text-gray-900 flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{consultation.startTime ? new Date(consultation.startTime).toLocaleDateString('vi-VN') : 'Không rõ'}</span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Thời gian</p>
                <p className="font-medium text-gray-900 flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>
                    {consultation.startTime ? new Date(consultation.startTime).toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'Không rõ'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Meeting Link */}
          {consultation.meetingLink && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-blue-900 mb-3 flex items-center space-x-2">
                <Video className="w-5 h-5" />
                <span>Link cuộc họp</span>
              </h3>
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editedData.meetingLink}
                    onChange={(e) => handleInputChange('meetingLink', e.target.value)}
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập link cuộc họp"
                  />
                  <p className="text-sm text-blue-600">Có thể cập nhật link cuộc họp nếu cần</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <a
                    href={consultation.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline break-all"
                  >
                    {consultation.meetingLink}
                  </a>
                  <button
                    onClick={() => window.open(consultation.meetingLink, '_blank')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Tham gia cuộc họp
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Ghi chú</span>
            </h3>
            {isEditing ? (
              <textarea
                value={editedData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={4}
                placeholder="Nhập ghi chú về buổi tư vấn..."
              />
            ) : (
              <p className="text-gray-700">
                {consultation.notes || 'Chưa có ghi chú cho buổi tư vấn này'}
              </p>
            )}
          </div>

          {/* Additional Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Thông tin bổ sung</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">ID lịch tư vấn</p>
                <p className="font-medium text-gray-900">{consultation.id}</p>
              </div>
              <div>
                <p className="text-gray-600">Ngày tạo</p>
                <p className="font-medium text-gray-900">
                  {consultation.createdAt ? new Date(consultation.createdAt).toLocaleString('vi-VN') : 'Không rõ'}
                </p>
              </div>
              {consultation.updatedAt && (
                <div>
                  <p className="text-gray-600">Cập nhật lần cuối</p>
                  <p className="font-medium text-gray-900">
                    {new Date(consultation.updatedAt).toLocaleString('vi-VN')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        {isEditing && (
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-1"
            >
              <Save className="w-4 h-4" />
              <span>Lưu thay đổi</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultationDetailModal; 