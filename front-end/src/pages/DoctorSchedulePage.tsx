import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useModal } from '../hooks/useModal';
import Modal from '../components/Modal';
import { Doctor } from './DoctorPage'; // Assuming Doctor type is exported from DoctorPage

// Define DoctorSchedule type
export type DoctorSchedule = {
  id: number;
  doctor: Doctor; // Link to Doctor
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  location: string;
  notes?: string;
};

interface DoctorScheduleFormProps {
  schedule?: DoctorSchedule;
  onSave: (scheduleData: Omit<DoctorSchedule, 'id' | 'doctor'> & { doctorId: number }) => void;
  onCancel: () => void;
}

interface DoctorScheduleFormData {
  doctorId: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  location: string;
  notes: string;
}

const DoctorScheduleForm: React.FC<DoctorScheduleFormProps> = ({ schedule, onSave, onCancel }) => {
  const [formData, setFormData] = useState<DoctorScheduleFormData>({
    doctorId: schedule?.doctor.id || 0,
    dayOfWeek: schedule?.dayOfWeek || 'MONDAY',
    startTime: schedule?.startTime || '',
    endTime: schedule?.endTime || '',
    location: schedule?.location || '',
    notes: schedule?.notes || '',
  });
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [errorDoctors, setErrorDoctors] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctorsForSelect = async () => {
      try {
        setLoadingDoctors(true);
        const response = await api.get('/doctors');
        setDoctors(response.data);
      } catch (err: any) {
        setErrorDoctors(err.response?.data?.message || 'Error fetching doctors for select.');
        toast.error(err.response?.data?.message || 'Error fetching doctors for select.');
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctorsForSelect();
  }, []);

  useEffect(() => {
    if (schedule) {
      setFormData({
        doctorId: schedule.doctor.id,
        dayOfWeek: schedule.dayOfWeek,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        location: schedule.location,
        notes: schedule.notes || '',
      });
    }
  }, [schedule]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'doctorId' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (loadingDoctors) return <div>Loading doctors for selection...</div>;
  if (errorDoctors) return <div className="text-red-500">Error loading doctors: {errorDoctors}</div>;

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="mb-4">
        <label htmlFor="doctorId" className="block text-gray-700 text-sm font-bold mb-2">Doctor:</label>
        <select
          id="doctorId"
          name="doctorId"
          value={formData.doctorId}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
          <option value="">Select a Doctor</option>
          {doctors.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.user.fullName || doc.user.username} ({doc.specialty})
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="dayOfWeek" className="block text-gray-700 text-sm font-bold mb-2">Day of Week:</label>
        <select
          id="dayOfWeek"
          name="dayOfWeek"
          value={formData.dayOfWeek}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
          <option value="MONDAY">Monday</option>
          <option value="TUESDAY">Tuesday</option>
          <option value="WEDNESDAY">Wednesday</option>
          <option value="THURSDAY">Thursday</option>
          <option value="FRIDAY">Friday</option>
          <option value="SATURDAY">Saturday</option>
          <option value="SUNDAY">Sunday</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="startTime" className="block text-gray-700 text-sm font-bold mb-2">Start Time:</label>
        <input
          type="time"
          id="startTime"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="endTime" className="block text-gray-700 text-sm font-bold mb-2">End Time:</label>
        <input
          type="time"
          id="endTime"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="location" className="block text-gray-700 text-sm font-bold mb-2">Location:</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
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
          {schedule ? 'Save Changes' : 'Add Schedule'}
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

const DoctorSchedulePage: React.FC = () => {
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { modalState, showModal, hideModal } = useModal();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<DoctorSchedule | undefined>(undefined);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await api.get('/doctor-schedules');
      setSchedules(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error fetching doctor schedules.');
      toast.error(err.response?.data?.message || 'Error fetching doctor schedules.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSchedule = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        await api.delete(`/doctor-schedules/${id}`);
        toast.success('Schedule deleted successfully!');
        fetchSchedules();
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Error deleting schedule.');
      }
    }
  };

  const handleAddEditSchedule = (schedule?: DoctorSchedule) => {
    setEditingSchedule(schedule);
    setIsFormModalOpen(true);
  };

  const handleSaveSchedule = async (scheduleData: Omit<DoctorSchedule, 'id' | 'doctor'> & { doctorId: number }) => {
    try {
      if (editingSchedule) {
        // Update existing schedule
        await api.put(`/doctor-schedules/${editingSchedule.id}`, { ...scheduleData, doctor: { id: scheduleData.doctorId } });
        toast.success('Schedule updated successfully!');
      } else {
        // Add new schedule
        await api.post('/doctor-schedules', { ...scheduleData, doctor: { id: scheduleData.doctorId } });
        toast.success('Schedule added successfully!');
      }
      setIsFormModalOpen(false);
      setEditingSchedule(undefined);
      fetchSchedules();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error saving schedule.');
    }
  };

  const handleCancelForm = () => {
    setIsFormModalOpen(false);
    setEditingSchedule(undefined);
  };

  if (loading) return <div className="text-center py-10">Loading doctor schedules...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div className="w-full min-h-screen p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Doctor Schedule Management</h1>

      <div className="flex justify-end mb-6">
        <button
          onClick={() => handleAddEditSchedule()}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Add New Schedule
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
                Doctor
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Day of Week
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Start Time
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                End Time
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Location
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Notes
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule) => (
              <tr key={schedule.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{schedule.id}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{schedule.doctor.user.fullName || schedule.doctor.user.username}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{schedule.dayOfWeek}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{schedule.startTime}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{schedule.endTime}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{schedule.location}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{schedule.notes}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                  <button
                    onClick={() => handleAddEditSchedule(schedule)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSchedule(schedule.id)}
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
        title={isFormModalOpen ? (editingSchedule ? 'Edit Doctor Schedule' : 'Add New Doctor Schedule') : modalState.title}
        type={modalState.type}
        buttonText={modalState.buttonText}
        onClose={isFormModalOpen ? handleCancelForm : hideModal}
        onButtonClick={modalState.onButtonClick}
      >
        {isFormModalOpen ? <DoctorScheduleForm schedule={editingSchedule} onSave={handleSaveSchedule} onCancel={handleCancelForm} /> : modalState.message}
      </Modal>
    </div>
  );
};

export default DoctorSchedulePage; 