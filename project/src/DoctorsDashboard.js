import React, { useState, useEffect } from "react";

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [newInfo, setNewInfo] = useState("");

  // Fetch Patients
  useEffect(() => {
    fetch("http://127.0.0.1:5300/patients")
      .then((res) => res.json())
      .then((data) => setPatients(data));
  }, []);

  // Add Patient
  const addPatient = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const age = e.target.age.value;

    fetch("http://127.0.0.1:5300/patients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, age }),
    })
      .then((res) => res.json())
      .then(() => {
        setPatients([...patients, { name, age, medical_info: "" }]);
        e.target.reset();
      });
  };

  // Search Patient
  const searchPatient = () => {
    fetch(`http://127.0.0.1:5300/patients/search?name=${searchQuery}`)
      .then((res) => res.json())
      .then((data) => setSelectedPatient(data))
      .catch(() => setSelectedPatient(null));
  };

  // Add Medical Info
  const addMedicalInfo = () => {
    if (!selectedPatient) return;

    fetch(`http://127.0.0.1:5300/patients/${selectedPatient.id}/add_info`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ info: newInfo }),
    })
      .then((res) => res.json())
      .then((data) => {
        setSelectedPatient({ ...selectedPatient, medical_info: data.medical_info });
        setNewInfo("");
      });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Doctor Dashboard</h1>

      {/* Add Patient Form */}
      <form onSubmit={addPatient} className="mb-6">
        <input type="text" name="name" placeholder="Patient Name" required className="p-2 border mr-2" />
        <input type="number" name="age" placeholder="Age" required className="p-2 border mr-2" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">Add Patient</button>
      </form>

      {/* Search Patient */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border mr-2"
        />
        <button onClick={searchPatient} className="bg-green-500 text-white px-4 py-2">Search</button>
      </div>

      {/* Patient Card */}
      {selectedPatient && (
        <div className="p-6 border rounded-lg shadow-lg bg-gray-100 mb-4">
          <h2 className="text-xl font-bold">{selectedPatient.name} (Age: {selectedPatient.age})</h2>
          <p className="text-gray-700">{selectedPatient.medical_info || "No medical history yet."}</p>

          {/* Add Medical Info */}
          <div className="mt-4">
            <button onClick={() => setNewInfo("")} className="bg-blue-500 text-white px-4 py-2">+</button>
            {newInfo !== "" && (
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Enter new info"
                  value={newInfo}
                  onChange={(e) => setNewInfo(e.target.value)}
                  className="p-2 border mr-2"
                />
                <button onClick={addMedicalInfo} className="bg-green-500 text-white px-4 py-2">Add</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
