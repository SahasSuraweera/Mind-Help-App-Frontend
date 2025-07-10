import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import staffApi from "../services/staffApi";
import "../styles/CounsellorScheduleCreate.css";

export default function CounsellorScheduleCreate() {
  const { counsellorId } = useParams();
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [slots, setSlots] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const generateFixedSlots = () => {
  const generated = [];
  let id = 1;

  let hour = 8;
  let minute = 30;

  while (hour < 16 || (hour === 16 && minute === 30)) {
    const h = String(hour).padStart(2, "0");
    const m = String(minute).padStart(2, "0");
    generated.push({
      slotId: id++,
      slotTime: `${h}:${m}`,
      isAvailable: false,
      isBooked: false,
    });

    hour += 1; 
  }

  return generated;
};

  useEffect(() => {
    setSlots(generateFixedSlots());
  }, [selectedDate, counsellorId]);

  const toggleSlot = (slotId) => {
    setSlots((prevSlots) =>
      prevSlots.map((slot) =>
        slot.slotId === slotId && !slot.isBooked
          ? { ...slot, isAvailable: !slot.isAvailable }
          : slot
      )
    );
  };

  const handleSave = async () => {
  setSaving(true);
  try {
    const payload = slots
      .filter((slot) => slot.isAvailable)
      .map((slot) => ({
        counsellorId: parseInt(counsellorId),
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

    await staffApi.post("/schedules", payload); // Backend should accept a list

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

      {error && <p className="error-message">{error}</p>}

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

        <button
          onClick={handleSave}
          className="save-button"
          disabled={saving}
        >
          {saving ? "Saving..." : "💾 Save Slots"}
        </button>
      </div>
    </div>
  );
}
