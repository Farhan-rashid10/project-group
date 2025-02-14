import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminView = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    doctor: '',
    date: '',
    message: '',
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/appointments');
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
      await axios.delete(`http://127.0.0.1:5000/appointments/${id}`);
      setAppointments(appointments.filter((app) => app.id !== id));
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAppointment(null);
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
      const response = await axios.put(
        `http://127.0.0.1:5000/appointments/${selectedAppointment.id}`,
        formData
      );
      setAppointments(appointments.map((app) => (app.id === response.data.id ? response.data : app)));
      handleCloseModal();
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  return (
    <div className="flex flex-col items-left py-12 px-6 bg-gray-100 w-full">
      <div className="w-full max-w-7xl">
        {/* Appointments Table */}
        <div className="bg-white p-8 shadow-lg rounded-lg w-full">
          <h2 className="text-2xl font-semibold mb-4">Manage Appointments</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white border border-gray-200 rounded-lg shadow-md">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-3 px-4 border border-gray-300 text-left">Name</th>
                  <th className="py-3 px-4 border border-gray-300 text-left">Email</th>
                  <th className="py-3 px-4 border border-gray-300 text-left">Phone</th>
                  <th className="py-3 px-4 border border-gray-300 text-left">Department</th>
                  <th className="py-3 px-4 border border-gray-300 text-left">Doctor</th>
                  <th className="py-3 px-4 border border-gray-300 text-left">Date</th>
                  <th className="py-3 px-4 border border-gray-300 text-left">Message</th>
                  <th className="py-3 px-4 border border-gray-300 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((app) => (
                  <tr key={app.id}>
                    <td className="py-2 px-4 border border-gray-300 text-left">{app.name}</td>
                    <td className="py-2 px-4 border border-gray-300 text-left">{app.email}</td>
                    <td className="py-2 px-4 border border-gray-300 text-left">{app.phone}</td>
                    <td className="py-2 px-4 border border-gray-300 text-left">{app.department}</td>
                    <td className="py-2 px-4 border border-gray-300 text-left">{app.doctor}</td>
                    <td className="py-2 px-4 border border-gray-300 text-left">{app.date}</td>
                    <td className="py-2 px-4 border border-gray-300 text-left">{app.message}</td>
                    <td className="py-2 px-4 border border-gray-300 text-left">
                      <button
                        onClick={() => handleEdit(app)}
                        className="bg-yellow-500 text-white py-1 px-3 rounded-md mr-2 hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(app.id)}
                        className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600"
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

        {/* Full-Width Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full mx-6 md:mx-12 lg:mx-24 xl:mx-48">
              <button
                onClick={handleCloseModal}
                className="absolute top-2 right-2 text-gray-500 text-xl"
              >
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
                <div className="mb-4">
                  <label htmlFor="department" className="block text-sm font-medium">
                    Department
                  </label>
                  <input
                    type="text"
                    id="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="doctor" className="block text-sm font-medium">
                    Doctor
                  </label>
                  <input
                    type="text"
                    id="doctor"
                    value={formData.doctor}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="date" className="block text-sm font-medium">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="message" className="block text-sm font-medium">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border"
                    rows="4"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-md w-full mt-4"
                >
                  Update
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminView;