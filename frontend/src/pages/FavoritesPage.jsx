import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import BottomNavbar from '../components/BottomNavbar';

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
    <div className="flex flex-col min-h-screen">
      <div className="lg:mx-auto lg:container mt-10">
        <h1 className="text-4xl font-semibold text-center text-red-600 mb-6">Favorite Products</h1>

        <div className="lg:grid md:grid-cols-4 lg:gap-4 lg:mt-5 sm:flex sm:flex-row sm:gap-5 overflow-x-scroll lg:overflow-hidden">
          {favoriteProducts.length > 0 ? (
            favoriteProducts.map(product => (
              <Link to={`/products/${product._id}`} key={product._id}>
                <div className="border rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105 bg-white lg:w-full sm:w-36 relative">
                  <img
                    src={`http://localhost:5000/${product.images[0]}`}
                    alt={product.title}
                    className="h-48 w-full object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(product._id);
                    }}
                    className="absolute top-0 right-0 p-3 text-white transition-all"
                    style={{ fontSize: '24px' }}
                  >
                    {favorites.includes(product._id) ? '❤️' : '🤍'}
                  </button>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold overflow-hidden whitespace-nowrap" style={{ maxHeight: '2.5em' }}>
                      {product.title}
                    </h3>
                    <p className="text-lg text-gray-600">₹{product.price}</p>
                    <p className="text-lg text-red-600">{product.offer}%</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-600">No favorite products found.</p>
          )}
        </div>
      </div>
      <BottomNavbar/>

      <br />
      <Footer />
    </div>
  );
};

export default FavoritesPage;
