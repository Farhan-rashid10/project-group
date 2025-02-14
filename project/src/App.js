import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './Home';
import Footer from './Footer';
import Services from './Services';
import DoctorGrid from './Doctors';
import Contact from './Contact';
import Faq from './Faq';
import AppointmentBooking from './Appointment';
import TrustInMedical from './Trust';
import Admin from './admin/Admin';
import SignUpForm from './SignUpForm';
import LoginForm from './LoginForm';
import HospitalInfo from './About';
import AdminAppointments from './admin/AdminApointment';
import Header from './Header';
import Profile from './Profile';
import RequestPasswordReset from './RequestResetPassword';
import ResetPassword from './ResetPassword';
import MedicinesList from './Medicine';


function App() {
  return (
    <Router>
      <Header />
      
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} /> {/* HomePage is default at "/" */}
          <Route path="/doctors" element={<DoctorGrid />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/appointment" element={<AppointmentBooking />} />
          <Route path="/trust" element={<TrustInMedical />} />
          <Route path='/admin' element={<Admin />} />
          <Route path='/adminappoint' element={<AdminAppointments />} />
          <Route path='/login' element={<LoginForm />} />
          <Route path='/about' element={<HospitalInfo />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/medicine' element={<MedicinesList />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/reset-password" element={<RequestPasswordReset />} />

        


      </Routes>
      </div>
      <Footer />
    </Router>


// <div className="relative group">
// <NavLink to="/pages" activeClassName="text-blue-500" className="text-gray-700 hover:text-blue-500">
//   Pages
// </NavLink>
// {/* Dropdown */}
// <ul className="absolute hidden group-hover:block bg-white shadow-md py-4 px-4 text-">
//   <li>
//     <NavLink to="/signup" className="block px-4 py-2 hover:bg-gray-200">
//       Sign up
//     </NavLink>
//   </li>
//   <li>
//     <NavLink to="/login" className="block px-4 py-2 hover:bg-gray-200">
//       login
//     </NavLink>
//   </li>
// </ul>
// </div>
  );
}

export default App;