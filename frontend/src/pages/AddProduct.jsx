import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProductPage() {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    offer: '',
    disc: '',
    category: '',
    email: ''
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState({ message: '', type: '' });
  const [viewMode, setViewMode] = useState('add');
  const [editingProductId, setEditingProductId] = useState(null);

  const API_URL = 'http://localhost:5000';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/products`);
      setProducts(res.data);
    } catch (err) {
      setStatus({ message: 'Error fetching products', type: 'error' });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setStatus({ message: 'Max 5 images allowed', type: 'error' });
      return;
    }
    setSelectedImages(files);
    setPreviewImages(files.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingProductId && selectedImages.length === 0) {
      setStatus({ message: "At least one image is required", type: "error" });
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => data.append(key, val));
    selectedImages.forEach(img => data.append('images', img));

    try {
      const res = await axios.post(`${API_URL}/api/products`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      setStatus({ message: "Product added successfully", type: "success" });
      setProducts([...products, res.data]);
      resetForm();
    } catch (err) {
      console.error("❌ Upload error:", err.response?.data || err.message);
      setStatus({
        message: err.response?.data?.message || "Upload failed",
        type: "error",
      });
    }
  };

  const resetForm = () => {
    setFormData({ title: '', price: '', offer: '', disc: '', category: '', email: '' });
    setSelectedImages([]);
    setPreviewImages([]);
    setEditingProductId(null);
  };

  const handleEdit = (product) => {
    setFormData({
      title: product.title,
      price: product.price,
      offer: product.offer,
      disc: product.disc,
      category: product.category,
      email: product.email
    });
    setEditingProductId(product._id);
    setPreviewImages([]);
    setSelectedImages([]);
    setViewMode('add');
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
      setStatus({ message: 'Product deleted', type: 'success' });
    } catch (err) {
      setStatus({ message: 'Delete failed', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-black">
      <h1 className="text-3xl font-bold mb-6 text-center"> Product Management</h1>

      <div className="flex gap-4 justify-center mb-6">
        <button
          className={`px-5 py-2 border rounded ${viewMode === 'add' ? 'bg-black text-white' : 'bg-white text-black border-gray-400'}`}
          onClick={() => setViewMode('add')}
        >
          Add Product
        </button>
        <button
          className={`px-5 py-2 border rounded ${viewMode === 'list' ? 'bg-black text-white' : 'bg-white text-black border-gray-400'}`}
          onClick={() => setViewMode('list')}
        >
          View All Products
        </button>
      </div>

      {status.message && (
        <div className={`mb-4 p-3 rounded ${status.type === 'error' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
          {status.message}
        </div>
      )}

      {viewMode === 'add' ? (
        <form onSubmit={handleSubmit} className="bg-white border rounded p-6 max-w-4xl mx-auto shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="title" value={formData.title} onChange={handleInputChange}
              placeholder="Product Title" required className="border border-gray-300 p-2 rounded" />
            <input type="number" name="price" value={formData.price} onChange={handleInputChange}
              placeholder="Price" required className="border border-gray-300 p-2 rounded" />
            <input type="number" name="offer" value={formData.offer} onChange={handleInputChange}
              placeholder="Offer (%)" className="border border-gray-300 p-2 rounded" />
            <input type="text" name="category" value={formData.category} onChange={handleInputChange}
              placeholder="Category" required className="border border-gray-300 p-2 rounded" />
            <input type="email" name="email" value={formData.email} onChange={handleInputChange}
              placeholder="Admin Email" required className="border border-gray-300 p-2 rounded" />
            <textarea name="disc" value={formData.disc} onChange={handleInputChange}
              placeholder="Product Description" required className="border border-gray-300 p-2 rounded md:col-span-2" />
          </div>

          <div className="mt-4">
            <label className="block mb-1 text-sm font-semibold">Upload Images (max 5)</label>
            <input type="file" accept="image/*" onChange={handleImageChange} multiple
              className="border border-gray-300 p-2 rounded w-full" required={!editingProductId} />
          </div>

          {previewImages.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {previewImages.map((img, i) => (
                <img key={i} src={img} alt="preview" className="w-24 h-24 object-cover border rounded" />
              ))}
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button type="submit" className="bg-black text-white px-6 py-2 rounded hover:bg-gray-900">
              {editingProductId ? "Update Product" : "Add Product"}
            </button>
            {editingProductId && (
              <button type="button" onClick={resetForm} className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-600">
                Cancel
              </button>
            )}
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product._id} className="bg-white border shadow rounded p-4">
              <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden mb-3">
                {product.imageUrls && product.imageUrls[0] ? (
                  <img src={product.imageUrls[0]} alt={product.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-gray-500">No Image</div>
                )}
              </div>
              <h2 className="text-lg font-bold">{product.title}</h2>
              <p className="text-gray-700">₹{product.price}</p>
              <p className="text-sm text-gray-600">{product.category}</p>
              {product.offer > 0 && (
                <p className="text-red-600 text-sm">Offer: {product.offer}%</p>
              )}

              <div className="mt-3 flex justify-between">
                <button onClick={() => handleEdit(product)} className="bg-gray-900 text-white px-4 py-1">
                  Edit
                </button>
                <button onClick={() => handleDelete(product._id)} className="bg-black text-white px-4 py-1">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductPage;
