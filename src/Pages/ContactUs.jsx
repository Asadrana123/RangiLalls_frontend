import React, { useState } from 'react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    companyName: '',
    contactNumber: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          companyName: '',
          contactNumber: '',
          message: ''
        });
      // Replace with your API endpoint
    //   const response = await fetch('/api/contact', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(formData)
    //   });

    //   if (response.ok) {
    //     setStatus('success');
    //     setFormData({
    //       name: '',
    //       email: '',
    //       companyName: '',
    //       contactNumber: '',
    //       message: ''
    //     });
    //   } else {
    //     setStatus('error');
    //   }
    } catch (error) {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 mt-20">
      <h1 className="text-2xl font-bold mb-8">Contact Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <div>
          <p className="text-gray-600 mb-6">
            Please use the form below to contact the Auction team.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name*
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email ID*
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number
              </label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {status === 'success' && (
              <div className="text-green-600">Message sent successfully!</div>
            )}
            {status === 'error' && (
              <div className="text-red-600">Failed to send message. Please try again.</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Submit'}
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800">Address:</h3>
              <p className="text-gray-600">
                Rangi Lalls House, M-27, Main Market,<br />
                Greater Kailash Part-II, New Delhi - 110048, INDIA
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800">Phone:</h3>
              <p className="text-gray-600">+91-9310367526</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800">Business Hours:</h3>
              <p className="text-gray-600">10:00 am to 06:00 pm</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;