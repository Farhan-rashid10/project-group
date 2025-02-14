import React, { useState, useEffect } from 'react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    newsletter: false,
  });

  const [info, setInfo] = useState({
    phone: '',
    address: '',
    hours: '',
  });

  useEffect(() => {
    // Fetch contact info
    fetch('http://127.0.0.1:5000/contact-us/')
      .then((response) => response.json())
      .then((data) => setInfo(data))
      .catch((error) => console.error('Error fetching contact info:', error));
  }, []);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://127.0.0.1:5000/contact-us', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Success:', data);
        alert('Form submitted successfully');

        // Clear form data
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          newsletter: false,
        });
      })
      .catch((error) => {
        console.error('Error submitting form:', error);
        alert('There was an error submitting your form. Please try again.');
      });
  };

  return (
    <div className="flex flex-col items-center py-12 px-6 bg-gray-100">
      <div className="w-full max-w-4xl">
        <div className="flex flex-col md:flex-row justify-between">
          {/* Contact form */}
          <div className="w-full md:w-1/2 bg-white p-6 shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Contact With Us</h2>
            <p className="mb-4">If you have any questions, feel free to contact us.</p>

            {/* Updated form with 2x2 grid */}
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Your Name"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Your Email"
                />
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Subject"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Phone Number"
                />
              </div>

              {/* Message */}
              <div className="col-span-1 md:col-span-2">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Your Message
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Your Message"
                ></textarea>
              </div>

              {/* Newsletter Subscription */}
              <div className="col-span-1 md:col-span-2 flex items-center">
                <input
                  type="checkbox"
                  id="newsletter"
                  checked={formData.newsletter}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-900">
                  Do you want to subscribe to our Newsletter?
                </label>
              </div>

              {/* Submit Button */}
              <div className="col-span-1 md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-indigo-700"
                >
                  Send
                </button>
              </div>
            </form>
          </div>

          {/* Map */}
          <div className="w-full md:w-1/2 mt-6 md:mt-0 md:ml-6">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.4869645033325!2d-74.01208458427176!3d40.711588979331095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a3166f7a5a5%3A0x3b8e472b6d2902ac!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1632128534125!5m2!1sen!2sus"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Google Map"
            ></iframe>
          </div>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {/* Card 1 - Phone */}
          <div className="bg-blue-600 shadow-lg rounded-lg p-6 text-center">
            <i className="fas fa-phone-alt text-4xl text-indigo-600 mb-4"></i>
            <p className="text-lg font-semibold">Phone</p>
            <p>{info.phone}</p>
          </div>

          {/* Card 2 - Address */}
          <div className="bg-blue-600 shadow-lg rounded-lg p-6 text-center">
            <i className="fas fa-map-marker-alt text-4xl text-indigo-600 mb-4"></i>
            <p className="text-lg font-semibold">Address</p>
            <p>{info.address}</p>
          </div>

          {/* Card 3 - Hours */}
          <div className="bg-blue-600 shadow-lg rounded-lg p-6 text-center">
            <i className="fas fa-clock text-4xl text-indigo-600 mb-4"></i>
            <p className="text-lg font-semibold">Working Hours</p>
            <p>{info.hours}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
