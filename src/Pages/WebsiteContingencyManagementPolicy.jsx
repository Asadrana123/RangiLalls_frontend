import React from 'react';

const WebsiteContingencyManagementPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-100 mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded shadow-md">
          <h1 className="text-3xl font-semibold mb-6">Website Contingency Management Policy</h1>
          <p className="mb-4">
            This Website is the presence of our company on the Internet and very importantly the site is fully functional all the times. It is expected of our website to deliver information and services on a 24X7 basis. Hence, all efforts should be made to minimize the downtime of the website as far as possible.
          </p>
          <p className="mb-4">
            It is therefore necessary that a proper Contingency Plan to be prepared to handle any eventualities and restore the site in the shortest possible time. The possible contingencies include:
          </p>
          
          <p className="mb-4">
            <strong>Defacement of the website:</strong> All possible security measures must be taken for the website to prevent any possible defacement/hacking by unscrupulous elements. However, if despite the security measures in place, such an eventuality occurs, there must be a proper contingency plan, which should immediately come into force. If it has been established beyond doubt that the website has been defaced, the site must be immediately blocked. The web information manager has to decide the course of action in such eventualities. The complete contact details of this authorized person must be available at all times with the web management team. Efforts should be made to restore the original site in the shortest possible time. At the same time, regular security reviews and checks should be conducted in order to plug any loopholes in the security.
          </p>
          
          <p className="mb-4">
            <strong>Data Corruption:</strong> A proper mechanism is in place to ensure that appropriate and regular back-ups of the website data are being taken. These enable a fast recovery and uninterrupted availability of the information to the citizens in view of any data corruption.
          </p>
          
          <p className="mb-4">
            <strong>Hardware/Software Crash:</strong> Though such an occurrence is a rarely, still in case the server on which the website is being hosted crashes due to some unforeseen reason, enough redundant infrastructure should be available to restore the website at the earliest.
          </p>
          
          <p className="mb-4">
            <strong>Natural Disasters:</strong> There could be circumstances whereby due to some natural calamity, the entire data center where the website is being hosted gets destroyed or ceases to exist. A well planned contingency mechanism has to be in place for such eventualities whereby it should be ensured that the Hosting Service Provider has a 'Disaster Recovery Centre (DRC)' set up at a geographically remote location and the website is switched over to the DRC with minimum delay and restored on the Net.
          </p>
          
          <p className="mb-4">
            Apart from the above, in the event of any National Crisis or unforeseen calamity, Government websites are looked upon as a reliable and fast source of information to the public. A well defined contingency plan for all such eventualities must be in place so that the emergency information/contact help-lines could be displayed on the website without any delay. For this, the concerned person in Rangilalls responsible for publishing such emergency information must be identified and the complete contact details should be available at all times.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WebsiteContingencyManagementPolicy;