import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { User } from '../types/index';
import { useModal } from '../hooks/useModal';
import Modal from '../components/Modal';
import { FaUserSlash } from 'react-icons/fa';

// Define Doctor type - this should ideally come from a central types file
export type Doctor = {
  id: number;
  user: User; // Assuming doctor is linked to a user
  specialty: string;
  maxAppointmentsPerDay: number;
  notes: string;
  status: string;
};

// Placeholder for DoctorForm - will create a dedicated component later if needed
interface DoctorFormProps {
  doctor?: Doctor;
  onSave: (doctorData: Omit<Doctor, 'id' | 'user'> & { userId: number }) => void;
  onCancel: () => void;
}

interface DoctorFormData {
  userId: number;
  specialty: string;
  maxAppointmentsPerDay: number;
  notes: string;
  status: string;
}

const DoctorForm: React.FC<DoctorFormProps> = ({ doctor, onSave, onCancel }) => {
  const [formData, setFormData] = useState<DoctorFormData>({
    userId: doctor?.user.id || 0,
    specialty: doctor?.specialty || '',
    maxAppointmentsPerDay: doctor?.maxAppointmentsPerDay || 0,
    notes: doctor?.notes || '',
    status: doctor?.status || 'ACTIVE',
  });

  useEffect(() => {
    if (doctor) {
      setFormData({
        userId: doctor.user.id,
        specialty: doctor.specialty,
        maxAppointmentsPerDay: doctor.maxAppointmentsPerDay,
        notes: doctor.notes,
        status: doctor.status || 'ACTIVE',
      });
    }
  }, [doctor]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'userId' || name === 'maxAppointmentsPerDay' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="mb-4">
        <label htmlFor="userId" className="block text-gray-700 text-sm font-bold mb-2">User ID:</label>
        <input
          type="number"
          id="userId"
          name="userId"
          value={formData.userId}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="specialty" className="block text-gray-700 text-sm font-bold mb-2">Specialty:</label>
        <input
          type="text"
          id="specialty"
          name="specialty"
          value={formData.specialty}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="maxAppointmentsPerDay" className="block text-gray-700 text-sm font-bold mb-2">Max Appointments Per Day:</label>
        <input
          type="number"
          id="maxAppointmentsPerDay"
          name="maxAppointmentsPerDay"
          value={formData.maxAppointmentsPerDay}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="notes" className="block text-gray-700 text-sm font-bold mb-2">Notes:</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {doctor ? 'Save Changes' : 'Add Doctor'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const DoctorPage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { modalState, showModal, hideModal } = useModal();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | undefined>(undefined);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/doctors');
      setDoctors(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error fetching doctors.');
      toast.error(err.response?.data?.message || 'Error fetching doctors.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDoctor = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await api.delete(`/doctors/${id}`);
        toast.success('Doctor deleted successfully!');
        fetchDoctors();
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Error deleting doctor.');
      }
    }
  };

  const handleDeactivateDoctor = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn ngừng hoạt động bác sĩ này?')) {
      try {
        await api.patch(`/doctors/${id}/deactivate`);
        toast.success('Đã ngừng hoạt động bác sĩ!');
        fetchDoctors();
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Lỗi khi ngừng hoạt động bác sĩ.');
      }
    }
  };

  const handleAddEditDoctor = (doctor?: Doctor) => {
    setEditingDoctor(doctor);
    setIsFormModalOpen(true);
  };

  const handleSaveDoctor = async (doctorData: Omit<Doctor, 'id' | 'user'> & { userId: number }) => {
    try {
      if (editingDoctor) {
        // Update existing doctor
        await api.put(`/doctors/${editingDoctor.id}`, { ...doctorData, user: { id: doctorData.userId }, status: editingDoctor.status });
        toast.success('Doctor updated successfully!');
      } else {
        // Add new doctor
        await api.post('/doctors', { ...doctorData, user: { id: doctorData.userId }, status: 'ACTIVE' });
        toast.success('Doctor added successfully!');
      }
      setIsFormModalOpen(false);
      setEditingDoctor(undefined);
      fetchDoctors();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error saving doctor.');
    }
  };

  const handleCancelForm = () => {
    setIsFormModalOpen(false);
    setEditingDoctor(undefined);
  };

  if (loading) return <div className="text-center py-10">Loading doctors...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div className="w-full min-h-screen p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Doctor Management</h1>

      <div className="flex justify-end mb-6">
        <button
          onClick={() => handleAddEditDoctor()}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Add New Doctor
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ID
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                User ID
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Specialty
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Max Appts/Day
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Notes
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{doctor.id}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{doctor.user.id}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{doctor.specialty}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{doctor.maxAppointmentsPerDay}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{doctor.notes}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${doctor.status === 'INACTIVE' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {doctor.status === 'INACTIVE' ? 'Ngừng hoạt động' : 'Đang hoạt động'}
                  </span>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                  <button
                    onClick={() => handleAddEditDoctor(doctor)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Edit
                  </button>
                  {doctor.status !== 'INACTIVE' && (
                    <button
                      onClick={() => handleDeactivateDoctor(doctor.id)}
                      className="text-yellow-600 hover:text-yellow-900 mr-3 flex items-center"
                      title="Ngừng hoạt động bác sĩ"
                    >
                      <FaUserSlash className="mr-1" /> Ngừng hoạt động
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteDoctor(doctor.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={modalState.isOpen || isFormModalOpen}
        title={isFormModalOpen ? (editingDoctor ? 'Edit Doctor' : 'Add New Doctor') : modalState.title}
        type={modalState.type}
        buttonText={modalState.buttonText}
        onClose={isFormModalOpen ? handleCancelForm : hideModal}
        onButtonClick={modalState.onButtonClick}
      >
        {isFormModalOpen ? <DoctorForm doctor={editingDoctor} onSave={handleSaveDoctor} onCancel={handleCancelForm} /> : modalState.message}
      </Modal>
    </div>
  );
};

export default DoctorPage; 