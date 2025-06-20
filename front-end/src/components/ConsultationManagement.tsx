import React from 'react';
import { User, Activity, Calendar, Edit, Trash, Check, X, Eye } from 'lucide-react';

interface Consultation {
  id: number;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  date: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  type: string;
  notes?: string;
  patientAddress?: string;
}

interface ConsultationManagementProps {
  consultations: Consultation[];
  onConfirmConsultation: (id: number) => void;
  onCancelConsultation: (id: number) => void;
}

const ConsultationManagement: React.FC<ConsultationManagementProps> = ({ consultations, onConfirmConsultation, onCancelConsultation }) => {
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

  return (
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
                    <div className="text-sm font-medium text-gray-900">{consultation.patientName}</div>
                    <div className="text-sm text-gray-500">{consultation.patientEmail}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{consultation.date}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{consultation.type}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(consultation.status)}`}>{getStatusText(consultation.status)}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-2">
                  {consultation.status === 'SCHEDULED' && (
                    <>
                      <button onClick={() => onConfirmConsultation(consultation.id)} className="text-green-600 hover:text-green-900" title="Duyệt">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => onCancelConsultation(consultation.id)} className="text-red-600 hover:text-red-900" title="Hủy">
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <button className="text-blue-600 hover:text-blue-900" title="Xem chi tiết">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ConsultationManagement; 