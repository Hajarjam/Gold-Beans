import React from "react";

const NewProducts = ({ products }) => {
  if (!products || products.length === 0) return <p>No products found.</p>;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">New Products</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product._id} className="bg-peach/20 p-4 rounded shadow">
            <h4 className="font-medium">{product.name}</h4>
            <p className="text-sm text-peach-light/80">Roast: {product.roastLevel || "-"}</p>
            <p className="text-sm text-peach-light/80">Price: ${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewProducts;
