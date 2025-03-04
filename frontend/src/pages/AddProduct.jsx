import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProductPage() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [offer, setOffer] = useState('');
  const [disc, setDisc] = useState(''); // Description field
  const [category, setCategory] = useState('');
  const [email, setEmail] = useState(''); // Email field
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [products, setProducts] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  const API_URL = 'http://localhost:5000'; // Change with your actual API URL

  useEffect(() => {
    // Fetch products on component mount
    axios.get(`${API_URL}/api/products`)
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);

    // Create image previews
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('price', price);
    formData.append('offer', offer);
    formData.append('disc', disc);  // Ensure 'disc' (description) is added here
    formData.append('category', category);
    formData.append('email', email);  // Email field added here
    selectedImages.forEach(image => {
      formData.append('images', image);
    });

    const request = editingProductId
      ? axios.put(`${API_URL}/api/products/${editingProductId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      : axios.post(`${API_URL}/api/products`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

    request
      .then(response => {
        setUploadStatus(`Product ${editingProductId ? 'updated' : 'uploaded'} successfully!`);
        setProducts(prevProducts => {
          if (editingProductId) {
            return prevProducts.map(product =>
              product._id === editingProductId ? response.data : product
            );
          }
          return [...prevProducts, response.data];
        });
      })
      .catch(error => {
        console.error('Error uploading product:', error.response ? error.response.data : error.message);
        setUploadStatus('Failed to upload product.');
      });
  };

  const toggleView = () => {
    setShowAllProducts(!showAllProducts);
  };

  const handleEdit = (product) => {
    setTitle(product.title);
    setPrice(product.price);
    setOffer(product.offer);
    setDisc(product.disc);  // Set the 'disc' (description) value for editing
    setCategory(product.category);
    setEmail(product.email); // Set email value for editing
    setSelectedImages([]); 
    setPreviewImages([]); 
    setEditingProductId(product._id);
    setShowAllProducts(false); // Switch to form view
  };

  const handleDelete = (id) => {
    axios.delete(`${API_URL}/api/products/${id}`)
      .then(() => {
        setProducts(products.filter(product => product._id !== id));
        setUploadStatus('Product deleted successfully!');
      })
      .catch(error => {
        console.error('Error deleting product:', error.response ? error.response.data : error.message);
        setUploadStatus('Failed to delete product.');
      });
  };

  return (
    <div className="container lg:mx-auto">
      <h1 className="text-2xl font-bold mb-4">Product Management</h1>
      <div className="flex justify-between mb-4">
        <button 
          onClick={toggleView} 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          {showAllProducts ? 'Add New Product' : 'See All Products'}
        </button>
      </div>

      {!showAllProducts ? (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded p-4">
          <label className="block mb-2">
            Title:
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 block w-full border rounded p-2"/>
          </label>
          <label className="block mb-2">
            Price:
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required className="mt-1 block w-full border rounded p-2"/>
          </label>
          <label className="block mb-2">
            Offer (%):
            <input type="number" value={offer} onChange={(e) => setOffer(e.target.value)} className="mt-1 block w-full border rounded p-2"/>
          </label>
          <label className="block mb-2">
            Description:
            <textarea value={disc} onChange={(e) => setDisc(e.target.value)} required className="mt-1 block w-full border rounded p-2"/>
          </label>
          <label className="block mb-2">
            Category:
            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required className="mt-1 block w-full border rounded p-2"/>
          </label>
          <label className="block mb-2">
            Email:
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full border rounded p-2"/>
          </label>
          <label className="block mb-2">
            Select Images:
            <input type="file" multiple accept="image/*" onChange={handleImageChange} className="mt-1 block w-full border rounded p-2"/>
          </label>
          
          {previewImages.length > 0 && (
            <div className="flex space-x-2 my-4">
              {previewImages.map((preview, index) => (
                <img 
                  key={index}
                  src={preview} 
                  alt={`Preview ${index}`} 
                  className="w-24 h-24 object-cover border rounded"
                />
              ))}
            </div>
          )}
          
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            {editingProductId ? 'Update Product' : 'Upload Product'}
          </button>
        </form>
      ) : (
        <div>
          <h2 className="text-xl font-semibold my-4">Uploaded Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(product => (
              <div key={product._id} className="bg-white shadow-md rounded p-4">
                <img src={`${API_URL}/${product.images[0]}`} alt={product.title} className="w-full h-48 object-cover rounded mb-2"/>
                <h2 className="text-lg font-bold">{product.title}</h2>
                <p className="text-gray-700">${product.price}</p>
                {product.offer > 0 && <p className="text-red-500">Offer: {product.offer}%</p>}
                <p className="text-gray-500">Category: {product.category}</p>
                <p className="text-gray-500">Email: {product.email}</p> {/* Show email */}
                <div className="flex justify-between mt-4">
                  <button 
                    onClick={() => handleEdit(product)} 
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(product._id)} 
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {uploadStatus && <p className="mt-4 text-green-500">{uploadStatus}</p>}
    </div>
  );
}

export default ProductPage;
