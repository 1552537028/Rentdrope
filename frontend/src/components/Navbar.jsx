import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { FaOpencart } from 'react-icons/fa6';
import SearchBar from './SearchBar';

const Navbar = () => {
  const { cartLength } = useCart();

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-primary border-b-2 border-gray-800 shadow-square">
        <div className="container lg:mx-auto flex items-center justify-between py-2 px-4">
          <h1 className="text-light font-bold text-xl tracking-tight">VJ Wears</h1>

          <div className="flex-1 mx-6">
            <SearchBar />
          </div>

          <div className="flex items-center space-x-6">
            <Link
              to="/cart"
              className="text-light hover:text-gray-300 transition-colors duration-200"
            >
              <div className="relative">
                <FaOpencart className="text-3xl" />
                {cartLength > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-light text-xs font-bold rounded-square px-2 py-1">
                    {cartLength}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </div>
      </nav>

      {/* Spacer div for bottom margin */}
      <div className="h-16" />
    </>
  );
};

export default Navbar;
