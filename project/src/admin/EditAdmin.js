import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Select Department',
    doctor: '',
    date: '',
    message: '',
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/user');
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setFormData(appointment);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/user/${id}`);
      setAppointments(appointments.filter((app) => app.id !== id));
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://127.0.0.1:5000/user/${selectedAppointment.id}`, formData);
      setAppointments(appointments.map((app) => (app.id === response.data.id ? response.data : app)));
      setShowModal(false);
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAppointment(null);
  };

  return (
    <div className="flex flex-col items-center py-12 px-6 bg-gray-100">
      <div className="w-full max-w-6xl">
        <div className="bg-white p-8 shadow-lg rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Manage Appointments</h2>
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-4 border-b">Name</th>
                <th className="py-3 px-4 border-b">Email</th>
                <th className="py-3 px-4 border-b">Phone</th>
                <th className="py-3 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((app) => (
                <tr key={app.id}>
                  <td className="py-2 px-4 border-b">{app.name}</td>
                  <td className="py-2 px-4 border-b">{app.email}</td>
                  <td className="py-2 px-4 border-b">{app.phone}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleEdit(app)}
                      className="mr-2 bg-yellow-500 text-white py-1 px-3 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(app.id)}
                      className="bg-red-500 text-white py-1 px-3 rounded-md"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-1/3">
            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500">
              &times;
            </button>
            <h2 className="text-2xl font-semibold mb-4">Edit Appointment</h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border"
                  required
                />
              </div>
              {/* Add other fields similarly */}
              <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md">
                Update
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAppointment;
