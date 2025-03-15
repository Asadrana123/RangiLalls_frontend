import React from 'react';

const Feedback = () => {
  return (
    <div className="min-h-screen bg-gray-100 mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded shadow-md">
          <h1 className="text-3xl font-semibold mb-6">Visitor's Feedback</h1>
          <p className="mb-4">
            Rangilalls welcomes your queries / comments on our company, products or services. We'd also love to hear your suggestions about our Web site. Please <a href="/contact" className="text-blue-600 hover:underline">contact us</a> to send us your comments and queries.
          </p>
          
          {/* You can add a feedback form here if needed */}
        </div>
      </div>
    </div>
  );
};

export default Feedback;