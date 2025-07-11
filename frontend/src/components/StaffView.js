import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import staffApi from "../services/staffApi";
import "../styles/StaffView.css";

export default function StaffView() {
  const { staffId } = useParams();
  const [staff, setStaff] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await staffApi.get(`/staff/${staffId}`);
        setStaff(response.data);
      } catch (error) {
        console.error("Failed to fetch staff:", error);
      }
    };
    fetchStaff();
  }, [staffId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleUpdate = () => {
    navigate(`/staff/update/${staff.staffId}`);
  };

  const handleSoftDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this staff member?"
    );
    if (!confirmDelete) return;

    try {
      await staffApi.put(`/staff/archive/${staff.staffId}`);
      alert("✅ Staff member was archived successfully.");
      navigate("/staff");
    } catch (error) {
      console.error("Failed to delete staff:", error);
      alert("❌ Failed to delete staff member.");
    }
  };

  if (!staff) return <p>Loading staff details...</p>;

  return (
    <div className="staff-view">
      
      <h2>{`${staff.salutation} ${staff.firstName} ${staff.middleName} ${staff.lastName}`}</h2>
      <p><strong>ID:</strong> {staff.staffId}</p>
      <p><strong>NIC:</strong> {staff.nic}</p>
      <p><strong>Gender:</strong> {staff.gender}</p>
      <p><strong>DOB:</strong> {formatDate(staff.dateOfBirth)}</p>
      <p><strong>Joined Date:</strong> {formatDate(staff.joinedDate)}</p>
      <p><strong>Job Role:</strong> {staff.jobRole}</p>
      <p><strong>Email:</strong> {staff.staffEmail}</p>
      <p><strong>Phone:</strong> {staff.staffPhone}</p>

      <div className="action-buttons">
        <button className="update-btn" onClick={handleUpdate}>Update</button>
        <button className="delete-btn" onClick={handleSoftDelete}>Delete</button>
      </div>
    </div>
  );
}
