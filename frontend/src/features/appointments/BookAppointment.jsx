import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDoctors, getActiveDoctors } from '../../api/doctorApi';
import { getPatients, getPatientByUserId } from '../../api/patientApi';
import { bookAppointment, getAppointmentsByDoctorAndDate } from '../../api/appointmentApi';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { FormField } from '../../components/FormField/FormField';
import styles from './BookAppointment.module.css';

const BookAppointment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    patientId: '', // For receptionist to select
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
    notes: ''
  });
  
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [currentUserPatientId, setCurrentUserPatientId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docs = await getActiveDoctors();
        // Only active doctors
        setDoctors(docs.filter(d => d.active));
        
        if (user.role === 'RECEPTIONIST') {
          const pats = await getPatients();
          setPatients(pats);
        } else if (user.role === 'PATIENT') {
          // Resolve current user's patient profile ID
          const currentPatient = await getPatientByUserId(user.id);
          setCurrentUserPatientId(currentPatient.id);
          setFormData(prev => ({ ...prev, patientId: currentPatient.id }));
        }
      } catch (err) {
        setError('Failed to load required data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // When doctor or date changes, calculate slots
  useEffect(() => {
    const fetchSlots = async () => {
      if (!formData.doctorId || !formData.appointmentDate) {
        setAvailableSlots([]);
        return;
      }
      
      setLoadingSlots(true);
      
      try {
        const doc = doctors.find(d => d.id === formData.doctorId);
        setSelectedDoctor(doc);
        
        const dateObj = new Date(formData.appointmentDate);
        const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
        
        // Find schedule for this day
        let schedule = doc?.schedule?.find(s => s.dayOfWeek === dayOfWeek);
        
        // Fallback: If doctor has no schedule defined, assume 09:00 to 17:00 on weekdays
        if (!schedule && !['SATURDAY', 'SUNDAY'].includes(dayOfWeek)) {
          schedule = {
            dayOfWeek,
            startTime: '09:00',
            endTime: '17:00',
            slotDurationMinutes: 30,
            isAvailable: true
          };
        }
        
        if (!schedule || !schedule.isAvailable) {
          setAvailableSlots([]);
          setLoadingSlots(false);
          return;
        }
        
        // Generate slots
        const slots = [];
        const [startHour, startMin] = schedule.startTime.split(':').map(Number);
        const [endHour, endMin] = schedule.endTime.split(':').map(Number);
        const duration = schedule.slotDurationMinutes || 30;
        
        let currentTotalMinutes = startHour * 60 + startMin;
        const endTotalMinutes = endHour * 60 + endMin;
        
        while (currentTotalMinutes + duration <= endTotalMinutes) {
          const h = Math.floor(currentTotalMinutes / 60).toString().padStart(2, '0');
          const m = (currentTotalMinutes % 60).toString().padStart(2, '0');
          slots.push(`${h}:${m}`);
          currentTotalMinutes += duration;
        }
        
        setAvailableSlots(slots);
        
        // Fetch booked slots
        const appointments = await getAppointmentsByDoctorAndDate(formData.doctorId, formData.appointmentDate);
        const booked = appointments
          .filter(a => a.status !== 'CANCELLED')
          .map(a => a.appointmentTime);
          
        setBookedSlots(booked);
      } catch (err) {
        console.error('Failed to fetch booked slots', err);
      } finally {
        setLoadingSlots(false);
      }
    };
    
    fetchSlots();
  }, [formData.doctorId, formData.appointmentDate, doctors]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Reset time if date or doctor changes
    if (e.target.name === 'doctorId' || e.target.name === 'appointmentDate') {
      setFormData(prev => ({ ...prev, appointmentTime: '' }));
    }
  };

  const handleSlotSelect = (time) => {
    if (bookedSlots.includes(time)) return;
    setFormData({ ...formData, appointmentTime: time });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!formData.patientId) {
      setError('Please select a patient.');
      return;
    }
    
    if (!formData.appointmentTime) {
      setError('Please select an appointment time.');
      return;
    }

    setSubmitting(true);
    
    try {
      let patientName = '';
      if (user.role === 'PATIENT') {
        patientName = user.firstName + ' ' + user.lastName;
      } else {
        const pat = patients.find(p => p.id === formData.patientId);
        if (pat) patientName = pat.firstName + ' ' + pat.lastName;
      }
      
      const payload = {
        ...formData,
        patientName,
        doctorName: selectedDoctor ? `${selectedDoctor.firstName} ${selectedDoctor.lastName}` : ''
      };
      
      await bookAppointment(payload);
      navigate(user.role === 'PATIENT' ? '/patient/appointments' : '/admin/appointments');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to book appointment.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Book Appointment</h1>
        <p className={styles.subtitle}>Schedule a new consultation</p>
      </div>
      
      {error && <div className={styles.error}>{error}</div>}
      
      <Card>
        <form onSubmit={handleSubmit} className={styles.formGrid}>
          {user.role === 'RECEPTIONIST' && (
            <div className={styles.fullWidth}>
              <FormField label="Patient" required>
                <select 
                  name="patientId" 
                  value={formData.patientId} 
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Patient</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.firstName} {p.lastName} - {p.phone}</option>
                  ))}
                </select>
              </FormField>
            </div>
          )}

          <FormField label="Doctor" required>
            <select 
              name="doctorId" 
              value={formData.doctorId} 
              onChange={handleChange}
              required
            >
              <option value="">Select Doctor</option>
              {doctors.map(d => (
                <option key={d.id} value={d.id}>Dr. {d.firstName} {d.lastName} ({d.specialization})</option>
              ))}
            </select>
          </FormField>

          <FormField label="Date" required>
            <input 
              type="date" 
              name="appointmentDate" 
              value={formData.appointmentDate} 
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]} // Cannot book in past
              required
            />
          </FormField>

          <div className={styles.fullWidth}>
            <FormField label="Available Slots" required>
              {loadingSlots ? (
                <div className={styles.loadingSlots}>Loading available slots...</div>
              ) : !formData.doctorId || !formData.appointmentDate ? (
                <div className={styles.loadingSlots}>Select a doctor and date to see slots.</div>
              ) : availableSlots.length === 0 ? (
                <div className={styles.loadingSlots}>Doctor is not available on this date.</div>
              ) : (
                <div className={styles.slotsGrid}>
                  {availableSlots.map(time => {
                    const isBooked = bookedSlots.includes(time);
                    const isSelected = formData.appointmentTime === time;
                    return (
                      <div 
                        key={time}
                        className={`${styles.slot} ${isBooked ? styles.booked : ''} ${isSelected ? styles.selected : ''}`}
                        onClick={() => handleSlotSelect(time)}
                      >
                        {time}
                      </div>
                    );
                  })}
                </div>
              )}
            </FormField>
          </div>

          <div className={styles.fullWidth}>
            <FormField label="Reason for Visit" required>
              <input 
                type="text" 
                name="reason" 
                value={formData.reason} 
                onChange={handleChange}
                placeholder="e.g. Regular checkup, fever, headache"
                required
              />
            </FormField>
          </div>

          <div className={styles.fullWidth}>
            <FormField label="Additional Notes">
              <textarea 
                name="notes" 
                value={formData.notes} 
                onChange={handleChange}
                placeholder="Any other details the doctor should know"
                rows={3}
              />
            </FormField>
          </div>

          <div className={styles.formActions}>
            <Button variant="ghost" type="button" onClick={() => navigate(-1)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting} disabled={!formData.appointmentTime}>
              Confirm Booking
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default BookAppointment;
