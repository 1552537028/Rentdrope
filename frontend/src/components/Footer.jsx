import * as React from "react";
import { Link } from 'react-router-dom';
function Footer() {
  return (
    <footer className="flex flex-col items-start self-stretch pt-7 pr-16 pb-16 pl-3.5 mt-3 w-full text-xs text-black bg-primary">
      <div className="flex flex-col md:flex-row md:justify-between w-full">
        <div className="mb-6 md:mb-0">
          <h2 className="text-sm font-bold mb-3">VJ Wears</h2>
          <p className="max-w-xs text-gray-600">
            Your one-stop destination for renting high-quality products for
            special occasions.
          </p>
        </div>

        <nav className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold mb-2">Company</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm"
                >
                  About us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm"
                >
                  something
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm"
                >
                  Our Team
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Services</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm"
                >
                  Rentals
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm"
                >
                  Delivery
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm"
                >
                  Custom Orders
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Support</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm"
                >
                  FAQs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="mt-8 pt-4 border-t border-gray-400 w-full">
        <p className="text-center text-gray-600">
          &copy; {new Date().getFullYear()} RentDrope. All rights reserved.
        </p>
      </div>
      <li>
        <Link
          to="/admin"
          className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm"
        >
          Admin
        </Link>
      </li>
      
    </footer>
  );
}

export default Footer;
