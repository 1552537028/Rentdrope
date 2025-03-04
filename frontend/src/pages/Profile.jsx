/*import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error.response ? error.response.data : error.message);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
   navigate('/')
  };
  const handlechange = ()=>{
    navigate('/login')
  }

  if (!user){
    return (<div class="flex items-center justify-center h-screen">
  <div class="text-center">
    <p class="mb-4 text-lg">Sorry,Your login has been expired,please login again</p>
    <button 
      onClick={handlechange} 
      className="bg-green-500 text-white py-2 px-4 rounded shadow hover:bg-green-600 transition duration-200"
    >Login
    </button>
  </div>
</div>
  )
  }else{
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="mb-4 text-lg font-semibold">Your Profile</h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <button
          onClick={handleLogout}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
 }
};

export default Profile;
*/

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BottomNavbar from '../components/BottomNavbar';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false); // Stop loading if no token
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center bg-white p-6 rounded shadow-md w-96">
          <p className="mb-4 text-lg">Sorry, we don't find any account please login first</p>
          <button
            onClick={handleLoginRedirect}
            className="bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-600 transition duration-200"
          >
            Login
          </button>
        </div>
        <BottomNavbar />
      </div>
    );
  } else {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="mb-4 text-2xl font-semibold text-center text-gray-800">Your Profile</h2>
          <div className="space-y-4">
            <div>
              <p className="text-lg"><strong>Name:</strong> {user.name}</p>
            </div>
            <div>
              <p className="text-lg"><strong>Email:</strong> {user.email}</p>
            </div>
            <div>
              <p className="text-lg"><strong>Phone:</strong> {user.phone || 'Not available'}</p>
            </div>
            <div className="mt-6">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
        <BottomNavbar />
      </div>
    );
  }
};

export default Profile;
