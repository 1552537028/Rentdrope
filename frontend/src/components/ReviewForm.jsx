import React, { useState } from "react";
import axios from 'axios';

const ReviewForm = ({ productId, onAddReview, setShowReviewForm }) => {
  const [newReview, setNewReview] = useState({ rating: 0, comment: "", customerName: "" });

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  const handleRatingChange = (rating) => {
    setNewReview({ ...newReview, rating });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!newReview.comment.trim() || !newReview.customerName.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    if (newReview.rating === 0) {
      alert("Please select a rating.");
      return;
    }

    try {
      const response = await axios.post(`https://rentdrope-1.onrender.com/api/reviews/products/${productId}`, newReview);
      onAddReview(response.data); // Add the new review to the list
      setNewReview({ rating: 0, comment: "", customerName: "" }); // Clear the form
      setShowReviewForm(false); // Hide the form
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit the review. Please try again later.");
    }
  };

  return (
    <form onSubmit={handleSubmitReview} className="mt-6 border-t border-gray-200 pt-4">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
        <input
          type="text"
          name="customerName"
          value={newReview.customerName}
          onChange={handleReviewChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your name"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating</label>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleRatingChange(star)}
              className="focus:outline-none"
              aria-label={`Rate ${star} stars`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 ${star <= newReview.rating ? "text-yellow-400" : "text-gray-300"}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-1">Selected Rating: {newReview.rating} ★</p>
      </div>

      <div className="mb-4">
        <label htmlFor="review-comment" className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
        <textarea
          id="review-comment"
          name="comment"
          value={newReview.comment}
          onChange={handleReviewChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder="Share your experience with this product..."
          required
        ></textarea>
      </div>

      <button
        type="submit"
        className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
