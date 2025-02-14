import { useState } from "react";
import { NavLink } from "react-router-dom";

const SignUpForm = () => {
  const [showModal, setShowModal] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const closeModal = () => setShowModal(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = { name, email, password };

    fetch("http://127.0.0.1:5000/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Something went wrong. Please try again.");
        }
      })
      .then(() => {
        alert("User signed up successfully!");
        setShowModal(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        alert(error.message);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
              onClick={closeModal}
            >
              <NavLink to="/">
                <div className="text-blue-600 font-bold text-xl mb-4 md:mb-0">&times;</div>
              </NavLink>
            </button>

            <h2 className="text-2xl font-semibold mb-6 text-center">Sign Up</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-700">Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button className="w-full bg-blue-500 text-white py-2 rounded-lg">
                Sign Up
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUpForm;
