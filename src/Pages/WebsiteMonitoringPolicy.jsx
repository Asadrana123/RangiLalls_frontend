import React from 'react';

const WebsiteMonitoringPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-100 mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded shadow-md">
          <h1 className="text-3xl font-semibold mb-6">Website Monitoring Policy</h1>
          <p className="mb-4">
            This website is monitored periodically to address and fix the quality and compatibility issues around the following parameters:
          </p>
          
          <p className="mb-4">
            <strong>Performance:</strong> Site download time is optimized for a variety of network connections as well as devices. All important pages of the website are tested for this. Performance testing will be done whenever it is found that the performance of the site has gone down from the standard performance as experienced.
          </p>
          
          <p className="mb-4">
            <strong>Functionality:</strong> All modules of the website are tested for their functionality. The interactive components of the site such as, feedback forms are working smoothly. Functionality will be tested whenever there is a change in any module.
          </p>
          
          <p className="mb-4">
            <strong>Broken Links:</strong> The website is thoroughly reviewed to rule out the presence of any broken links or errors. Broken links are reviewed half-yearly.
          </p>
          
          <p className="mb-4">
            <strong>Feedback:</strong> Feedback from the visitors is the best way to judge a website's performance and make necessary improvements. Feedbacks will be closely reviewed by a committee and action will be taken accordingly as per the suggestion of the committee.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WebsiteMonitoringPolicy;