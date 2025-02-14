import { useEffect, useState } from "react";

const MedicinesList = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/medicines");
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setMedicines(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  if (loading) {
    return <p className="text-center text-blue-500 font-semibold mt-8">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 font-semibold mt-8">Error: {error}</p>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">Our Medicines</h1>
      <div className="grid gap-6 mx-auto md:grid-cols-3 lg:grid-cols-4">
        {medicines.map((medicine) => (
          <div
            key={medicine.id}
            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <img
              src={`http://127.0.0.1:5000/${medicine.imageUrl}`}
              alt={medicine.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">{medicine.name}</h2>
              <p className="text-gray-700 text-sm">{medicine.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicinesList;
