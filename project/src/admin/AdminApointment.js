import React, { useState } from 'react';
import { FiMenu, FiX, FiUser, FiClipboard, FiPlusCircle, FiEye } from 'react-icons/fi'; // Import icons
import MedicineForm from './MedicineForm';
import DoctorsForm from './DoctorsForm';
import AdminView from './DocotorAdmin';
import AdminContact from './AdminContact';
import DoctorsList from './ViewDoctors';
import MedicinesList from './ViewMedicine';

const AdminAppointments = () => {
  const [activeSection, setActiveSection] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar state

  const handleLinkClick = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className={`sticky top-0 h-screen bg-blue-700 text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-16'}`}>
        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-white p-3 focus:outline-none"
        >
          {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Navigation Items */}
        <ul className="space-y-4 p-4">
          <li>
            <button onClick={() => handleLinkClick('adminview')} className="flex items-center w-full text-left space-x-2">
              <FiClipboard size={20} />
              {isSidebarOpen && <span>Appointments</span>}
            </button>
          </li>
          <li>
            <button onClick={() => handleLinkClick('medicine')} className="flex items-center w-full text-left space-x-2">
              <FiPlusCircle size={20} />
              {isSidebarOpen && <span>Add Medicine</span>}
            </button>
          </li>
          <li>
            <button onClick={() => handleLinkClick('doctors')} className="flex items-center w-full text-left space-x-2">
              <FiUser size={20} />
              {isSidebarOpen && <span>Add Doctor</span>}
            </button>
          </li>
          <li>
            <button onClick={() => handleLinkClick('view medicine')} className="flex items-center w-full text-left space-x-2">
              <FiEye size={20} />
              {isSidebarOpen && <span>View Medicine</span>}
            </button>
          </li>
          <li>
            <button onClick={() => handleLinkClick('view doctors')} className="flex items-center w-full text-left space-x-2">
              <FiEye size={20} />
              {isSidebarOpen && <span>View Doctors</span>}
            </button>
          </li>
        </ul>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {activeSection === '' && (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-blue-700">Welcome to the Admin Dashboard</h1>
            <p className="text-gray-700 mt-4">
              Manage appointments, doctors, medicines, and more from here.
            </p>
          </div>
        )}
        {activeSection === 'adminview' && <AdminView />}
        {activeSection === 'contacts' && <AdminContact />}
        {activeSection === 'medicine' && <MedicineForm />}
        {activeSection === 'doctors' && <DoctorsForm />}
        {activeSection === 'view doctors' && <DoctorsList />}
        {activeSection === 'view medicine' && <MedicinesList />}
      </div>
    </div>
  );
};

export default AdminAppointments;
