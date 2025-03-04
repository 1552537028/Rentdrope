import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { FaOpencart, FaCircleUser, FaArrowLeft } from 'react-icons/fa6';

const UpperNavbar = () => {
  const { cartLength } = useCart();
  const isAuthenticated = localStorage.getItem('token');
  const navigate = useNavigate();

  // Function to navigate back
  const handleBack = () => {
    navigate(-1);  // This will go back to the previous page
  };

  return (
    <nav className="bg-slate-400 p-2 hidden lg:flex justify-between items-center z-10">
      <div className="container flex justify-between items-center w-full">
        {/* Back Button */}
        <button onClick={handleBack} className="text-white text-xl">
          <FaArrowLeft />
        </button>

        {/* Cart and User Profile Icons at the end of the bar */}
        <div className="flex items-center space-x-4 ml-auto mt-3 mr-3">
          <div>
            <Link to="/cart" className="text-white flex flex-col items-center lg:text-3xl sm:text-2xl sm:ml-2 relative">
              <FaOpencart />
              {cartLength > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-1 sm:text-xs">
                  {cartLength}
                </span>
              )}
            </Link>
          </div>
          <div>
            <Link 
              to={isAuthenticated ? "/profile" : "/login"}
              className="text-white flex items-center lg:text-3xl sm:text-2xl"
            >
              <FaCircleUser />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default UpperNavbar;
