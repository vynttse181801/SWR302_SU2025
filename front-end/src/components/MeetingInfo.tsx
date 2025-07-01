import React from 'react';
import { Video, Copy, ExternalLink, Calendar, Clock, User } from 'lucide-react';

interface MeetingInfoProps {
  meetingLink: string;
  doctorName: string;
  patientName: string;
  date: string;
  time: string;
  status?: string;
}

const MeetingInfo: React.FC<MeetingInfoProps> = ({
  meetingLink,
  doctorName,
  patientName,
  date,
  time,
  status = 'Scheduled'
}) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(meetingLink);
    // Có thể thêm toast notification ở đây
    alert('Đã sao chép link vào clipboard!');
  };

  const joinMeeting = () => {
    window.open(meetingLink, '_blank');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Video className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Thông tin cuộc họp</h3>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
          {status}
        </span>
      </div>

      <div className="space-y-4">
        {/* Thông tin cơ bản */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              <strong>Bác sĩ:</strong> {doctorName}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              <strong>Bệnh nhân:</strong> {patientName}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              <strong>Ngày:</strong> {date}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              <strong>Thời gian:</strong> {time}
            </span>
          </div>
        </div>

        {/* Link meeting */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center space-x-2">
            <Video className="w-4 h-4" />
            <span>Link tham gia cuộc họp</span>
          </h4>
          
          <div className="flex items-center space-x-2 mb-3">
            <input
              type="text"
              value={meetingLink}
              readOnly
              className="flex-1 p-2 text-sm border border-blue-300 rounded bg-white"
            />
            <button
              onClick={copyToClipboard}
              className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              title="Sao chép link"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          
          <button
            onClick={joinMeeting}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Tham gia cuộc họp</span>
          </button>
        </div>

        {/* Hướng dẫn */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h5 className="font-medium text-gray-900 mb-2">Hướng dẫn tham gia:</h5>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Đảm bảo bạn có kết nối internet ổn định</li>
            <li>• Kiểm tra camera và microphone trước khi tham gia</li>
            <li>• Tham gia sớm 5-10 phút để kiểm tra thiết bị</li>
            <li>• Chuẩn bị các câu hỏi và triệu chứng cần tư vấn</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MeetingInfo; 