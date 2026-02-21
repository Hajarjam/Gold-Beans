
import React, { useContext } from 'react';
import DarkNavbar from '../../components/common/DarkNavbar';
import Footer from '../../components/common/Footer';
import CartContext from '../../contexts/CartContext';
import Breadcrumb from '../../components/common/Breadcrumb';
import { Link } from 'react-router-dom';


function ProductCart() {
  const { items, removeFromCart, updateQty } = useContext(CartContext);
  const getProductLink = (item) => {
    const inferredType = item.productType || (item.grind || item.size || item.purchaseType ? 'coffee' : 'machine');
    return inferredType === 'coffee' ? `/coffees/${item._id}` : `/machine/${item._id}`;
  };

  return (
    <>
      <DarkNavbar />
      <div className="bg-peach-light min-h-screen py-20 px-4 sm:px-6 lg:px-8 text-gray-800 ">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <Breadcrumb />

          <h1 className="text-4xl font-bold mb-10">Your cart</h1>

          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600 mb-6">Your cart is empty</p>
              <Link to="/coffees" className="text-charcoal hover:text-brown underline font-semibold">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row lg:gap-10 xl:gap-12">
              {/* Cart Items Section */}
              <div className="lg:flex-1">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                  {items.map((item, index) => (
                    <div key={item._id}>
                      <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6">
                        {/* Image */}
                        <div className="w-full sm:w-32 md:w-40 flex-shrink-0">
                          <Link to={getProductLink(item)} className="block">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-auto object-cover rounded-lg hover:opacity-90 transition-opacity"
                            />
                          </Link>
                        </div>

                        {/* Details */}
                        <div className="flex-1 flex flex-col">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <Link to={getProductLink(item)} className="hover:underline">
                                <h3 className="text-xl font-semibold">{item.name}</h3>
                              </Link>
                              {item.size && <p className="text-sm text-gray-500">{item.size}</p>}
                              {item.grind && <p className="text-sm text-gray-500">Grind: {item.grind}</p>}
                            </div>
                            <button
                              onClick={() => removeFromCart(item._id)}
                              className="text-sm text-gray-500 hover:text-red-600 underline">
                              Remove
                            </button>
                          </div>

                          <div className="space-y-1.5 text-sm text-gray-600 mb-auto">
                            {item.purchaseType && <p>Buy Option: {item.purchaseType === 'one-time' ? 'One-time Purchase' : 'Subscribe'}</p>}
                            {item.deliveryFrequency && <p>Delivery every: {item.deliveryFrequency}</p>}

                            {/* Quantity controls */}
                            <div className="flex items-center gap-2">
                              <span>Quantity:</span>
                              <div className="flex items-center text-sm">
                                <button
                                  onClick={() => updateQty(item, item.qty - 1)}
                                  className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-black transition-colors"
                                  disabled={item.qty <= 1}
                                >
                                  -
                                </button>
                                <span className="w-8 text-center font-medium">
                                  {item.qty}
                                </span>
                                <button
                                  onClick={() => updateQty(item, item.qty + 1)}
                                  className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-black transition-colors"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 sm:mt-0 text-right">
                            <p className="text-xl font-bold">${(item.price * item.qty).toFixed(2)}</p>
                            <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                          </div>
                        </div>
                      </div>

                      {index < items.length - 1 && (
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
                      <span>${items.reduce((sum, item) => sum + (item.price * item.qty), 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="text-gray-500">Calculated at the next step</span>
                    </div>
                    <hr className="border-gray-200 my-5" />
                    <div className="flex justify-between text-base font-semibold">
                      <span>Total</span>
                      <span>${items.reduce((sum, item) => sum + (item.price * item.qty), 0).toFixed(2)}</span>
                    </div>
                  </div>



                  <button className="w-full mt-8 bg-black text-white py-4 rounded-lg font-medium text-lg hover:bg-gray-900 transition duration-200">
                    <Link to="/client/payment">
                      Continue to checkout
                    </Link>

                  </button>

                  <p className="text-center text-sm text-gray-600 mt-6">
                    Not ready to checkout?{' '}
                    <Link to="/coffees" className="underline hover:text-gray-800">
                      Continue Shopping
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default ProductCart;
