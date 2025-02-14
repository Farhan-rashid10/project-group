import React, { useState } from 'react';

const Appointment = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Select Department',
    doctor: '',
    date: '',
    message: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Appointment booked successfully!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          department: 'Select Department',
          doctor: '',
          date: '',
          message: '',
        });
      } else {
        throw new Error('There was an error booking your appointment.');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('There was an error booking your appointment. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center py-12 px-6 bg-gray-100">
      <div className="w-full max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between">
          {/* Booking Form */}
          <div className="w-full md:w-2/3 bg-white p-8 shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Book Your Appointment</h2>
            <p className="mb-6 text-gray-600">
              We will confirm your appointment within 2 hours.
            </p>

            {/* Appointment Form */}
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Your Name"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Your Email"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="text"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Your Phone"
                  required
                />
              </div>

              {/* Department */}
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <select
                  id="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="Select Department">Select Department</option>
                  <option>Cardiology</option>
                  <option>Neurology</option>
                  <option>Orthopedics</option>
                  <option>Pediatrics</option>
                </select>
              </div>

              {/* Doctor */}
              <div>
                <label htmlFor="doctor" className="block text-sm font-medium text-gray-700">
                  Doctor
                </label>
                <input
                  type="text"
                  id="doctor"
                  value={formData.doctor}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Doctor Name"
                  required
                />
              </div>

              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              {/* Message */}
              <div className="col-span-1 md:col-span-2">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Write Your Message Here...
                </label>
                <textarea
                  id="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Your Message"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="col-span-1 md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                >
                  Book An Appointment
                </button>
              </div>
            </form>
          </div>

          {/* Working Hours */}
          <div className="w-full md:w-1/3 mt-6 md:mt-0 md:ml-6 bg-blue-600 text-white p-8 shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Working Hours</h2>
            <ul>
              <li className="flex justify-between">
                <span>Monday - Friday:</span>
                <span>8.00 - 20.00</span>
              </li>
              <li className="flex justify-between mt-2">
                <span>Saturday:</span>
                <span>9.00 - 18.30</span>
              </li>
              <li className="flex justify-between mt-2">
                <span>Sunday:</span>
                <span>Closed</span>
              </li>
              <li className="flex justify-between mt-4 border-t pt-4">
                <span>Monday - Thursday:</span>
                <span>8.00 - 20.00</span>
              </li>
              <li className="flex justify-between mt-2">
                <span>Friday:</span>
                <span>9.00 - 15.00</span>
              </li>
              <li className="flex justify-between mt-2">
                <span>Saturday:</span>
                <span>9.00 - 18.30</span>
              </li>
              <li className="flex justify-between mt-2">
                <span>Sunday:</span>
                <span>Closed</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointment;
