import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Link as LinkType } from '../types';

type HeaderProps = {
  links: LinkType[];
};

const Header: React.FC<HeaderProps> = ({ links }) => {
  const location = useLocation();
  const [showRegister, setShowRegister] = useState(false);

  return (
    <header className="sticky top-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center text-black font-semibold">
            <span className="text-lg font-bold text-black">HIV Care</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex space-x-1">
          {links.map((link) => (
            <Link 
              key={link.id} 
              to={link.url} 
              className={`px-3 py-2 text-sm hover:text-black hover:bg-gray-50 rounded transition-colors ${
                location.pathname === link.url ? 'text-black' : 'text-gray-700'
              }`}
            >
              {link.text}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center space-x-3">
          <Link to="/login" className="text-sm text-black hover:text-gray-700 transition-colors">Đăng nhập</Link>
          <span className="text-gray-300">|</span>
          <Link
            to="/register"
            className="px-3 py-1.5 text-sm bg-black text-white rounded hover:bg-gray-900 transition-colors"
          >
            Đăng ký
          </Link>
          <button className="md:hidden p-1 rounded-full hover:bg-gray-100">
            <Menu size={20} className="text-black" />
          </button>
        </div>
      </div>
      {showRegister && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
              onClick={() => setShowRegister(false)}
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-center mb-1 text-black">Create an account</h2>
            <p className="text-center text-gray-600 mb-6">Enter your information to create an account</p>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-black">Full Name</label>
                <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-black focus:ring-1 focus:ring-black" placeholder="John Doe" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-black">Email</label>
                <input type="email" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-black focus:ring-1 focus:ring-black" placeholder="john.doe@example.com" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-black">Password</label>
                <input type="password" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-black focus:ring-1 focus:ring-black" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-black">Confirm Password</label>
                <input type="password" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-black focus:ring-1 focus:ring-black" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-black">Date of Birth</label>
                <input type="date" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-black focus:ring-1 focus:ring-black" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-black">Gender</label>
                <div className="flex items-center gap-4 mt-1">
                  <label className="flex items-center gap-1">
                    <input type="radio" name="gender" value="male" className="accent-black" required /> Male
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="radio" name="gender" value="female" className="accent-black" /> Female
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="radio" name="gender" value="other" className="accent-black" /> Other
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-black">Phone Number</label>
                <input type="tel" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-black focus:ring-1 focus:ring-black" placeholder="+1 (555) 000-0000" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-black">Address</label>
                <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-black focus:ring-1 focus:ring-black" placeholder="123 Main St, City, Country" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="accent-black" required />
                <span className="text-sm text-black">I agree to the Terms of Service and Privacy Policy</span>
              </div>
              <button type="submit" className="w-full px-6 py-2 bg-black text-white rounded hover:bg-gray-900 transition-colors">
                Create account
              </button>
            </form>
            <p className="text-center text-gray-600 mt-4 text-sm">
              Already have an account? <a href="/dang-nhap" className="text-black font-medium hover:text-gray-700">Sign in</a>
            </p>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;