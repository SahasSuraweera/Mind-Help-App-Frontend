import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import staffApi from "../services/staffApi";
import "../styles/Staff.css";

export default function StaffTable() {
  
  const [staffList, setStaffList] = useState([]);
  const [filteredStaffList, setFilteredStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await staffApi.get("/staff");
        setStaffList(response.data);
        setFilteredStaffList(response.data);
      } catch (error) {
        console.error("Failed to fetch staff:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  const handleAddUser = () => {
    navigate("/staff/new");
  };

  const handleSearch = () => {
    const lower = searchTerm.toLowerCase();
    const filtered = staffList.filter(
      (staff) =>
        staff.staffId.toString().includes(lower) ||
        `${staff.firstName} ${staff.middleName} ${staff.lastName}`
          .toLowerCase()
          .includes(lower)
    );
    setFilteredStaffList(filtered);
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString();
  };

  return (
    <div className="staff-container">
      <div className="staff-header">
        <div className="header-left">
          <h2>Staff Members</h2>
          <div className="staff-search">
            <input
              type="text"
              placeholder="Search by ID or Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button onClick={handleSearch} className="search-button">
              Search
            </button>
          </div>
        </div>
        <button className="add-button" onClick={handleAddUser}>
          + Add Staff
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filteredStaffList.length === 0 ? (
        <p>No staff members found.</p>
      ) : (
        <table className="staff-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Salutation</th>
              <th>Name</th>
              <th>NIC</th>
              <th>Gender</th>
              <th>DOB</th>
              <th>Job Role</th>
              <th>Joined Date</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaffList.map((staff) => (
              <tr key={staff.staffId}>
                <td>{staff.staffId}</td>
                <td>{staff.salutation}</td>
                <td>{`${staff.firstName} ${staff.middleName} ${staff.lastName}`}</td>
                <td>{staff.nic}</td>
                <td>{staff.gender}</td>
                <td>{formatDate(staff.dateOfBirth)}</td>
                <td>{staff.jobRole}</td>
                <td>{formatDate(staff.joinedDate)}</td>
                <td>{staff.staffEmail}</td>
                <td>{staff.staffPhone}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="view-button"
                      onClick={() => navigate(`/staff/view/${staff.staffId}`)}
                    >
                      View
                    </button>

                    <button
                      className="schedule-button"
                      onClick={() =>
                        navigate(`/counsellor/schedule/${staff.staffId}`)
                      }
                      disabled={staff.jobRole !== "Counsellor"}
                    >
                      Schedule
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
