// src/components/SearchBar.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm) {
      navigate(`/search?term=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
    } else {
      console.log('No search term entered.'); 
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center mt-2 md:mt-0">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown} 
          className="p-3 rounded-full border border-gray-300 bg-transparent text-white placeholder-gray-400 lg:w-[50rem] sm:w-40 sm:h-8"
          placeholder="Search here..."
        />
        <button
          onClick={handleSearch}
          className="absolute inset-y-0 right-0 flex items-center pr-3"
        >
          <FaSearch className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
