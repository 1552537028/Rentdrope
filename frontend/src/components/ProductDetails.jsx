import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';

function ProductDetails() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const { addToCart } = useCart();

  // Fetch all products and categories on mount
  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        const productResponse = await axios.get('http://localhost:5000/api/products');
        setProducts(productResponse.data);
        setFilteredProducts(productResponse.data);

        const uniqueCategories = Array.from(new Set(productResponse.data.map(product => product.category)));
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching products or categories:', error);
      }
    };

    fetchProductsAndCategories();
  }, []);

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category) {
      const filtered = products.filter(product => product.category === category);
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="lg:mx-auto lg:container sm:mx-2 mt-10">
        <h1 className="text-4xl font-semibold text-center mb-6">Products</h1>

        <div className="mt-5 text-center flex flex-row">
          <h2 className="text-2xl mb-2 mr-5">Filter by Category:</h2>
          <select 
            value={selectedCategory} 
            onChange={(e) => handleCategoryChange(e.target.value)} 
            className="border p-2 rounded-md shadow-md"
          >
            <option value="">All Categories</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-5">
          {filteredProducts.map(product => (
            <Link to={`/products/${product._id}`} key={product._id}>
            <div key={product._id} className="border rounded-lg shadow-lg p-4 transition-transform transform hover:scale-105">
              <img src={`http://localhost:5000/${product.images[0]}`} alt={product.title} className="w-full h-48 object-cover rounded-md" />
              <h3 className="text-xl font-semibold mt-3">{product.title}</h3>
              <p className="text-lg text-gray-600 mt-1">₹{product.price}</p>
              <p className="text-lg text-red-600 mt-1">{product.offer}%</p>
              <button 
                className="bg-yellow-500 text-white px-4 py-2 mt-3 rounded-md transition hover:bg-yellow-400" 
                onClick={() => addToCart({ id: product._id, title: product.title, price: product.price, images: product.images })}
              >
                Add to Cart
              </button>
            </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProductDetails;