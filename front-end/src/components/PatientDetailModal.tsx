import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { labResultService } from '../services/api';
import api from '../services/api';

interface LabResult {
  id: string;
  testType: { name: string };
  resultValue: string;
  normalRange?: string;
  createdAt: string;
  [key: string]: any;
}

interface TreatmentPlan {
  id: string;
  arvProtocol: { name: string; description?: string };
  doctor?: { name?: string };
  startDate: string;
  endDate?: string;
  notes?: string;
}

interface PatientDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: {
    id: string;
    name: string;
    age: number;
    gender: string;
    lastVisit?: string;
    nextAppointment?: string;
    status?: string;
    avatar?: string;
    address?: string;
    phone?: string;
    email?: string;
    [key: string]: any;
  } | null;
}

const PatientDetailModal: React.FC<PatientDetailModalProps> = ({ isOpen, onClose, patient }) => {
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);

  useEffect(() => {
    if (isOpen && patient?.id) {
      setLoading(true);
      labResultService.getLabResultsByPatient(patient.id)
        .then(res => setLabResults(res.data || []))
        .catch(() => setLabResults([]))
        .finally(() => setLoading(false));
      setLoadingPlans(true);
      api.get(`/patient-treatment-plans?patientId=${patient.id}`)
        .then(res => setTreatmentPlans(res.data || []))
        .catch(() => setTreatmentPlans([]))
        .finally(() => setLoadingPlans(false));
    } else {
      setLabResults([]);
      setTreatmentPlans([]);
    }
  }, [isOpen, patient]);

  if (!patient) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Thông tin chi tiết bệnh nhân`}>
      <div className="flex flex-col items-center gap-4">
        {patient.avatar && (
          <img src={patient.avatar} alt="avatar" className="w-24 h-24 rounded-full object-cover border" />
        )}
        <h2 className="text-xl font-bold text-primary-700 mb-2">{patient.name}</h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 w-full max-w-md">
          <div className="text-gray-600">Mã bệnh nhân:</div>
          <div className="font-medium">{patient.patientId || patient.id}</div>
          <div className="text-gray-600">Tuổi:</div>
          <div className="font-medium">{patient.age}</div>
          <div className="text-gray-600">Giới tính:</div>
          <div className="font-medium">{patient.gender === 'male' ? 'Nam' : 'Nữ'}</div>
          {patient.address && <><div className="text-gray-600">Địa chỉ:</div><div className="font-medium">{patient.address}</div></>}
          {patient.phone && <><div className="text-gray-600">SĐT:</div><div className="font-medium">{patient.phone}</div></>}
          {patient.email && <><div className="text-gray-600">Email:</div><div className="font-medium">{patient.email}</div></>}
          {patient.lastVisit && <><div className="text-gray-600">Lần khám gần nhất:</div><div className="font-medium">{patient.lastVisit}</div></>}
          {patient.nextAppointment && <><div className="text-gray-600">Lịch hẹn tiếp theo:</div><div className="font-medium">{patient.nextAppointment}</div></>}
          {patient.status && <><div className="text-gray-600">Trạng thái:</div><div className="font-medium">{patient.status === 'active' ? 'Đang điều trị' : 'Ngừng điều trị'}</div></>}
        </div>
        <div className="w-full mt-6">
          <h3 className="text-lg font-semibold text-primary-700 mb-2">Phác đồ ARV của bệnh nhân</h3>
          {loadingPlans ? (
            <p>Đang tải...</p>
          ) : treatmentPlans.length === 0 ? (
            <p className="text-gray-500 italic">Chưa có phác đồ ARV</p>
          ) : (
            <div className="overflow-x-auto rounded-xl shadow border border-gray-200 my-4">
              <table className="min-w-full text-sm bg-white rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700">
                    <th className="px-4 py-2 border-b text-center font-semibold">Ngày bắt đầu</th>
                    <th className="px-4 py-2 border-b text-center font-semibold">Phác đồ</th>
                    <th className="px-4 py-2 border-b text-center font-semibold">Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {treatmentPlans.map((plan, idx) => (
                    <tr key={plan.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border-b px-4 py-2 text-center">{new Date(plan.startDate).toLocaleDateString('vi-VN')}</td>
                      <td className="border-b px-4 py-2">{plan.arvProtocol?.name || ''}</td>
                      <td className="border-b px-4 py-2">{plan.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="w-full mt-6">
          <h3 className="text-lg font-semibold text-primary-700 mb-2">Lịch sử xét nghiệm</h3>
          {loading ? (
            <p>Đang tải...</p>
          ) : labResults.length === 0 ? (
            <p className="text-gray-500 italic">Chưa có kết quả xét nghiệm</p>
          ) : (
            <div className="overflow-x-auto rounded-xl shadow border border-gray-200 my-4">
              <table className="min-w-full text-sm bg-white rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700">
                    <th className="px-4 py-2 border-b text-center font-semibold">Ngày</th>
                    <th className="px-4 py-2 border-b text-center font-semibold">Loại xét nghiệm</th>
                    <th className="px-4 py-2 border-b text-center font-semibold">Kết quả</th>
                    <th className="px-4 py-2 border-b text-center font-semibold">Khoảng bình thường</th>
                  </tr>
                </thead>
                <tbody>
                  {labResults.map((result, idx) => (
                    <tr key={result.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border-b px-4 py-2 text-center">{new Date(result.createdAt).toLocaleDateString('vi-VN')}</td>
                      <td className="border-b px-4 py-2">{result.testType?.name || ''}</td>
                      <td className="border-b px-4 py-2">{result.resultValue}</td>
                      <td className="border-b px-4 py-2">{result.normalRange || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default PatientDetailModal; 