import React from "react";
import { renderStars } from "./Utils";

const ReviewItem = ({ review }) => {
  return (
    <li className="py-4">
      <div className="flex items-center mb-1">
        <span className="font-medium mr-2">{review.customerName}</span>
        <span className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
      </div>
      <div className="mb-2">{renderStars(review.rating)}</div>
      <p className="text-gray-600 mb-3">{review.comment}</p>
    </li>
  );
};

export default ReviewItem;