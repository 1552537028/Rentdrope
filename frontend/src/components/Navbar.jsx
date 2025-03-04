import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { FaOpencart, FaCircleUser } from 'react-icons/fa6';
import SearchBar from './SearchBar';

const Navbar = () => {
  const { cartLength } = useCart();
  const isAuthenticated = localStorage.getItem('token'); 

  return (
    <nav className="bg-slate-500 p-4 flex flex-row justify-between">
      <div className="container flex justify-between items-start flex-row">
        <div className=''>
          <h1 className="text-white items-start text-lg mx-auto justify-start flex flex-row sm:mt-2 lg:mt-0">RentDrope</h1>
        </div> 
        <div className=''>
            <SearchBar />
        </div>
        </div>
        <div className="flex mt-3 mr-3 md:mt-0 justify-between">
          <div className='mr-5 ml-3'>
            <Link to="/cart" className="text-white flex flex-col items-end lg:text-3xl sm:text-2xl sm:ml-2">
            <span className="relative">
              <FaOpencart />
              {cartLength > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-1 sm:text-xs">
                  {cartLength}
                </span>
              )}
            </span>
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
    </nav>
  );
};

export default Navbar;

//gitcode
/**import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { FaOpencart, FaCircleUser } from 'react-icons/fa6';
import SearchBar from './SearchBar';

const Navbar = () => {
  const { cartLength } = useCart();
  const isAuthenticated = localStorage.getItem('token'); 

  return (
    <nav className="bg-gray-800 justify-between flex flex-row p-4">
      <div className="container flex justify-between items-start flex-row">
        <h1 className="text-white items-start text-lg mr-2 lg:mt-0 sm:mt-2">My Store</h1>
        <SearchBar />
        <div className="flex mt-3 mr-3 justify-between">
          <div className="mr-5 ml-3">
           <Link to="/cart" className="text-white flex flex-col items-end lg:text-3xl sm:text-2xl">
            <span className="relative">
              <FaOpencart />
              {cartLength > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-1 sm:text-xs">
                  {cartLength}
                </span>
              )}
            </span>
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

export default Navbar;
 */