import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import BottomNavbar from '../components/BottomNavbar';

const Cart = () => {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();

  const handleRemove = (id) => {
    removeFromCart(id);
  };

  const handleIncrease = (id) => {
    increaseQuantity(id);
  };

  const handleDecrease = (id) => {
    decreaseQuantity(id);
  };

  return (
    <div className="lg:container lg:mx-auto mt-10 m-3">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <table className="w-full border-collapse hidden md:table">
            <thead>
              <tr>
                <th className="border p-2">Product</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Total</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td className="border p-2 flex items-center">
                    <Link to={`/products/${item.id}`} className="text-xl">
                      <div className='flex flex-row'>
                        <img
                          src={`http://localhost:5000/file/${item.images[0]}`}
                          alt={item.title}
                          className="w-16 h-16 mr-4"
                        />
                        {item.title}
                      </div>
                    </Link>
                  </td>
                  <td className="border p-2">₹ {item.price}</td>
                  <td className="border p-2">
                    <div className="flex items-center">
                      <button onClick={() => handleDecrease(item.id)} className="bg-gray-300 px-2">
                        -
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button onClick={() => handleIncrease(item.id)} className="bg-gray-300 px-2">
                        +
                      </button>
                    </div>
                  </td>
                  <td className="border p-2">₹ {item.price * item.quantity}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile layout */}
          <div className="md:hidden">
            {cart.map((item) => (
              <div key={item.id} className="border p-4 mb-4 flex flex-col">
                <div className="flex items-center mb-2">
                  <Link to={`/products/${item.id}`} className="text-xl">
                    <div className='flex flex-row'>
                      <img
                        src={`http://localhost:5000/${item.images[0]}`}
                        alt={item.title}
                        className="w-16 h-16 mr-4"
                      />
                      {item.title}
                    </div>
                  </Link>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Price: ₹ {item.price}</span>
                  <span>Total: ₹ {item.price * item.quantity}</span>
                </div>
                <div className="flex items-center">
                  <button onClick={() => handleDecrease(item.id)} className="bg-gray-300 px-2">
                    -
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button onClick={() => handleIncrease(item.id)} className="bg-gray-300 px-2">
                    +
                  </button>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <BottomNavbar/>
    </div>
  );
};

export default Cart;
