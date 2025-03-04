import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import UpperNavbar from '../components/UpperNavbar';

const ProductList = () => {
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
      <UpperNavbar/>
      <div className="lg:mx-auto lg:container mt-10">
        <h1 className="text-4xl font-semibold text-center text-red-600 mb-6">Latest Products</h1>

        {/* Horizontal scrollable container with fixed width for product cards */}
        <div className="sm:flex sm:flex-wrap sm:justify-start sm:gap-4 overflow-y-hidden">
        {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <Link to={`/products/${product._id}`} key={product._id}>
                <div className="relative border rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105 bg-white w-60 sm:w-72 lg:w-80">
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
                    <h3 className="text-xl font-semibold text-gray-800 truncate" style={{ maxHeight: '2.5em' }}>
                      {product.title}
                    </h3>
                    <p className="text-lg text-gray-600 mt-2">₹{product.price}</p>
                    <p className="text-lg text-red-600 mt-1">{product.offer}% OFF</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-600">No products found.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductList;






/*import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../contexts/CartContext';

const ProductList = () => {
  const { term } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { addToCart } = useCart();

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

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="lg:mx-auto lg:container sm:mx-2 mt-10 ">
        <h1 className="text-4xl font-semibold text-center mb-6">Products List</h1>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:gap-4 sm:gap-2 mt-5">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <Link to={`/products/${product._id}`} key={product._id}>
                <div className="border rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105 bg-white lg:w-full sm:w-48">
                  <img
                    src={`http://localhost:5000/${product.images[0]}`}
                    alt={product.title}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold overflow-hidden overflow-ellipsis whitespace-nowrap" style={{ maxHeight: '2.5em', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {product.title}
                    </h3>
                    <p className="text-lg text-gray-600">₹{product.price}</p>
                    <p className="text-lg text-red-600">{product.offer}%</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-600">No products found.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductList;
*/