import React, { useState } from "react";

const DoctorsForm = ({ onDoctorAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    imageUrl: null,
    description: "",
    
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, imageUrl: e.target.files[0] });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
   
    if (formData.imageUrl) data.append("image", formData.imageUrl); // Changed 'imageUrl' to 'image'
  
    try {
      const response = await fetch("http://127.0.0.1:5000/medicines", {
        method: "POST",
        body: data,
      });
  
      if (response.ok) {
        alert("Doctor created successfully!");
        setFormData({
          name: "",
          imageUrl: null,
          description: "",
        });
        onDoctorAdded(); // Notify parent component to refresh the list
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (err) {
      console.error("Error saving doctor:", err);
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Add medicine
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
       
        <input
          type="file"
          name="imageUrl"
          onChange={handleFileChange}
          accept="image/*"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        ></textarea>
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Add medicine
        </button>
      </form>
    </div>
  );
};

export default DoctorsForm;
