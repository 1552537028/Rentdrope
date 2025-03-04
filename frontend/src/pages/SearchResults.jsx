// src/pages/SearchResults.js

import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';


const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const query = new URLSearchParams(useLocation().search);
  const searchTerm = query.get('term') || '';

  const navigate = useNavigate();
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

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleCategory(){
    navigate('/category')
  }

  return (
    <div>
      <Navbar/>
    <div className="lg:container lg:mx-auto m-3">
      <div className='flex flex-row justify-between'>
        <h1 className="text-xl  mb-4">Search Results for "{searchTerm}"</h1>
      </div>
      
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <Link to={`/products/${product._id}`} key={product._id}>
              <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200">
                <img
                  src={`http://localhost:5000/${product.images[0]}`}
                  alt={product.title}
                  className="w-full h-52 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold">{product.title}</h2>
                  <p className="text-gray-700">${product.price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>No products found.</p>
      )}
      
    </div>
    <Footer/>
    </div>
  );
};

export default SearchResults;
