import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { doctorService, appointmentService } from '../services/api';
import { Doctor, User } from '../types';
import api from '../services/api';

interface TimeSlot {
  id: number;
  time: string;
  isAvailable: boolean;
}

interface BookingForm {
  doctorId: number;
  date: Date;
  timeSlotId: number;
  reason: string;
  notes?: string;
}

const AppointmentBooking: React.FC = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<BookingForm>({
    doctorId: 0,
    date: new Date(),
    timeSlotId: 0,
    reason: '',
    notes: ''
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchTimeSlots();
    }
  }, [selectedDoctor, selectedDate]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await doctorService.getAllDoctors();
      setDoctors(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error fetching doctors');
      toast.error(err.response?.data?.message || 'Error fetching doctors');
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeSlots = async () => {
    if (!selectedDoctor) return;
    
    try {
      const response = await api.get('/time-slots', {
        params: {
          doctorId: selectedDoctor.id,
          date: selectedDate.toISOString().split('T')[0]
        }
      });
      setTimeSlots(response.data);
    } catch (err: any) {
      console.error('Error fetching time slots:', err);
      toast.error(err.response?.data?.message || 'Error fetching time slots');
    }
  };

  const handleDoctorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const doctorId = parseInt(e.target.value);
    const doctor = doctors.find(d => d.id === doctorId) || null;
    setSelectedDoctor(doctor);
    setFormData(prev => ({ ...prev, doctorId }));
    // Reset time slots when doctor changes
    setTimeSlots([]);
  };

  const handleDateChange = (value: any) => {
    if (value instanceof Date) {
      setSelectedDate(value);
      setFormData(prev => ({ ...prev, date: value }));
      setTimeSlots([]);
    }
  };

  const handleTimeSlotSelect = (timeSlotId: number) => {
    setFormData(prev => ({ ...prev, timeSlotId }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.doctorId || !formData.timeSlotId || !formData.reason) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const selectedSlot = timeSlots.find(slot => slot.id === formData.timeSlotId);
      await appointmentService.createAppointment({
        ...formData,
        appointmentDate: formData.date ? formData.date.toISOString().split('T')[0] : undefined,
        appointmentTime: selectedSlot ? selectedSlot.time : undefined,
        patientId: 1, // This should come from the authenticated user's context
        status: 'pending'
      });
      
      toast.success('Appointment booked successfully!');
      navigate('/appointments'); // Navigate to appointments list
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error booking appointment');
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Book an Appointment</h1>
      
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Doctor</h2>
          <select
            value={formData.doctorId}
            onChange={handleDoctorChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          >
            <option value="">Select a doctor</option>
            {doctors.map(doctor => (
              <option key={doctor.id} /*value={doctor.id}*/>
                {doctor.user.name || doctor.user.username} - {doctor.specialty}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Date</h2>
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              minDate={new Date()}
              className="w-full border-0"
            />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Time</h2>
            <div className="grid grid-cols-2 gap-4">
              {timeSlots.map(slot => (
                <button
                  key={slot.id}
                  type="button"
                  disabled={!slot.isAvailable}
                  onClick={() => handleTimeSlotSelect(slot.id)}
                  className={`p-3 text-center rounded-lg transition-colors ${
                    !slot.isAvailable
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : formData.timeSlotId === slot.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Appointment Details</h2>
          
          <div className="mb-4">
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Visit *
            </label>
            <input
              type="text"
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="bg-primary-500 text-white px-6 py-2 rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Book Appointment
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentBooking;