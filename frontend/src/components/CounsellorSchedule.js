import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import staffApi from '../services/staffApi';
import '../styles/CounsellorSchedule.css';

export default function CounsellorSchedule() {
  const { counsellorId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const hourlyRate = location.state?.hourlyRate || 0;
  const displayName = location.state?.displayName || 'Unknown Counsellor';

  
  const formatTime = (timeString) => {
    const [hourStr, minute] = timeString.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour.toString().padStart(2, '0')}:${minute} ${ampm}`;
  };

  useEffect(() => {
    const fetchTimeSlots = async () => {
      setLoading(true);
      setError(null);

      const formattedDate = selectedDate.toISOString().split('T')[0];

      try {
        const response = await staffApi.get('/schedules/available', {
          params: {
            counsellorId,
            slotDate: formattedDate,
          },
        });
        setTimeSlots(response.data);
      } catch (err) {
        console.error('Error fetching time slots:', err);
        setError('Failed to fetch slots. Please try again.');
        setTimeSlots([]);
      } finally {
        setLoading(false);
      }
    };

    if (counsellorId && selectedDate) {
      fetchTimeSlots();
    }
  }, [counsellorId, selectedDate]);

  // Navigate to appointment creation on slot click
  const handleSlotClick = (slot) => {
    navigate(`/appointments/create/${counsellorId}`, {
      state: {
        displayName: displayName,
        slotId: slot.slotId,
        slotDate: slot.slotDate,
        slotTime: slot.slotTime,
        hourlyRate: hourlyRate,
      },
    });
  };

  // Filter slots to show only available and not booked
  const availableSlots = timeSlots.filter(slot => slot.available && !slot.booked);

  return (
    <div className="schedule-heading"> 
      <h2>Step 2 : Select Date and Time Slot</h2>
    <div className="schedule-container">
      <div className="schedule-card">
      <h2 className="schedule-title">{displayName}</h2>

      <div className="date-picker-wrapper">
        <label htmlFor="datepicker">Select Date:</label>
        <DatePicker
          id="datepicker"
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          className="date-picker"
          minDate={new Date()}
        />
      </div>
      <h3 style={{ marginTop: '1rem' }}>
        Available Slots for {selectedDate.toDateString()}
      </h3>

      {loading ? (
        <p>Loading slots...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <div className="time-slot-grid">
          {availableSlots.length > 0 ? (
            availableSlots.map((slot) => (
              <div
                key={slot.slotId}
                className="time-slot"
                onClick={() => handleSlotClick(slot)}
                style={{ cursor: 'pointer' }}
              >
                {formatTime(slot.slotTime)}
              </div>
            ))
          ) : (
            <p style={{ color: 'gray' }}>No available slots for this date.</p>
          )}
        </div>
      )}
      </div>
    </div>

    <button className="back-button" onClick={() => window.history.back()}>
        ⬅ Back
      </button>

    </div>
  );
}
