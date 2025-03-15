import React from 'react';
import { Instagram as InstagramIcon, Twitter as TwitterIcon, Linkedin as LinkedinIcon, Facebook as FacebookIcon, Mail as MailIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, []);
  
  return (
    <footer className="w-full bg-red-600 text-white">
      {/* Main Footer Content with Policies */}
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between">
        {/* Policy Links - First Column */}
        <div className="flex flex-col space-y-1 mb-6 md:mb-0">
          <a href="/feedback" className="text-white text-sm hover:underline">Feedback</a>
          <a href="/disclaimer" className="text-white text-sm hover:underline">Disclaimer</a>
          <a href="/terms-of-use" className="text-white text-sm hover:underline">Terms of Use</a>
          <a href="/website-accessibility" className="text-white text-sm hover:underline">Website Accessibility</a>
          <a href="/contact" className="text-white text-sm hover:underline">Contact Us</a>
        </div>

        {/* Policy Links - Second Column */}
        <div className="flex flex-col space-y-1 mb-6 md:mb-0">
          <a href="/privacy-policy" className="text-white text-sm hover:underline">Privacy Policy</a>
          <a href="/hyperlinking-policy" className="text-white text-sm hover:underline">Hyperlinking Policy</a>
          <a href="/copyright-policy" className="text-white text-sm hover:underline">Copyright Policy</a>
          <a href="/content-archival-policy" className="text-white text-sm hover:underline">Content Archival Policy</a>
          <a href="/website-security-policy" className="text-white text-sm hover:underline">Website Security Policy</a>
        </div>

        {/* Policy Links - Third Column */}
        <div className="flex flex-col space-y-1 mb-6 md:mb-0">
          <a href="/website-monitoring-policy" className="text-white text-sm hover:underline">Website Monitoring Policy</a>
          <a href="/content-review-policy" className="text-white text-sm hover:underline">Content Review Policy</a>
          <a href="/website-contingency-management-policy" className="text-white text-sm hover:underline">Website Contingency Management Policy</a>
          <a href="/content-map" className="text-white text-sm hover:underline">Content Contribution, Moderation & Approval Policy(CMAP)</a>
        </div>

        {/* Contact Information - Retained from original */}
        <div className="flex flex-col items-start">
          <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <MailIcon size={16} />
              <a href="mailto:sales@rangilalls.com" className="hover:underline text-white text-sm">
                sales@rangilalls.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MailIcon size={16} />
              <a href="mailto:rangilallsauction@gmail.com" className="hover:underline text-white text-sm">
                rangilallsauction@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Social Media Icons - Retained but styled like the image */}
      <div className="flex justify-center space-x-4 py-4">
        <a href="https://www.instagram.com/rangilalls/" target="_blank" rel="noopener noreferrer" className="bg-white hover:bg-gray-200 transition-colors p-2 rounded-full">
          <InstagramIcon size={20} className="text-red-600" />
        </a>
        <a href="https://x.com/rangilalls" target="_blank" rel="noopener noreferrer" className="bg-white hover:bg-gray-200 transition-colors p-2 rounded-full">
          <TwitterIcon size={20} className="text-red-600" />
        </a>
        <a href="https://www.linkedin.com/company/rangilalls/people/" target="_blank" rel="noopener noreferrer" className="bg-white hover:bg-gray-200 transition-colors p-2 rounded-full">
          <LinkedinIcon size={20} className="text-red-600" />
        </a>
        <a href="https://www.facebook.com/people/Rangi-Lalls/61553682982309/" target="_blank" rel="noopener noreferrer" className="bg-white hover:bg-gray-200 transition-colors p-2 rounded-full">
          <FacebookIcon size={20} className="text-red-600" />
        </a>
      </div>

      {/* Attribution Line */}
      <div className="w-full text-center py-2 border-t border-red-500">
        <p className="text-sm">Site designed, developed and hosted by Rangilalls. © Content Owned and Updated by Rangilalls</p>
      </div>

      {/* Server Clock and Copyright Footer */}
      <div className="w-full bg-yellow-400 text-black flex flex-col sm:flex-row justify-between items-center px-4 py-2">
        <div className="text-sm">
          Server Clock: {currentTime.toLocaleString()}
        </div>
        <div className="text-sm">
          © Rangilalls
        </div>
      </div>
    </footer>
  );
};

export default Footer;