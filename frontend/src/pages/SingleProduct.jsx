import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { load } from "@cashfreepayments/cashfree-js";
import { useCart } from "../contexts/CartContext";
import Footer from "../components/Footer";
import { jwtDecode } from "jwt-decode";
import ReviewSummaryWithDistribution from "../components/ReviewSummaryWithDistribution";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";
import UpperNavbar from "../components/UpperNavbar";

function SingleProduct() {
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const { id } = useParams();
  const { addToCart, cart } = useCart();
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || []
  );
  const [quantity, setQuantity] = useState(1);
  const [rentalDays, setRentalDays] = useState(1);

  const navigate = useNavigate();

  // Get user from token
  const getUserFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        return decoded.id;
      } catch (error) {
        console.error("Invalid or expired token:", error);
        return null;
      }
    }
    return null;
  };

  // Fetch user data
  useEffect(() => {
    const userId = getUserFromToken();
    if (userId) {
      const token = localStorage.getItem("token");
      axios
        .get("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
        });
    } else {
      console.log("User not logged in or invalid token");
    }
  }, []);

  // Fetch product and reviews
  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        // Fetch product details
        const productResponse = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(productResponse.data);
        if (productResponse.data.images && productResponse.data.images.length > 0) {
          setSelectedImage(productResponse.data.images[0]);
        }

        // Fetch reviews for this product
        const reviewsResponse = await axios.get(`http://localhost:5000/api/reviews/products/${id}`);
        setReviews(reviewsResponse.data);
      } catch (error) {
        console.error("Error fetching product or reviews:", error);
      }
    };

    fetchProductAndReviews();
  }, [id]);

  // Handle payment
  const handlePayment = async () => {
    if (!product || !user) {
      console.error("Product or user data is missing");
      alert("Please Login First!");
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
      const response = await axios.post("http://localhost:5000/api/payment/initiate", paymentData);
      const { payment_session_id } = response.data;

      if (payment_session_id) {
        const cashfree = await load({ mode: "sandbox" });
        cashfree
          .checkout({
            paymentSessionId: payment_session_id,
            redirectTarget: "_modal",
          })
          .then(async (res) => {
            console.log("Payment initialized", res);

            // Notify backend to send emails
            await axios.post("http://localhost:5000/api/payment/success", {
              paymentData,
              productId: product._id,
            });

            console.log("Emails sent to user and admin.");
          })
          .catch((err) => {
            console.error("Error during checkout:", err);
          });
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (product) {
      const productToAdd = {
        id: product._id,
        title: product.title,
        price: product.price * quantity * rentalDays,
        images: product.images,
      };

      const isProductInCart = cart.some((item) => item.id === productToAdd.id);

      if (isProductInCart) {
        alert(`${product.title} is already in your cart!`);
      } else {
        addToCart(productToAdd);
        alert(`${product.title} has been added to your cart!`);
      }
    }
  };

  // Toggle Favorite
  const toggleFavorite = (productId) => {
    let updatedFavorites = [...favorites];
    if (updatedFavorites.includes(productId)) {
      updatedFavorites = updatedFavorites.filter((id) => id !== productId);
    } else {
      updatedFavorites.push(productId);
    }
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  // Handle adding a new review
  const handleAddReview = (newReview) => {
    setReviews((prevReviews) => [newReview, ...prevReviews]);
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div>
      <UpperNavbar />
      <div className="lg:hidden fixed top-4 left-4 z-10">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-800 text-white p-3 rounded-full shadow-md"
        >
          <span className="text-2xl">←</span>
        </button>
      </div>

      <div className="lg:flex lg:flex-row mt-10 sm:flex sm:flex-col">
        <div className="lg:flex lg:flex-row sm:flex sm:flex-col-reverse">
          <div className="lg:flex lg:flex-col gap-2 space-y-5 mr-7 mt-10 sm:flex sm:flex-row">
            {product.images.map((image, index) => (
              <img
                key={index}
                src={`http://localhost:5000/${image}`}
                alt="Product"
                className="w-16 h-16 border rounded-lg cursor-pointer"
                onClick={() => setSelectedImage(image)}
              />
            ))}
          </div>
          <div className="relative">
            <button
              onClick={() => toggleFavorite(product._id)}
              className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-lg text-red-600 text-xl"
            >
              {favorites.includes(product._id) ? "❤️" : "🤍"}
            </button>
            <img
              src={`http://localhost:5000/${selectedImage}`}
              alt="Product"
              className="h-[300px] w-full sm:w-full lg:h-[500px] lg:w-[700px] border-2 mb-6"
            />
          </div>
        </div>

        <div className="flex flex-col ml-4 mt-7 w-full mr-5">
          <h1 className="text-4xl font-bold">{product.title}</h1>
          <p className="mt-3 text-lg">{product.disc}</p>
          <hr className="my-4" />
          <p className="text-2xl mt-5">Price: ₹{product.price}</p>
          <p className="text-xl mt-5 text-red-600">{product.offer}% OFF</p>
          <hr className="my-4" />

          {/* Inputs for Quantity and Rental Days */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">Quantity</h4>
              <select
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Select quantity"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">Rental Days</h4>
              <select
                value={rentalDays}
                onChange={(e) => setRentalDays(parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Select rental days"
              >
                {[1, 2, 3, 4, 5, 6, 7].map((days) => (
                  <option key={days} value={days}>
                    {days} {days === 1 ? "day" : "days"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Total Amount Calculation */}
          <p className="text-2xl font-semibold mt-4">
            Total Amount: ₹{product.price * quantity * rentalDays}
          </p>

          {/* Buttons: Add to Cart and Buy Now */}
          <div className="lg:flex gap-6 mt-6 hidden">
            <button
              className="bg-yellow-400 text-white py-3 px-7 rounded-xl text-lg w-full"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
            <button
              className="bg-yellow-500 text-white py-3 px-7 rounded-xl text-lg w-full"
              onClick={handlePayment}
            >
              Buy Now
            </button>
          </div>

          {/* For small screens, the buttons are stacked vertically */}
          <div className="lg:hidden flex flex-col gap-4 mt-6">
            <button
              className="bg-yellow-400 text-white py-3 px-7 rounded-xl text-lg"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
            <button
              className="bg-yellow-500 text-white py-3 px-7 rounded-xl text-lg"
              onClick={handlePayment}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <ReviewSummaryWithDistribution
          reviews={reviews}
          setShowReviewForm={setShowReviewForm}
          showReviewForm={showReviewForm}
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

      <Footer />
    </div>
  );
}

export default SingleProduct;



