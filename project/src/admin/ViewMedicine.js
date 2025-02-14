import { useEffect, useState } from "react";

const MedicinesList = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
  });

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

  const handleEdit = (medicine) => {
    setSelectedMedicine(medicine);
    setFormData({ ...medicine });
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/medicines/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      setMedicines(medicines.filter((medicine) => medicine.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/medicines/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const updatedMedicine = await response.json();
      setMedicines(
        medicines.map((medicine) =>
          medicine.id === id ? updatedMedicine : medicine
        )
      );
      setSelectedMedicine(null);
      setFormData({ name: "", description: "", imageUrl: "" }); // Reset form data
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return <p className="text-center text-blue-500 font-semibold mt-8">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 font-semibold mt-8">Error: {error}</p>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">Our Medicines</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
              <p className="text-gray-700 text-sm mb-4">{medicine.description}</p>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => handleEdit(medicine)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(medicine.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedMedicine && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-2/3 lg:w-1/2 relative">
            <button
              className="text-red-500 font-bold text-lg absolute top-4 right-4"
              onClick={() => setSelectedMedicine(null)}
              aria-label="Close modal"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4" id="modal-title">
              Edit Medicine
            </h2>

            <form onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Name"
                  className="w-full p-2 border rounded"
                  required
                />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Description"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedMedicine(null)}
                  className="px-4 py-2 bg-gray-500 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdate(selectedMedicine.id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Update Medicine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicinesList;
