import React, { useState, useEffect } from "react";
import { getApplications, 
          getCompanies,
          createCompany,
          updateApplication,
          createApplication,
          deleteApplication
        } from "./api";
import "./App.css"


const STATUS_OPTIONS = ["APPLIED", "ASSESSMENT", "INTERVIEW", "OFFER", "REJECTED"];

function App() {
  const [applications, setApplications] = useState([]);
  const [companies, setCompanies] = useState([]);

  // form state for adding a new company
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCompanyLocation, setNewCompanyLocation] = useState("");


  // form state for adding a new application
  const [roleTitle, setRoleTitle] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [status, setStatus] = useState("APPLIED");
  const [dateApplied, setDateApplied] = useState("");
  const [notes, setNotes] = useState("");

  const [successMessage, setSuccessMessage] = useState("");



  // pulls fresh data from the backend and updates both lists
  const refreshData = () => {
    getApplications().then(res => setApplications(res.data));
    getCompanies().then(res => setCompanies(res.data));
  }

  useEffect(refreshData, []);



  const handleAddCompany = (e) => {
    e.preventDefault();
    setSuccessMessage(""); // Clear any old messages

    // 1. DUPLICATE CHECK: Search the current state array
    const isDuplicate = companies.some(
      (c) => c.name.toLowerCase() === newCompanyName.trim().toLowerCase() && 
             c.location.toLowerCase() === newCompanyLocation.trim().toLowerCase()
    );

    if (isDuplicate) {
      alert("This company and location combination already exists!");
      return; // Stop right here, don't send to backend
    }

    // 2. SAVE TO BACKEND
    createCompany({ name: newCompanyName, location: newCompanyLocation }).then(() => {
      // Show confirmation text on screen
      setSuccessMessage(`Successfully added ${newCompanyName}!`);

      // Reset inputs
      setNewCompanyName("");
      setNewCompanyLocation("");
      refreshData();

      // Automatically hide the success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    });
  }


  const handleAddApplication = (e) => {
    e.preventDefault();
    if (!companyId) {
      alert("Please select a company first.");
      return;
    }
    createApplication({
      companyName: { id: Number(companyId) },
      roleTitle,
      status,
      dateApplied,
      notes: notes.trim() === "" ? null : notes,
    }).then(() => {
      setRoleTitle("");
      setCompanyId("");
      setStatus("APPLIED");
      setDateApplied("");
      setNotes("");
      refreshData();
    });
  };

  const handleStatusChange = (app, newStatus) => {
    updateApplication(app.id, {
      companyName: { id: app.companyName.id },
      roleTitle: app.roleTitle,
      status: newStatus,
      dateApplied: app.dateApplied,
      notes: app.notes,
    }).then(() => refreshData());
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this job application?")) {
      deleteApplication(id).then(() => refreshData());
    }
  };



  return (
    <div className="page">
      <header className="page-header">
        <h1>Job Applications</h1>
        <p className="subtitle">{applications.length} tracked</p>
      </header>

      <div className="forms-row">
        <section className="panel">
          <h2>Add Company</h2>
          <form onSubmit={handleAddCompany} className="stacked-form">
            <input
              placeholder="Company name"
              value={newCompanyName}
              onChange={(e) => setNewCompanyName(e.target.value)}
              required
            />

            <input
              placeholder="Location"
              value={newCompanyLocation}
              onChange={(e) => setNewCompanyLocation(e.target.value)}
              required
            />

            <button type="submit" className="btn-secondary">Add Company</button>

            {successMessage && (
              <p className="success-text">{successMessage}</p>
            )}
          </form>
        </section>

        <section className="panel">
          <h2>Add Application</h2>
          <form onSubmit={handleAddApplication} className="stacked-form">
            <select value={companyId} onChange={(e) => setCompanyId(e.target.value)} required>
              <option value="">Select company</option>
              {companies.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <input
              placeholder="Role title"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              required
            />

            <select value={status} onChange={(e) => setStatus(e.target.value)} required>
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <input
              type="date"
              value={dateApplied}
              onChange={(e) => setDateApplied(e.target.value)}
              required
            />

            <input
              placeholder="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <button type="submit" className="btn-primary">Add Application</button>
          </form>
        </section>
      </div>

      <section className="panel table-panel">
        <table>
          <thead>
            <tr>
              <th>Company</th>
              <th>Role</th>
              <th>Status</th>
              <th>Applied</th>
              <th>Notes</th>
              <th>Location</th>
              {/* Added 7th header to match the 7 cells below */}
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {/* Conditional Rendering: Check if there are applications to display */}
            {applications.length === 0 ? (
              <tr>
                {/* colSpan="7" stretches this one cell across the entire table width */}
                <td colSpan="7" className="empty-row">
                  No applications tracked yet...
                </td>
              </tr>
            ) : (
              applications.map(app => (
                <tr key={app.id}>
                  <td>{app.companyName.name}</td>
                  <td>{app.roleTitle}</td>
                  <td>
                    <span className={`status-dot status-${app.status.toLowerCase()}`}></span>
                    <select
                      className="status-select"
                      value={app.status}
                      onChange={(e) => handleStatusChange(app, e.target.value)}
                      required
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="muted">{app.dateApplied}</td>
                  <td className="muted">{app.notes}</td>
                  <td className="muted">{app.companyName.location}</td>
                  <td>
                    <button onClick={() => handleDelete(app.id)} className="btn-delete">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default App;