import React from "react";
import ReviewItem from "./ReviewItem";

const ReviewList = ({ reviews }) => {
  return (
    <div className="p-4">
      {reviews.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No reviews yet. Be the first to review this product!</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {reviews.map((review) => (
            <ReviewItem key={review._id} review={review} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReviewList;