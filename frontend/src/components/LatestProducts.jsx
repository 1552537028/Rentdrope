import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';

const LatestProducts = () => {
  const { term } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();

  // Favorite products stored in localStorage
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
    const applySearchFilter = () => {
      if (term) {
        const updatedProducts = products.filter(product =>
          product.title.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredProducts(updatedProducts);
      } else {
        setFilteredProducts(products);
      }
    };

    applySearchFilter();
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

  function AllProducts() {
    navigate('/products');
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="lg:mx-auto lg:container mt-10">
        <h1 className="text-4xl font-semibold text-center text-black mb-6">Latest <span className='text-white bg-gray-900'>Collections</span></h1>

        {/* Grid container with responsive column settings */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
          {filteredProducts.slice(0, 8).length > 0 ? (
            filteredProducts.slice(0, 8).map((product) => (
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

      {/* Button to see all products */}
      <div className="flex justify-center items-center mt-8">
        <button onClick={AllProducts} className="p-3 bg-black text-white border-white hover:bg-gray-600 transition-all">
          See More Collections......
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default LatestProducts;
