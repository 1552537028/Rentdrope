// components/RelatedProducts.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const RelatedProducts = ({ category, currentProductId }) => {
  const [related, setRelated] = useState([]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await fetch("https://rentdrope-1.onrender.com/api/products");
        const all = await res.json();
        const filtered = all.filter(
          (item) => item.category === category && item._id !== currentProductId
        );
        setRelated(filtered);
      } catch (err) {
        console.error("Error loading related products", err);
      }
    };

    if (category) fetchRelated();
  }, [category, currentProductId]);

  if (!related.length) return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold text-black mb-4">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {related.map((product) => (
          <Link
            key={product._id}
            to={`/products/${product._id}`}
            className="block bg-white border border-gray-300 p-4 rounded hover:shadow"
          >
            {product.imageUrls && product.imageUrls[0] && (
              <img
                src={product.imageUrls[0]}
                alt={product.title}
                className="w-full h-40 object-cover mb-2"
              />
            )}
            <h3 className="text-lg font-bold text-black">{product.title}</h3>
            <p className="text-sm text-gray-700">₹{product.price}</p>
            <p className="text-xs text-gray-500">{product.category}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
