import React from 'react';

const About = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 mt-20">
      <h1 className="text-3xl font-bold mb-8">About Rangi Lalls</h1>
      
      <div className="space-y-6 text-gray-700">
        {/* Introduction */}
        <p className="leading-relaxed">
          Rangi Lalls is the largest Auction House established by the Viceroy and Governor General of India Sir Victor Bruce, 
          9th Earl of Elgin in Old Delhi. it has blossomed into a topmost 21st century Hi-tech company.
        </p>

        {/* History & Clientele */}
        <p className="leading-relaxed">
          Ever since its inception, it has been the trusted auctioneers to the Government of India, Ministry of Defence-all branches, 
          DGBR, E-in-C, along with private companies such as L&T, ACC, Kirloskar, American Embassy, UNICEF, The New India Assurance Co. Ltd. etc. 
          In 2017, Rangi Lalls started its transition to an online SaaS model providing buyers and sellers a platform to bid and participate 
          competitively in a digital environment.
        </p>

        {/* Portfolio & Services */}
        <p className="leading-relaxed">
          Rangilall's portfolio of complete disposal solutions combine hardware, software, and cloud to bring real-time visibility, 
          analytics, and AI to operations. We serve over 10000 customers Pan India across different sizes and industries from scrap dealers, 
          recyclers, traders and smelters.
        </p>

        {/* Achievements */}
        <p className="leading-relaxed">
          Over the last few years our team has successfully created and managed over ten thousand transactions between parties. 
          Today our team believes in transforming the traditional way of conducting auctions to a high tech platform. 
          The company in its relentless pursuit of excellence pushes the boundaries to create a user experience like no other.
        </p>

        {/* Team */}
        <p className="leading-relaxed">
          Our team includes topmost software professionals, management and marketing experts headed by Mr. Neeraj Gupta.
        </p>

        {/* Technology */}
        <p className="leading-relaxed">
          Our company has been able to get topmost disposal prices through speedy and transparent technology processes which have 
          been perfected over decades of experience.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-3xl font-bold text-primary mb-2">10000+</div>
          <div className="text-gray-600">Customers Pan India</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-3xl font-bold text-primary mb-2">10000+</div>
          <div className="text-gray-600">Successful Transactions</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-3xl font-bold text-primary mb-2">Since 2017</div>
          <div className="text-gray-600">Digital Platform</div>
        </div>
      </div>

      {/* Values or Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-primary">Our Technology</h3>
          <p className="text-gray-600">
            Combining hardware, software, and cloud solutions to provide real-time visibility, 
            analytics, and AI-powered operations for a seamless auction experience.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-primary">Our Commitment</h3>
          <p className="text-gray-600">
            Dedicated to providing transparent, efficient, and competitive auction platforms 
            while continuously innovating to enhance user experience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;