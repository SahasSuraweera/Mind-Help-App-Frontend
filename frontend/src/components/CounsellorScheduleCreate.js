import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import staffApi from "../services/staffApi";
import "../styles/CounsellorScheduleCreate.css"; 

export default function CounsellorScheduleCreate() {
  const { counsellorId } = useParams();
  const today = new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(today);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // 🔁 Fetch slots whenever counsellorId or selectedDate changes
  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedDate || !counsellorId) return;

      setLoading(true);
      try {
        const response = await staffApi.get("/schedules/available", {
          params: {
            counsellorId: counsellorId,
            slotDate: selectedDate,
          },
        });

        setSlots(response.data || []);
        setError("");
      } catch (err) {
        console.error("Error fetching slots:", err);
        setError("⚠️ Failed to load slots from the server.");
        setSlots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [selectedDate, counsellorId]);

  // ✅ Toggle availability if slot is not booked
  const toggleSlot = (slotId) => {
    setSlots((prevSlots) =>
      prevSlots.map((slot) =>
        slot.slotId === slotId && !slot.isBooked
          ? { ...slot, isAvailable: !slot.isAvailable }
          : slot
      )
    );
  };

  // ✅ Save updated availability
  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        counsellorId: parseInt(counsellorId),
        slotDate: selectedDate,
        slots: slots.map((slot) => ({
          slotId: slot.slotId,
          isAvailable: slot.isAvailable,
        })),
      };

      await staffApi.post("/schedules/save", payload);

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
      <h2>📅 Counsellor Schedule</h2>
      <p><strong>Counsellor ID:</strong> {counsellorId}</p>

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

      {loading && <p>Loading slots...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && slots.length > 0 && (
        <div className="slots-section">
          <h3>Available Time Slots on {selectedDate}</h3>
          <ul className="slot-list">
            {slots.map((slot) => (
              <li key={slot.slotId} className="slot-item">
                <label
                  className={`slot-label ${
                    slot.isBooked ? "booked" : ""
                  }`}
                >
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

          <button
            onClick={handleSave}
            className="save-button"
            disabled={saving}
          >
            {saving ? "Saving..." : "💾 Save Slots"}
          </button>
        </div>
      )}

      {!loading && slots.length === 0 && (
        <p>No slots found for this date.</p>
      )}
    </div>
  );
}
