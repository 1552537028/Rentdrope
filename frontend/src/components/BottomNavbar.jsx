"use client";

import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function BottomNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Function to check if a route is active
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 shadow-lg z-10 ">
      <div className="flex justify-around items-center h-16 sm:h-18 max-w-[480px] mx-auto">
        <button
          onClick={() => navigate("/")}
          className={`flex flex-col items-center justify-center w-1/4 h-full ${
            isActive("/") ? "text-blue-600" : "text-gray-500"
          } transition-colors duration-200 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md`}
          aria-label="Home"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-6 sm:w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span className="text-xs mt-1 hidden sm:inline">Home</span>
          <span className="text-[10px] mt-0.5 sm:hidden">Home</span>
        </button>

        <button
          onClick={() => navigate("/favorites")}
          className={`flex flex-col items-center justify-center w-1/4 h-full ${
            isActive("/favorites") ? "text-blue-600" : "text-gray-500"
          } transition-colors duration-200 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md`}
          aria-label="Favorites"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-6 sm:w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span className="text-xs mt-1 hidden sm:inline">Favorites</span>
          <span className="text-[10px] mt-0.5 sm:hidden">Favorites</span>
        </button>

        <button
          onClick={() => navigate("/cart")}
          className={`flex flex-col items-center justify-center w-1/4 h-full ${
            isActive("/cart") ? "text-blue-600" : "text-gray-500"
          } transition-colors duration-200 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md`}
          aria-label="Cart"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-6 sm:w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span className="text-xs mt-1 hidden sm:inline">Cart</span>
          <span className="text-[10px] mt-0.5 sm:hidden">Cart</span>
        </button>

        <button
          onClick={() => navigate("/profile")}
          className={`flex flex-col items-center justify-center w-1/4 h-full ${
            isActive("/profile") ? "text-blue-600" : "text-gray-500"
          } transition-colors duration-200 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md`}
          aria-label="Profile"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-6 sm:w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span className="text-xs mt-1 hidden sm:inline">Profile</span>
          <span className="text-[10px] mt-0.5 sm:hidden">Profile</span>
        </button>
      </div>
    </nav>
  );
}

export default BottomNavbar;
