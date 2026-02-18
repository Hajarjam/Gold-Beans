import React from 'react';

const NewProducts = () => {
  const products = [
    { id: 1, name: 'Espresso Blend', price: '$12.99', image: '/assets/p1dash.jpg' },
    { id: 2, name: 'Single Origin', price: '$14.99', image: '/assets/p2dash.jpg' },
    { id: 3, name: 'Dark Roast', price: '$11.99', image: '/assets/p3dash.jpg' },
  ];

  return (
    <div className="w-full bg-brown rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-instrument-serif text-peach mb-4">New Products</h2>
      <div className="space-y-3">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="flex items-center gap-3 p-3 bg-peach-light rounded"
          >
            <img 
              src={product.image} 
              alt={product.name}
              className="w-12 h-12 rounded object-cover"
            />
            <div className="flex-1 min-w-0">
              <span className="text-charcoal font-semibold block truncate">{product.name}</span>
              <span className="text-peach font-semibold text-sm">{product.price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewProducts;
