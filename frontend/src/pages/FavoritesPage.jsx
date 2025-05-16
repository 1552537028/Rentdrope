import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import BottomNavbar from '../components/BottomNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';


const FavoritesPage = () => {
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState(
      JSON.parse(localStorage.getItem('favorites')) || []
    );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const toggleFavorite = (productId) => {
    let updatedFavorites = [...favorites];
    if (updatedFavorites.includes(productId)) {
      updatedFavorites = updatedFavorites.filter(id => id !== productId);
    } else {
      updatedFavorites.push(productId);
    }
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  // Filter only favorite products
  const favoriteProducts = products.filter(product => favorites.includes(product._id));

  return (
    <div className="flex flex-col min-h-screen mb-40">
      <div className="lg:mx-auto lg:container mt-10">
        <h1 className="text-4xl font-semibold text-center text-gray-950 mb-6">Your's Favorites</h1>

        {/* Grid container with responsive column settings */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
          {favoriteProducts.length > 0 ? (
            favoriteProducts.map((product) => (
              <Link to={`/products/${product._id}`} key={product._id}>
                <div className="relative border shadow-lg overflow-hidden transform transition-transform bg-white">
                  <img
                    src={product.imageUrls[0]}
                    alt={product.title}
                    className="h-48 w-full object-cover"
                  />

                  {/* Offer badge */}
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded z-10">
                    {product.offer}% OFF
                  </div>


                  <button
                     onClick={(e) => {
                       e.preventDefault();
                       toggleFavorite(product._id);
                     }}
                     className="absolute top-2 right-2 z-10"
                   >
                     <FontAwesomeIcon
                       icon={favorites.includes(product._id) ? solidHeart : regularHeart}
                       className={`text-xl transition-colors duration-200 ${
                         favorites.includes(product._id) ? 'text-red-500' : 'text-white'
                       }`}
                     />
                  </button>

                  <div className="p-4 bg-gray-900">
                    <h3 className="text-lg font-semibold text-white truncate mb-1">
                      {product.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-1">₹{product.price}</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-600">No products found.</p>
          )}
        </div>
      </div>
      <BottomNavbar/>

      <Footer />
    </div>
  );
};

export default FavoritesPage;
