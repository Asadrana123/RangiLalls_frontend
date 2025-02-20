import React from 'react';
import { Instagram as InstagramIcon, Twitter as TwitterIcon, Linkedin as LinkedinIcon, Facebook as FacebookIcon, Mail as MailIcon } from 'lucide-react';
import {useState,useEffect} from 'react';
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
    <footer className="w-full bg-yellow-400 text-black mt-10">
      {/* Server Clock and Copyright Section */}
      <div className="w-full text-[15px] font-bold text-primary flex flex-col sm:flex-row justify-between items-center px-4 py-2 border-b border-yellow-500">
        <div className="text-sm">
        Server Clock: {currentTime.toLocaleString()}
        </div>
        <div className="text-sm flex items-center">
          © Rangilalls
        </div>
      </div>
      
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
          {/* Contact Information */}
          <div className="flex flex-col items-start">
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <MailIcon size={16} />
                <a href="mailto:sales@rangilalls.com" className="hover:underline">
                  sales@rangilalls.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MailIcon size={16} />
                <a href="mailto:rangilallsauction@gmail.com" className="hover:underline">
                  rangilallsauction@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Social Media Icons */}
        <div className="mt-8 flex justify-center space-x-4">
          <a href="https://x.com/rangilalls" target="_blank" rel="noopener noreferrer" className="bg-red-500 hover:bg-red-600 transition-colors p-2 rounded-full text-white">
            <TwitterIcon size={20} />
          </a>
          <a href="https://www.instagram.com/rangilalls/" target="_blank" rel="noopener noreferrer" className="bg-red-500 hover:bg-red-600 transition-colors p-2 rounded-full text-white">
            <InstagramIcon size={20} />
          </a>
          <a href="https://www.linkedin.com/company/rangilalls/people/" target="_blank"  rel="noopener noreferrer" className="bg-red-500 hover:bg-red-600 transition-colors p-2 rounded-full text-white">
            <LinkedinIcon size={20} />
          </a>
          <a href="https://www.facebook.com/people/Rangi-Lalls/61553682982309/" target="_blank" rel="noopener noreferrer" className="bg-red-500 hover:bg-red-600 transition-colors p-2 rounded-full text-white">
            <FacebookIcon size={20} />
          </a>
        </div>
        
        {/* Copyright Footer */}
        <div className="mt-8 text-center text-sm">
          <p>© {currentYear} Rangilalls. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;