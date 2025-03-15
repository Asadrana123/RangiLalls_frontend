import React from 'react';

const WebsiteSecurityPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-100 mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded shadow-md">
          <h1 className="text-3xl font-semibold mb-6">Website Security Policy</h1>
          <p className="mb-4">
            This website contains information which is freely accessible, and may be viewed by any visitor. The Website Privacy Policy details our position regarding the use of personal information provided by customers/visitors. Except for authorized security investigations and data collection, no attempts will be made to identify individual users. Accumulated data logs will be scheduled for regular deletion.
          </p>
          <p className="mb-4">
            Unauthorized attempts to upload information or change information are strictly prohibited, and may be punishable under the applicable laws for the time being in force.
          </p>
          
          <h2 className="text-2xl font-semibold mt-6 mb-3">User ID and Password Policy:</h2>
          <p className="mb-4">
            Access to sensitive or proprietary business information on Rangilalls websites is limited to users who have been determined to have an appropriate official reason for having access to such data. All registered users who are granted security access will be identified by a user name.
          </p>
          <p className="mb-4">
            Users who are granted password access to restricted information should not share those passwords with or divulging those passwords to any third parties. User will notify Rangilalls immediately in the event, the login credentials are compromised.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WebsiteSecurityPolicy;