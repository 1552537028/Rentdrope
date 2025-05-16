import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ReviewSummaryWithDistribution from "../components/ReviewSummaryWithDistribution";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";
import { jwtDecode } from "jwt-decode";
import { load } from "@cashfreepayments/cashfree-js";
import RelatedProducts from "../components/RelatedProducts";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';

function SingleProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem("favorites")) || []);
  const [user, setUser] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [rentalDays, setRentalDays] = useState(1);

  const getUserFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.id;
    } catch (e) {
      console.error("Invalid token", e);
      return null;
    }
  };

  useEffect(() => {
    const userId = getUserFromToken();
    if (userId) {
      const token = localStorage.getItem("token");
      axios.get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => setUser(res.data)).catch(console.error);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(productRes.data);
        if (productRes.data.images?.length > 0) {
          setSelectedImage(productRes.data.images[0]);
        }

        const reviewRes = await axios.get(`http://localhost:5000/api/reviews/products/${id}`);
        setReviews(reviewRes.data);
      } catch (error) {
        console.error("Error fetching product or reviews:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    const productToAdd = {
      id: product._id,
      title: product.title,
      price: product.price * quantity * rentalDays,
      images: product.images,
    };

    if (cart.some(item => item.id === productToAdd.id)) {
      alert("Product already in cart");
    } else {
      addToCart(productToAdd);
      alert("Added to cart");
    }
  };

  const handlePayment = async () => {
    if (!product || !user) {
      alert("Login required");
      return;
    }

    const paymentData = {
      orderAmount: product.price * quantity * rentalDays,
      customerDetails: {
        customer_id: user._id,
        customer_phone: user.phone || "9999999999",
        customer_name: user.name,
        customer_email: user.email,
      },
    };

    try {
      const res = await axios.post("http://localhost:5000/api/payment/initiate", paymentData);
      const { payment_session_id } = res.data;
      if (payment_session_id) {
        const cashfree = await load({ mode: "sandbox" });
        cashfree.checkout({
          paymentSessionId: payment_session_id,
          redirectTarget: "_modal",
        }).then(async () => {
          await axios.post("http://localhost:5000/api/payment/success", {
            paymentData,
            productId: product._id,
          });
        });
      }
    } catch (e) {
      console.error("Payment error", e);
    }
  };

  const toggleFavorite = () => {
    const updated = favorites.includes(product._id)
      ? favorites.filter(id => id !== product._id)
      : [...favorites, product._id];
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const handleAddReview = (newReview) => setReviews([newReview, ...reviews]);

  if (!product) return <div className="text-center mt-10 text-gray-500">Loading product...</div>;

  return (
    <div className="bg-gray-300 min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded shadow-md">
          {/* Image Section */}
          <div className="space-y-4 relative">
            <div className="border-2 border-gray-300 relative">
              {/* Favorite Icon */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleFavorite(product._id);
                }}
                className="absolute top-2 right-2 z-10"
              >
                <FontAwesomeIcon
                  icon={favorites.includes(product._id) ? solidHeart : regularHeart}
                  className={`text-2xl transition-colors duration-200 ${
                    favorites.includes(product._id) ? 'text-red-500' : 'text-white'
                  }`}
                />
              </button>

              <img
                src={`http://localhost:5000/file/${selectedImage}`}
                alt="Selected"
                className="object-cover w-full h-96"
              />
            </div>

            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={`http://localhost:5000/file/${img}`}
                  onClick={() => setSelectedImage(img)}
                  alt="Thumbnail"
                  className={`h-16 w-16 object-cover border-2 cursor-pointer ${
                    selectedImage === img ? "border-black" : "border-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-black">{product.title}</h1>
            <p className="text-gray-700">{product.disc}</p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600">Quantity</label>
                <select
                  className="w-full border border-gray-300 p-2 rounded"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                >
                  {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>

            <p className="text-xl font-medium text-black">Price: ₹{product.price}</p>
            <p className="text-red-500 text-md">Offer: {product.offer}% OFF</p>
            <p className="text-lg font-semibold text-black">
              Total: ₹{product.price * quantity}
            </p>

            <div className="flex gap-4">
              <button onClick={handleAddToCart} className="bg-black text-white px-6 py-3">
                Add to Cart
              </button>
              <button onClick={handlePayment} className="bg-gray-800 text-white px-6 py-3">
                Buy Now
              </button>
            </div>
          </div>
        </div>

        <RelatedProducts
          category={product.category}
          currentProductId={product._id}
        />

        {/* Reviews Section */}
        <div className="mt-10 bg-gray-100 p-6 shadow rounded">
          <ReviewSummaryWithDistribution
            reviews={reviews}
            showReviewForm={showReviewForm}
            setShowReviewForm={setShowReviewForm}
          />

          {showReviewForm && (
            <ReviewForm
              productId={id}
              onAddReview={handleAddReview}
              setShowReviewForm={setShowReviewForm}
            />
          )}

          <ReviewList reviews={reviews} />
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default SingleProduct;
