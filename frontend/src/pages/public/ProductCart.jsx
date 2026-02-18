// src/pages/Checkout.jsx
import React, { useState } from 'react';
import DarkNavbar from '../../components/layouts/DarkNavbar';
import Navbar from '../../components/layouts/Navbar';   
import Footer from '../../components/layouts/Footer';

function ProductCart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Coffee_1',
      image: '/assets/machine.jpg',
      buyOption: 'One-time Purchase',
      delivery: '',
      quantity: 1,
      price: 'XX.XX',
    },
    {
      id: 2,
      name: 'Coffee_2',
      image: '/assets/machine.jpg',
      buyOption: 'Subscribe',
      delivery: 'every : 2 weeks',
      quantity: 1,
      price: 'XX.XX',
    },
     {
      id: 2,
      name: 'Coffee_2',
      image: '/assets/machine.jpg',
      buyOption: 'Subscribe',
      delivery: 'every : 2 weeks',
      quantity: 1,
      price: 'XX.XX',
    },
     

  ]);

  const subtotal = 'XX.XX';
  const shipping = 'Calculated at the next step';
  const total = 'XX.XX';

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  return (

    
    <>
<DarkNavbar />
    <div className="bg-[#fdfaf7] min-h-screen py-20 px-4 sm:px-6 lg:px-8 text-gray-800 ">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-6">
          Home <span className="mx-1.5">&gt;</span> Your Cart
        </nav>

        <h1 className="text-4xl font-bold mb-10">Your cart</h1>

        <div className="flex flex-col lg:flex-row lg:gap-10 xl:gap-12">
          {/* Cart Items Section */}
          <div className="lg:flex-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              {cartItems.map((item, index) => (
                <div key={item.id}>
                  <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6">
                    {/* Image */}
                    <div className="w-full sm:w-32 md:w-40 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-auto object-cover rounded-lg"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-semibold">{item.name}</h3>
                        <button className="text-sm text-gray-500 hover:text-gray-700 underline">
                          Remove
                        </button>
                      </div>

                      <div className="space-y-1.5 text-sm text-gray-600 mb-auto">
                        <p>Buy Option: {item.buyOption}</p>
                        {item.delivery && <p>Delivery every {item.delivery}</p>}

                        {/* Quantity controls – no border, smaller size */}
                        <div className="flex items-center gap-2">
                          <span>Quantity:</span>
                          <div className="flex items-center text-sm">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-black transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-black transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 sm:mt-0 text-right">
                        <p className="text-xl font-bold">{item.price}</p>
                      </div>
                    </div>
                  </div>

                  {index < cartItems.length - 1 && (
                    <hr className="border-gray-200 mx-6 sm:mx-8" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-96 xl:w-[380px] mt-10 lg:mt-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-7 sticky top-6">
              <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>

              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Enter coupon code here"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 transition"
                />
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-gray-500">{shipping}</span>
                </div>
                <hr className="border-gray-200 my-5" />
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>{total}</span>
                </div>
              </div>

              <button className="w-full mt-8 bg-black text-white py-4 rounded-lg font-medium text-lg hover:bg-gray-900 transition duration-200">
                Continue to checkout
              </button>

              <p className="text-center text-sm text-gray-600 mt-6">
                Not ready to checkout?{' '}
                <a href="#" className="underline hover:text-gray-800">
                  Continue Shopping
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      
    </div>

    <Footer />

    
    </>
    
  );
}

export default ProductCart;