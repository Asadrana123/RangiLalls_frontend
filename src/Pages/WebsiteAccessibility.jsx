import React from 'react';

const WebsiteAccessibility = () => {
  return (
    <div className="min-h-screen bg-gray-100 mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded shadow-md">
          <h1 className="text-3xl font-semibold mb-6">Website Accessibility</h1>
          <p className="mb-4">
            Rangilalls is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone, and applying the relevant accessibility standards.
          </p>
          
          <h2 className="text-2xl font-semibold mt-6 mb-3">Conformance Status</h2>
          <p className="mb-4">
            The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA.
          </p>
          <p className="mb-4">
            Rangilalls website is partially conformant with WCAG 2.1 level AA. Partially conformant means that some parts of the content do not fully conform to the accessibility standard.
          </p>
          
          <h2 className="text-2xl font-semibold mt-6 mb-3">Feedback</h2>
          <p className="mb-4">
            We welcome your feedback on the accessibility of the Rangilalls website. Please let us know if you encounter accessibility barriers:
          </p>
          <ul className="list-disc ml-8 mb-4">
            <li>Phone: +91-9310367526</li>
            <li>E-mail: rangilallsauction@gmail.com</li>
            <li>Postal address: Rangilalls office address</li>
          </ul>
          <p className="mb-4">
            We try to respond to feedback within 5 business days.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WebsiteAccessibility;