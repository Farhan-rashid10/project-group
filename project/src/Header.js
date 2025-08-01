import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({ name: '', email: '' });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedAuthState = localStorage.getItem('isAuthenticated') === 'true';
    const userEmail = localStorage.getItem('user');
    setIsAuthenticated(savedAuthState);

    if (savedAuthState && userEmail) {
      fetch(`http://127.0.0.1:5000/user/email/${userEmail}`)
        .then(response => response.json())
        .then(data => {
          if (data) {
            setUser(data);
          }
        })
        .catch(err => {
          console.error("Error fetching user data:", err);
          setUser({ name: '', email: '' });
        });
        
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', userData.email);
    setUser(userData);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    setUser({ name: '', email: '' });
    setShowProfileCard(false);
    closeModal()
    navigate('/');
  };

  const openLoginModal = () => setShowLoginModal(true);
  const closeLoginModal = () => setShowLoginModal(false);
  const closeModal = () => setShowProfileCard(false);

  return (
    <>
      <div className="topbar bg-gray-100">
        <div className="container mx-auto py-3">
          <div className="flex justify-between font-serif items-center">
            <ul className="flex space-x-4">
              <li><NavLink to="/about" className="text-gray-700 hover:text-blue-500">About</NavLink></li>
              <li><NavLink to="/services" className="text-gray-700 hover:text-blue-500">Services</NavLink></li>
              <li><NavLink to="/contact" className="text-gray-700 hover:text-blue-500">Contact</NavLink></li>
              <li><NavLink to="/faq" className="text-gray-700 hover:text-blue-500">FAQ</NavLink></li>
            </ul>
            <ul className="flex space-x-4">
              <li className="flex items-center">
                <i className="fa fa-phone text-blue-500"></i>
                <span className="ml-2 text-gray-700">+254 7234 56789</span>
              </li>
              <li className="flex items-center">
                <i className="fa fa-envelope text-blue-500"></i>
                <NavLink to="mailto:mediplus@gmail.com" className="ml-2 text-gray-700 hover:text-blue-500">
                  mediplus@gmail.com
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        

        {showLoginModal && (
          <LoginForm closeModal={closeLoginModal} onLoginSuccess={handleLoginSuccess} />
        )}

        {showProfileCard && (
          <div className="fixed right-8 h-600 w-250 bg-blue shadow-lg">
            <div className="bg-blue-600  items-center justify-center rounded-lg">
            <button
            className="absolute top-4 right-2 text-white-600 hover:text-white-800 text-2xl"
            onClick={closeModal}
          >
            &times;
          </button>
              <p className="text-lg font-medium text-white mt-6">{user.name || 'User'}</p>
              <div className="profile-image bg-white-600 mt-1 mb-4">
              </div>
              <p className="font-semibold text-white">{user.email || 'No email available'}</p>
              <button className="mt-4 p-2 bg-red-500 text-white rounded" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between bg-blue-700 py-4 px-8">
        <NavLink to="" className="text-3xl ml-40 font-bold text-white font-serif italic">Medi<span className='italic text-black'>Plus</span></NavLink>
        <div className="flex space-x-4">
          
            {/* Centered Navigation */}
        <nav className="main-menu flex-1 flex justify-space-between mr-80 space-x-8 font-sans italic">
          <NavLink to="/" exact activeClassName="text-white-600" className="font-medium text-white hover:text-black decoration-blue hover:underline">
            Home
          </NavLink>
          <NavLink to="/about" activeClassName="text-black" className="font-medium text-white hover:text-black decoration-blue hover:underline">
            About us
          </NavLink>
          <NavLink to="/doctors" activeClassName="text-black" className="font-medium text-white hover:text-black decoration-blue hover:underline">
          </NavLink>
          <NavLink to="/services" activeClassName="text-black" className="font-medium text-white hover:text-black decoration-blue hover:underline">
            Services
          </NavLink>
          <NavLink to="/medicine" activeClassName="text-black" className="font-medium text-white hover:text-black decoration-blue hover:underline">
          </NavLink>
         
          <NavLink to="/contact" activeClassName="text-black" className="font-medium text-white hover:text-black decoration-blue hover:underline">
            Contact Us
          </NavLink>
          </nav>


          <NavLink
    to={isAuthenticated ? "/appointment" : "#"}
    className={`btn ${
      isAuthenticated ? "bg-blue-500 hover:bg-blue-600" : "bg-blue-500 hover:bg-blue-600"
    } text-white px-4 py-2 rounded`}
    onClick={() => {
      if (!isAuthenticated) {
        openLoginModal(); // Prompt login modal if not authenticated
      }
    }}
  >
    {isAuthenticated ? "Book Appointment" : "Book Appointment"}
  </NavLink>
          {!isAuthenticated ? (
             <>
             <button onClick={openLoginModal} className="bg-blue-100 text-black px-4 py-2 rounded hover:bg-blue-600">
               Login
             </button>
             <NavLink to="/signup" className="bg-blue-100 text-black px-4 py-2 rounded hover:bg-blue-600">
               Sign Up
             </NavLink>
           </>
           
          
          ) : (
            <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400"
            onClick={() => setShowProfileCard(!showProfileCard)}
          >
            Profile
          </button>
           
            
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
