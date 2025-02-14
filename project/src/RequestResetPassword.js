import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RequestPasswordReset = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(true); // Modal opens by default
    const navigate = useNavigate();
  

    const closeModal = () => {
      setIsModalOpen(false);
      navigate("/"); // Navigate to the home page
    };
    
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://127.0.0.1:5000/auth/request-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
        credentials: "include",
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setMessage(data.message);
        setError("");
        navigate("/reset")
      } else {
        setError(data.message || "Failed to send reset link.");
        setMessage("");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("An error occurred. Please try again.");
      setMessage("");
    }
  };
  

  return (
    <div>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full relative">
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
              onClick={closeModal} // Close modal on click
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Request Password Reset
            </h2>
            <form onSubmit={handleSubmit}>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your email"
              />
              <button
                type="submit"
                className="w-full mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md shadow hover:bg-indigo-700"
              >
                Send Reset Link
              </button>
            </form>
            {message && <p className="mt-4 text-green-600">{message}</p>}
            {error && <p className="mt-4 text-red-600">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestPasswordReset;
