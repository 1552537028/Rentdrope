import React from "react";
import { renderStars } from "./Utils";

const ReviewSummaryWithDistribution = ({ reviews, setShowReviewForm, showReviewForm }) => {
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  const ratingCounts = [0, 0, 0, 0, 0]; // 5, 4, 3, 2, 1 stars
  reviews.forEach((review) => {
    ratingCounts[5 - review.rating]++;
  });

  const totalReviews = reviews.length;
  const maxCount = Math.max(...ratingCounts);

  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h3 className="text-lg font-semibold">Customer Reviews</h3>
        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="mt-2 sm:mt-0 bg-black text-white px-4 py-2 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-white"
        >
          {showReviewForm ? "Cancel" : "Write a Review"}
        </button>
      </div>

      <div className="mt-4">
        <div className="text-center">
          <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
          <div className="mt-1">{renderStars(Math.round(averageRating))}</div>
          <div className="text-sm text-gray-600 mt-1">{reviews.length} reviews</div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="mt-4">
        <h4 className="text-lg font-semibold mb-2">Rating Distribution</h4>
        <div className="flex flex-col">
          {[5, 4, 3, 2, 1].map((rating, index) => (
            <div key={rating} className="flex items-center mb-1">
              <span className="w-10 text-center">{rating} ★</span>
              <div className="flex-1 bg-gray-200 h-4 rounded-full overflow-hidden">
                <div
                  className="bg-yellow-400 h-full"
                  style={{
                    width: `${maxCount ? (ratingCounts[index] / totalReviews) * 100 : 0}%`,
                  }}
                ></div>
              </div>
              <span className="ml-2 text-sm text-gray-600">{ratingCounts[index]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewSummaryWithDistribution;