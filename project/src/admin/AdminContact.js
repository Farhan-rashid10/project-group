import React, { useState, useEffect } from 'react';

const AdminContact = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Fetch data from db.json
    fetch('http://127.0.0.1:5000/contact-us') // Update the URL if necessary
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data');
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    fetch(`http://127.0.0.1:5000/contact-us/${id}`, {
      method: 'DELETE'
    })
      .then(() => {
        setData(data.filter(item => item.id !== id));
      })
      .catch(error => console.error('Error deleting item:', error));
  };

  const handleEdit = (item) => {
    setEditingItem({ ...item }); // Create a copy of the item
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editingItem) return;

    try {
      const response = await fetch(`http://127.0.0.1:5000/contact-us/${editingItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editingItem)
      });

      if (!response.ok) {
        throw new Error('Failed to update item');
      }

      const updatedItem = await response.json();
      setData(data.map(item => (item.id === updatedItem.id ? updatedItem : item)));
      setShowModal(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Failed to update item. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setEditingItem((prevItem) => ({
      ...prevItem,
      [id]: value
    }));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6">Admin Dashboard</h1>
      
      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 border-b border-gray-300 text-left">ID</th>
              <th className="py-3 px-4 border-b border-gray-300 text-left">Name</th>
              <th className="py-3 px-4 border-b border-gray-300 text-left">Email</th>
              <th className="py-3 px-4 border-b border-gray-300 text-left">Phone</th>
              <th className="py-3 px-4 border-b border-gray-300 text-left">Subject</th>
              <th className="py-3 px-4 border-b border-gray-300 text-left">Message</th>
              <th className="py-3 px-4 border-b border-gray-300 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td className="py-2 px-4 border-b border-gray-300">{item.id}</td>
                <td className="py-2 px-4 border-b border-gray-300">{item.name}</td>
                <td className="py-2 px-4 border-b border-gray-300">{item.email}</td>
                <td className="py-2 px-4 border-b border-gray-300">{item.phone}</td>
                <td className="py-2 px-4 border-b border-gray-300">{item.subject}</td>
                <td className="py-2 px-4 border-b border-gray-300">{item.message}</td>
                <td className="py-2 px-4 border-b border-gray-300">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-yellow-500 text-white py-1 px-3 rounded-md mr-2 hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h2 className="text-2xl font-semibold mb-4">Edit Item</h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  id="name"
                  value={editingItem.name || ''}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
                  placeholder="Name"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  value={editingItem.email || ''}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
                  placeholder="Email"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  id="phone"
                  value={editingItem.phone || ''}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
                  placeholder="Phone"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                <input
                  type="text"
                  id="subject"
                  value={editingItem.subject || ''}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
                  placeholder="Subject"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  id="message"
                  value={editingItem.message || ''}
                  onChange={handleChange}
                  rows="4"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
                  placeholder="Message"
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 text-white py-1 px-3 rounded-md mr-2 hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContact;