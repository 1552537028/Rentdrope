import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?term=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  return (
    <div className="w-full">
      <div className="relative flex">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="w-full p-3 pr-12 border border-gray-600 bg-black text-white placeholder-gray-400 focus:outline-none focus:border-gray-300 transition"
          placeholder="Search products..."
        />

        <button
          onClick={handleSearch}
          className="absolute right-0 top-1/2 transform -translate-y-1/2  border border-gray-600 p-3.5 bg-white hover:bg-gray-700 transition"
        >
          <FaSearch className="text-gray-900 text-lg" />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
