import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    state: '',
    city: '',
    pincode: '',
    localAddress: '',
  });

  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step === 1) {
      // Validate Step 1 fields (name, email, password)
      if (!formData.name || !formData.email || !formData.password) {
        setError('Please fill in all required fields.');
        return;
      }
      setStep(2); // Move to Step 2
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', formData);
      console.log('Signup successful:', response.data);
      navigate('/'); // Redirect to login after signup
    } catch (error) {
      console.error('Signup error:', error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data.message : 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="mb-6 text-lg font-semibold text-center">Create an Account</h2>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        <form onSubmit={step === 1 ? handleNext : handleSubmit}>
          {step === 1 ? (
            <>
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="name">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <button type="submit" className="w-full py-2 mt-4 bg-blue-600 text-white rounded hover:bg-blue-500">
                Next
              </button>
            </>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="phone">Phone</label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="state">State</label>
                <input
                  type="text"
                  name="state"
                  id="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="city">City</label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="pincode">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  id="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="localAddress">Local Address</label>
                <input
                  type="text"
                  name="localAddress"
                  id="localAddress"
                  value={formData.localAddress}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <button type="submit" className="w-full py-2 mt-4 bg-blue-600 text-white rounded hover:bg-blue-500">
                Sign Up
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Signup;
