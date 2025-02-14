import { useEffect, useState } from "react";

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editDoctor, setEditDoctor] = useState(null);
  const [updatedData, setUpdatedData] = useState({ name: "", specialty: "" });

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

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/doctors/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete doctor");
      }
      setDoctors(doctors.filter((doctor) => doctor.id !== id));
    } catch (error) {
      console.error("Error deleting doctor:", error);
    }
  };

  const handleUpdate = (doctor) => {
    setEditDoctor(doctor);
    setUpdatedData({ name: doctor.name, specialty: doctor.specialty });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editDoctor) return;

    try {
      const response = await fetch(`http://127.0.0.1:5000/doctors/${editDoctor.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update doctor");
      }

      setDoctors(
        doctors.map((doc) =>
          doc.id === editDoctor.id ? { ...doc, ...updatedData } : doc
        )
      );
      setEditDoctor(null);
    } catch (error) {
      console.error("Error updating doctor:", error);
    }
  };

  if (loading) {
    return <p className="text-center text-blue-500 font-semibold mt-8">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 font-semibold mt-8">Error: {error}</p>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">Our Doctors</h1>

      {editDoctor && (
        <form onSubmit={handleUpdateSubmit} className="bg-white p-4 shadow-md rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-2">Edit Doctor</h2>
          <input
            type="text"
            value={updatedData.name}
            onChange={(e) => setUpdatedData({ ...updatedData, name: e.target.value })}
            className="w-full border p-2 mb-2 rounded"
            placeholder="Doctor's Name"
          />
          <input
            type="text"
            value={updatedData.specialty}
            onChange={(e) => setUpdatedData({ ...updatedData, specialty: e.target.value })}
            className="w-full border p-2 mb-2 rounded"
            placeholder="Specialty"
          />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg">
            Save
          </button>
          <button
            type="button"
            onClick={() => setEditDoctor(null)}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg ml-2"
          >
            Cancel
          </button>
        </form>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {doctors.map((doctor) => (
          <div
            key={doctor.id}
            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow p-4"
          >
            <img
              src={`http://127.0.0.1:5000/${doctor.imageUrl}`}
              alt={doctor.name}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">{doctor.name}</h2>
              <p className="text-sm text-gray-500">{doctor.specialty}</p>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => handleUpdate(doctor)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(doctor.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;
