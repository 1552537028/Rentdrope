import React from 'react';
import { useNavigate } from 'react-router-dom';

const categories = [
  { name: 'men', image: 'https://i.pinimg.com/736x/76/ae/63/76ae63f8558e97c9cc27b2b751f90782.jpg' },
  { name: 'women', image: 'https://i.pinimg.com/736x/e8/70/46/e87046a74246b878a1e916ed8ac19078.jpg' },
  { name: 'kids', image: 'https://i.pinimg.com/736x/8a/9a/68/8a9a68a87d37168b3e5fdd6c1fe5504a.jpg' },
  { name: 'favorite franchise', image: 'https://i.pinimg.com/736x/50/4c/1c/504c1ce617a412f3c770da76ab288a86.jpg' },
  { name: 'others', image: 'https://i.pinimg.com/736x/66/f1/e3/66f1e3ab1cf6e0044b7deeff1142b558.jpg' },
];

const CategoryToolbar = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/category/${category}`);
  };

  return (
    <div className="w-full mb-1 mt-2 h-16 overflow-x-auto sm:overflow-visible bg-gray-950">
      <div className="flex sm:grid sm:grid-cols-5 gap-2 sm:gap-4 p-2 sm:p-4 max-w-6xl mx-auto h-10">
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => handleCategoryClick(category.name)}
            className="relative flex-shrink-0 h-8 w-20 sm:w-full sm:aspect-square bg-gray-800 text-white overflow-hidden group border border-gray-700 rounded-sm"
          >
            {/* Background Image */}
            <img
              src={category.image}
              alt={category.name}
              className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-300"
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-20 transition duration-300" />

            {/* Category Label */}
            <span className="relative z-10 text-white text-[10px] font-semibold uppercase truncate px-1">
              {category.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryToolbar;
