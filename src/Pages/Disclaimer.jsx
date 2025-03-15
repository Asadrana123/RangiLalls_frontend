import React from 'react';

const Disclaimer = () => {
  return (
    <div className="min-h-screen bg-gray-100 mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded shadow-md">
          <h1 className="text-3xl font-semibold mb-6">Disclaimer</h1>
          <p className="mb-4">
            All the contents of this site are only for general information or use. They do not constitute advice and should not be relied upon in making (or refraining from making) any decision.
          </p>
          <p className="mb-4">
            Rangilalls hereby excludes any warranty, express or implied, as to the quality, accuracy, timeliness, correctness, completeness, performance, fitness for a particular purpose of the site or any of its contents including (but not limited) to any financial tools contained in this site. Rangilalls will not be liable for any damages (including, without limitation, damages for loss of business projects, or loss of profits) arising in contract, tort or otherwise from the use of or inability to use the site, or any of its contents, or from any action taken (or refrained from being taken) as a result of using the site or any such contents. Rangilalls makes no warranty that the contents of this site are free from infection by viruses or anything else which has contaminating or destructive properties.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;