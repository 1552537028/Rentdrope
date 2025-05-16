// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import Cart from './pages/Cart';
import SingleProductPage from './pages/SingleProduct';
import ProductList from './pages/ProductList';
import AddProduct from './pages/AddProduct'
import HomePage from './pages/HomePage';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile';
import FavoritesPage from './pages/FavoritesPage';
import SearchResults from './pages/SearchResults';
import ProductDetails from './components/ProductDetails';
import CategoryProductsPage from './components/CategoryProductsPage';

function App() {
    return (
        <CartProvider>
            <Router>
                <Routes>
                    <Route path='/cart' element={<Cart/>}/>
                    <Route path="/products/:id" element={<SingleProductPage />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path='/admin' element={<AddProduct/>}/>
                    <Route path='/' element={<HomePage/>}/>
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/search" element={<SearchResults />} />
                    <Route path="/category" element={<ProductDetails />} />
                    <Route path="/category/:categoryName" element={<CategoryProductsPage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
      
                </Routes>
            </Router>
        </CartProvider>
    );
}

export default App;
