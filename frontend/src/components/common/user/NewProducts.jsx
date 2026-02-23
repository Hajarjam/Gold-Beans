import React from "react";
import { Link } from "react-router-dom";

const NewProducts = ({ products }) => {
  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-2">New Products</h3>

      {!products || products.length === 0 ? (
        <div className="bg-peach/20 px-3 py-2 rounded text-sm text-peach h-full flex items-center">
          No products found.
        </div>
      ) : (
        <div className="space-y-2">
          {products.map((product) => (
            <Link
              key={product._id}
              to={`/coffees/${product._id}`}
              className="bg-peach/20 px-3 py-2 rounded shadow-sm flex items-center gap-3 hover:bg-peach/30 transition-colors no-underline"
            >
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-8 h-8 rounded object-cover shrink-0"
              />
              <h4 className="font-medium text-sm text-peach truncate">
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
