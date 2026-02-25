import React from "react";
import { Link } from "react-router-dom";

const NewProducts = ({ products }) => {
  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-semibold text-[#3B170D] mb-2">New Products</h3>

      {!products || products.length === 0 ? (
        <div className="rounded-xl border border-[#EADFD7] bg-[#FDF9F5] px-3 py-2 text-sm text-[#3B170D]/70 h-full flex items-center">
          No products found.
        </div>
      ) : (
        <div className="space-y-2">
          {products.map((product) => (
            <Link
              key={product._id}
              to={`/coffees/${product._id}`}
              className="rounded-xl border border-[#EADFD7] bg-white px-3 py-2 shadow-sm flex items-center gap-3 hover:bg-[#FDF9F5] transition-colors no-underline"
            >
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-8 h-8 rounded object-cover shrink-0"
              />
              <h4 className="font-medium text-sm text-[#3B170D] truncate">
                {product.title}
              </h4>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewProducts;
