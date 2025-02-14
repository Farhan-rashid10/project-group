import { useEffect, useState } from "react";
import { NavLink } from 'react-router-dom';


const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/doctors");
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setDoctors(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) {
    return <p className="text-center text-blue-500 font-semibold mt-8">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 font-semibold mt-8">Error: {error}</p>;
  }

  return (
    <>
    <div
        className="bg-cover p-20 text-center text-2xl text-blue-700 bg-center h-100"
     style={{ backgroundImage: `url('https://img.freepik.com/free-photo/crop-doctors-shaking-hands_23-2147896209.jpg?ga=GA1.1.421194447.1722059295&semt=ais_hybrid')` }} >
        <h1 className=' text-5xl font-bold text-white-700'>Meet our qualified Doctors</h1>
     <NavLink
     to="/"
     className="text-gray-700 hover:text-blue-700"
     activeClassName="font-bold text-blue-700"
   >
     Home
   </NavLink>/
   <NavLink
     to="/doctors"
     className="text-gray-700 hover:text-blue-700"
     activeClassName="font-bold text-blue-700"
   >
     Doctor
   </NavLink>
      </div>
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">Our Doctors</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {doctors.map((doctor) => (
          <div
            key={doctor.id}
            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer w-full mx-auto"
            onClick={() => setSelectedDoctor(doctor)}
          >
            <img
              src={`http://127.0.0.1:5000/${doctor.imageUrl}`}
              alt={doctor.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">{doctor.name}</h2>
              <p className="text-sm text-gray-500">{doctor.specialty}</p>
              <p className="text-sm text-gray-500">{doctor.description}</p>

            </div>
          </div>
        ))}
      </div>

      {/* Modal for displaying doctor details */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-2/3 lg:w-1/2 relative">
            <button
              className="text-red-500 font-bold text-lg absolute top-4 right-4"
              onClick={() => setSelectedDoctor(null)}
            >
              &times;
            </button>
            <img
              src={`http://127.0.0.1:5100/${selectedDoctor.imageUrl}`}
              alt={selectedDoctor.name}
              className="w-full h-64 object-cover rounded"
            />
            <h2 className="text-2xl font-bold text-gray-800 mt-4">{selectedDoctor.name}</h2>
            <p className="text-blue-500 text-lg mb-4">{selectedDoctor.specialty}</p>
            <p className="text-gray-700 text-sm">{selectedDoctor.description}</p>
            <div className="mt-4 text-sm text-gray-600 space-y-2">
              <p><span className="font-bold">Contact:</span> {selectedDoctor.contact}</p>
              <p><span className="font-bold">Experience:</span> {selectedDoctor.experience}</p>
              <p><span className="font-bold">Education:</span> {selectedDoctor.education}</p>
              <p><span className="font-bold">Hospital:</span> {selectedDoctor.hospital}</p>
              <p><span className="font-bold">Working Hours:</span> {selectedDoctor.workingHours}</p>
              <p><span className="font-bold">Location:</span> {selectedDoctor.location}</p>
            </div>
            <button
              onClick={() => setSelectedDoctor(null)}
              className="mt-6 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
            >
              Back to Doctors List
            </button>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default DoctorsList;
