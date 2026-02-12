import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://rentdrope-1.onrender.com/api/auth/login', credentials);
      localStorage.setItem('token', response.data.token);
      navigate('/'); 
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="mb-4 text-lg font-semibold">Login</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
            className="border border-gray-300 p-2 rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
            className="border border-gray-300 p-2 rounded w-full"
          />
        </div>
        <button type="submit" className="bg-black text-white p-2 rounded w-full">Log In</button>
        <p className="mt-4 text-center">
          Don't have an account? <Link to="/signup" className="text-gray-600">SignUp</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
