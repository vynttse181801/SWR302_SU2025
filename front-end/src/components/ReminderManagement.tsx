import React, { useState } from 'react';
import { Bell, Calendar, FileText, Clock, User, Plus, Edit, Trash, Send, Check, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

interface Reminder {
  id: number;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  type: 'MEDICATION' | 'FOLLOW_UP' | 'TEST' | 'APPOINTMENT';
  message: string;
  dueDate: string;
  dueTime?: string;
  status: 'PENDING' | 'SENT' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  notes?: string;
}

interface ReminderManagementProps {
  reminders: Reminder[];
  onSendReminder: (id: number) => void;
  onCompleteReminder: (id: number) => void;
  onUpdateReminder: (id: number, data: Partial<Reminder>) => void;
  onDeleteReminder: (id: number) => void;
  onCreateReminder: (data: Omit<Reminder, 'id'>) => void;
}

const ReminderManagement: React.FC<ReminderManagementProps> = ({
  reminders,
  onSendReminder,
  onCompleteReminder,
  onUpdateReminder,
  onDeleteReminder,
  onCreateReminder
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);
  const [formData, setFormData] = useState<Partial<Reminder>>({});

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'SENT': 'bg-blue-100 text-blue-800',
      'COMPLETED': 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts: { [key: string]: string } = {
      'PENDING': 'Chờ xử lý',
      'SENT': 'Đã gửi',
      'COMPLETED': 'Hoàn thành'
    };
    return texts[status] || status;
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      'LOW': 'bg-green-100 text-green-800',
      'MEDIUM': 'bg-yellow-100 text-yellow-800',
      'HIGH': 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityText = (priority: string) => {
    const texts: { [key: string]: string } = {
      'LOW': 'Thấp',
      'MEDIUM': 'Trung bình',
      'HIGH': 'Cao'
    };
    return texts[priority] || priority;
  };

  const getReminderTypeIcon = (type: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      'MEDICATION': <Bell className="w-4 h-4" />,
      'FOLLOW_UP': <Calendar className="w-4 h-4" />,
      'TEST': <FileText className="w-4 h-4" />,
      'APPOINTMENT': <Clock className="w-4 h-4" />
    };
    return icons[type] || <Bell className="w-4 h-4" />;
  };

  const getReminderTypeText = (type: string) => {
    const texts: { [key: string]: string } = {
      'MEDICATION': 'Thuốc',
      'FOLLOW_UP': 'Tái khám',
      'TEST': 'Xét nghiệm',
      'APPOINTMENT': 'Lịch hẹn'
    };
    return texts[type] || type;
  };

  const handleCreate = () => {
    setFormData({
      type: 'MEDICATION',
      priority: 'MEDIUM',
      status: 'PENDING'
    });
    setIsCreateModalOpen(true);
  };

  const handleEdit = (reminder: Reminder) => {
    setSelectedReminder(reminder);
    setFormData({
      type: reminder.type,
      message: reminder.message,
      dueDate: reminder.dueDate,
      dueTime: reminder.dueTime,
      priority: reminder.priority,
      notes: reminder.notes
    });
    setIsEditModalOpen(true);
  };

  const handleSave = () => {
    if (isCreateModalOpen) {
      onCreateReminder(formData as Omit<Reminder, 'id'>);
      toast.success('Tạo nhắc nhở thành công!');
    } else if (isEditModalOpen && selectedReminder) {
      onUpdateReminder(selectedReminder.id, formData);
      toast.success('Cập nhật nhắc nhở thành công!');
    }
    
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedReminder(null);
    setFormData({});
  };

  const handleSend = (id: number) => {
    onSendReminder(id);
  };

  const handleComplete = (id: number) => {
    onCompleteReminder(id);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhắc nhở này?')) {
      onDeleteReminder(id);
      toast.success('Đã xóa nhắc nhở!');
    }
  };

  const isOverdue = (dueDate: string, dueTime?: string) => {
    const now = new Date();
    const due = new Date(dueDate + (dueTime ? `T${dueTime}` : ''));
    return now > due;
  };

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Quản lý nhắc nhở</h2>
        <button
          onClick={handleCreate}
          className="btn-gradient-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo nhắc nhở</span>
        </button>
      </div>

      {/* Reminders List */}
      <div className="space-y-4">
        {reminders.map((reminder) => (
          <div 
            key={reminder.id} 
            className={`bg-white border rounded-lg p-6 hover:shadow-md transition-shadow ${
              isOverdue(reminder.dueDate, reminder.dueTime) && reminder.status !== 'COMPLETED'
                ? 'border-red-200 bg-red-50'
                : 'border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  isOverdue(reminder.dueDate, reminder.dueTime) && reminder.status !== 'COMPLETED'
                    ? 'bg-red-100'
                    : 'bg-orange-100'
                }`}>
                  {getReminderTypeIcon(reminder.type)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-gray-900">{reminder.patientName}</h3>
                    {isOverdue(reminder.dueDate, reminder.dueTime) && reminder.status !== 'COMPLETED' && (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{reminder.message}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-xs text-gray-500">
                      Loại: {getReminderTypeText(reminder.type)}
                    </span>
                    <span className="text-xs text-gray-500">
                      Hạn: {reminder.dueDate} {reminder.dueTime && reminder.dueTime}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(reminder.priority)}`}>
                      {getPriorityText(reminder.priority)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(reminder.status)}`}>
                  {getStatusText(reminder.status)}
                </span>
                <div className="flex items-center space-x-2">
                  {reminder.status === 'PENDING' && (
                    <button
                      onClick={() => handleSend(reminder.id)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
                    >
                      <Send className="w-4 h-4" />
                      <span>Gửi</span>
                    </button>
                  )}
                  {reminder.status === 'SENT' && (
                    <button
                      onClick={() => handleComplete(reminder.id)}
                      className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center space-x-1"
                    >
                      <Check className="w-4 h-4" />
                      <span>Hoàn thành</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(reminder)}
                    className="text-indigo-600 hover:text-indigo-800"
                    title="Chỉnh sửa"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(reminder.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Xóa"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            {reminder.notes && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">{reminder.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {(isCreateModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {isCreateModalOpen ? 'Tạo nhắc nhở mới' : 'Chỉnh sửa nhắc nhở'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loại nhắc nhở</label>
                  <select
                    value={formData.type || ''}
                    onChange={(e) => setFormData({...formData, type: e.target.value as Reminder['type']})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="MEDICATION">Thuốc</option>
                    <option value="FOLLOW_UP">Tái khám</option>
                    <option value="TEST">Xét nghiệm</option>
                    <option value="APPOINTMENT">Lịch hẹn</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tin nhắn</label>
                  <textarea
                    value={formData.message || ''}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập nội dung nhắc nhở..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày hạn</label>
                  <input
                    type="date"
                    value={formData.dueDate || ''}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giờ hạn (tùy chọn)</label>
                  <input
                    type="time"
                    value={formData.dueTime || ''}
                    onChange={(e) => setFormData({...formData, dueTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mức độ ưu tiên</label>
                  <select
                    value={formData.priority || ''}
                    onChange={(e) => setFormData({...formData, priority: e.target.value as Reminder['priority']})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="LOW">Thấp</option>
                    <option value="MEDIUM">Trung bình</option>
                    <option value="HIGH">Cao</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú (tùy chọn)</label>
                  <textarea
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ghi chú bổ sung..."
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setIsEditModalOpen(false);
                    setSelectedReminder(null);
                    setFormData({});
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {isCreateModalOpen ? 'Tạo' : 'Lưu'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReminderManagement; 