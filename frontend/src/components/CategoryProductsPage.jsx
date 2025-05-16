import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CategoryToolbar from './Toolbar';

const CategoryProductsPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        const filtered = response.data.filter(p => p.category === categoryName);
        setProducts(filtered);
      } catch (error) {
        console.error('Failed to fetch category products:', error);
      }
    };

    fetchCategoryProducts();
  }, [categoryName]);

  return (
    <div>
      <Navbar />
      <h1 className="text-4xl font-semibold text-center mt-10">Products in "{categoryName}"</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 px-4">
        {products.map(product => (
          <Link to={`/products/${product._id}`} key={product._id}>
            <div className="border  p-4 transition-transform transform ">
              <img src={product.imageUrls[0]} alt={product.title} className="w-full h-48 object-cover " />
              <h3 className="text-xl font-semibold mt-3">{product.title}</h3>
              <p className="text-lg text-gray-600 mt-1">₹{product.price}</p>
              <p className="text-lg text-red-600 mt-1">{product.offer}%</p>
              <button 
                className="bg-black text-white px-4 py-2 mt-3 hover:bg-gray-600"
                onClick={(e) => {
                  e.preventDefault();
                  addToCart({ id: product._id, title: product.title, price: product.price, images: product.images });
                }}
              >
                Add to Cart
              </button>
            </div>
          </Link>
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default CategoryProductsPage;
