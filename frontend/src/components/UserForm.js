import React, { useState } from "react";
import usersApi from "../services/userApi";
import { useNavigate } from "react-router-dom";
import "../styles/UserForm.css";

export default function UserForm() {
  const [formData, setFormData] = useState({
    staffId: "",
    userame: "",
    password: "",
    role: "",
    phone: "",
    
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await usersApi.post("/users", formData);
      alert("✅ users member added successfully");
      navigate("/staff");
    } catch (error) {
      alert("❌ Failed to add users");
      console.error(error);
    }
  };

  return (
    <div className="users-form">
      <h2>Step 2 : Select Username or Password</h2>
      <form onSubmit={handleSubmit}>
        <label>Salutation</label>
        <input name="salutation" value={formData.salutation} onChange={handleChange} required />

        <label>First Name</label>
        <input name="firstName" value={formData.firstName} onChange={handleChange} required />

        <label>Middle Name</label>
        <input name="middleName" value={formData.middleName} onChange={handleChange} />

        <label>Last Name</label>
        <input name="lastName" value={formData.lastName} onChange={handleChange} required />

        <label>NIC</label>
        <input name="nic" value={formData.nic} onChange={handleChange} required />

        <label>Gender</label>
        <select name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <label>Date of Birth</label>
        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />

        <label>Job Role</label>
        <input name="jobRole" value={formData.jobRole} onChange={handleChange} required />

        <label>Joined Date</label>
        <input type="date" name="joinedDate" value={formData.joinedDate} onChange={handleChange} required />

        <label>Email</label>
        <input type="email" name="usersEmail" value={formData.usersEmail} onChange={handleChange} required />

        <label>Phone</label>
        <input name="usersPhone" value={formData.usersPhone} onChange={handleChange} required />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
