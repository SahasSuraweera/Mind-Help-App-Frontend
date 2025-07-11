import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import staffApi from "../services/staffApi";
import "../styles/CounsellorScheduleCreate.css";

export default function CounsellorScheduleCreate() {
  const { staffId } = useParams();
  const today = new Date().toISOString().split("T")[0];

  const [counsellorId, setCounsellorId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(today);
  const [slots, setSlots] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Fetch counsellor by staffId
  useEffect(() => {
    const fetchCounsellorByStaffId = async () => {
      try {
        const response = await staffApi.get(`/counsellors/staff`, {
          params: { staffId },
        });
        setCounsellorId(response.data.counsellorId);
        setError("");
      } catch (err) {
        console.error("Error fetching counsellor by staffId:", err);
        setError("❌ Failed to load counsellor.");
        setCounsellorId(null);
      }
    };

    if (staffId) {
      fetchCounsellorByStaffId();
    }
  }, [staffId]);

  // Generate fixed slots from 08:30 to 16:30 (one slot per hour at :30)
  const generateFixedSlots = () => {
    const generated = [];
    let id = 1;
    let hour = 8;

    while (hour <= 16) {
      const h = String(hour).padStart(2, "0");
      const m = "30";
      generated.push({
        slotId: id++,
        slotTime: `${h}:${m}`,
        isAvailable: false,
        isBooked: false,
      });
      hour++;
    }

    return generated;
  };

  // When counsellorId or selectedDate changes, reset slots
  useEffect(() => {
    if (counsellorId) {
      setSlots(generateFixedSlots());
    } else {
      setSlots([]);
    }
  }, [selectedDate, counsellorId]);

  // Toggle slot availability only if not booked
  const toggleSlot = (slotId) => {
    setSlots((prevSlots) =>
      prevSlots.map((slot) =>
        slot.slotId === slotId && !slot.isBooked
          ? { ...slot, isAvailable: !slot.isAvailable }
          : slot
      )
    );
  };

  // Save available slots to backend
  const handleSave = async () => {
    if (!counsellorId) return;

    setSaving(true);
    try {
      const payload = slots
        .filter((slot) => slot.isAvailable)
        .map((slot) => ({
          counsellorId,
          slotDate: selectedDate,
          slotTime: slot.slotTime,
          isAvailable: true,
          isBooked: false,
        }));

      if (payload.length === 0) {
        alert("⚠️ Please select at least one slot.");
        setSaving(false);
        return;
      }

      await staffApi.post("/schedules", payload);
      alert("✅ Slots saved successfully!");
      setError("");
    } catch (err) {
      console.error("Error saving slots:", err);
      setError("⚠️ Failed to save slot updates.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="schedule-container">
      <h2>Create Counsellor Schedule</h2>
      <p>
        <strong>Staff ID:</strong> {staffId}
      </p>
      {counsellorId && (
        <p>
          <strong>Counsellor ID:</strong> {counsellorId}
        </p>
      )}

      <div className="date-picker-section">
        <label htmlFor="datePicker">Select Date:</label>
        <input
          id="datePicker"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={today}
        />
      </div>

      {error && <p className="error-message">{error}</p>}

      {counsellorId && (
        <div className="slots-section">
          <h3>Fixed Time Slots on {selectedDate}</h3>
          <ul className="slot-list">
            {slots.map((slot) => (
              <li key={slot.slotId} className="slot-item">
                <label className={`slot-label ${slot.isBooked ? "booked" : ""}`}>
                  <input
                    type="checkbox"
                    checked={slot.isAvailable}
                    disabled={slot.isBooked}
                    onChange={() => toggleSlot(slot.slotId)}
                  />
                  {slot.slotTime} {slot.isBooked && "(Booked)"}
                </label>
              </li>
            ))}
          </ul>

          <button onClick={handleSave} className="save-button" disabled={saving}>
            {saving ? "Saving..." : "Save Slots"}
          </button>
        </div>
      )}
    </div>
  );
}
