import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import Footer from './Footer';

const LatestProductsRow = () => {
  const { term } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem('favorites')) || []
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (term) {
      const updatedProducts = products.filter(product =>
        product.title.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredProducts(updatedProducts);
    } else {
      setFilteredProducts(products);
    }
  }, [term, products]);

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

  return (
    <div className="flex flex-col bg-white text-black py-10">
      <div className="lg:container lg:mx-auto px-4">
        <h1 className="text-4xl font-semibold text-center text-black mb-8">Latest<span className='bg-black text-white '>Collections</span></h1>

        <div className="flex overflow-x-auto space-x-4 py-4 scrollbar-hide">
          {filteredProducts.slice(0, 8).length > 0 ? (
            filteredProducts.slice(0, 8).map((product) => (
              <Link to={`/products/${product._id}`} key={product._id} className="shrink-0">
                <div className="relative border border-gray-700 bg-gray-900  w-60 sm:w-64 lg:w-72 shadow-lg ">
                  {/* Product Image */}
                  <img
                    src={product.imageUrls[0]}
                    alt={product.title}
                    className="h-48 w-full object-cover "
                  />

                  {/* Offer badge */}
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded z-10">
                    {product.offer}% OFF
                  </div>

                  {/* Favorite Icon */}
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

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white truncate mb-1">
                      {product.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-1">₹{product.price}</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-400 w-full">No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LatestProductsRow;
