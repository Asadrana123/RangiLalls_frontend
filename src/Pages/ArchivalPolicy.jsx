import React from 'react';

const ArchivalPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-100 mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded shadow-md">
          <h1 className="text-3xl font-semibold mb-6">Content Archival Policy</h1>
          <p className="mb-4">
            No content shall be presented on the Website after its expiry date. In the case of such components where validity date is not known at the time of creation, such content shall be treated to be perpetual unless expiry date is otherwise revised. For selected contents, the data will be shifted to the archives pages.
          </p>
          <p className="mb-4">
            For components like public notice, vacancy, etc. only the live content, whose expiry date is after the current date, shall be presented on the Website.
          </p>
          <p className="mb-4">
            The content contributors shall revalidate / modify the content periodically to ensure that expired data is not presented on the website.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArchivalPolicy;