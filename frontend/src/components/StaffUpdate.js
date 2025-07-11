import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import staffApi from "../services/staffApi";
import "../styles/StaffUpdate.css"; 

export default function StaffUpdate() {
  const { staffId } = useParams();
  const [staff, setStaff] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await staffApi.get(`/staff/${staffId}`);
        setStaff(response.data);
      } catch (error) {
        console.error("Failed to fetch staff for update:", error);
      }
    };

    fetchStaff();
  }, [staffId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStaff((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await staffApi.put(`/staff/${staffId}`, staff);
      alert("✅ Staff updated successfully.");
      navigate(`/staff/view/${staffId}`);
    } catch (error) {
      alert("❌ Failed to update staff.");
      console.error(error);
    }
  };

  if (!staff) return <p>Loading staff for update...</p>;

  return (
    <div className="staff-form">
      <h2>Update Staff Details</h2>
      <form onSubmit={handleSubmit}>
        
        <label>Salutation:</label>
        <input name="salutation" value={staff.salutation} onChange={handleChange} />

        <label>First Name:</label>
        <input name="firstName" value={staff.firstName} onChange={handleChange} required />

        <label>Middle Name:</label>
        <input name="middleName" value={staff.middleName} onChange={handleChange} />

        <label>Last Name:</label>
        <input name="lastName" value={staff.lastName} onChange={handleChange} required />

        <label>NIC:</label>
        <input name="nic" value={staff.nic} onChange={handleChange} required />

        <label>Gender:</label>
        <select name="gender" value={staff.gender} onChange={handleChange}>
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <label>Date of Birth:</label>
        <input type="date" name="dateOfBirth" value={staff.dateOfBirth} onChange={handleChange} />

        <label>Joined Date:</label>
        <input type="date" name="joinedDate" value={staff.joinedDate} onChange={handleChange} />

        <label>Job Role:</label>
        <input name="jobRole" value={staff.jobRole} onChange={handleChange} />

        <label>Staff Email:</label>
        <input type="email" name="staffEmail" value={staff.staffEmail} onChange={handleChange} />

        <label>Staff Phone:</label>
        <input name="staffPhone" value={staff.staffPhone} onChange={handleChange} />

        <button type="submit">Update Staff</button>
      </form>
    </div>
  );
}
