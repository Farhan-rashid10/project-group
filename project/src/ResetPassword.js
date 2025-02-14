import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams(); // You may still want this for the token, even if you're now using the code.
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
const navigate = useNavigate("")
  const handleReset = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://127.0.0.1:5000/auth/reset-password', {  // Corrected URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code, new_password: password }),  // Make sure the backend expects `new_password`
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setMessage(data.message);
        setError("");
        navigate("/login")
      } else {
        setError(data.message || "Failed to reset password.");
        setMessage("");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setMessage("");
    }
  };
  

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
        <form onSubmit={handleReset}>
          <label className="block mb-2">Email</label>
          <input
            type="email"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <label className="block mb-2">Reset Code</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          
          <label className="block mb-2">New Password</label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded"
          >
            Reset Password
          </button>
        </form>

        {message && <p className="mt-4 text-green-600">{message}</p>}
        {error && <p className="mt-4 text-red-600">{error}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
