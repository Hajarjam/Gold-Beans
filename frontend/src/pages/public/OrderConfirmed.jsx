// src/pages/OrderConfirmed.jsx
import React from 'react';
import DarkNavbar from '../../components/common/DarkNavbar';
import { Link } from 'react-router-dom';
import "@fontsource/instrument-serif";
import "@fontsource/instrument-sans";
import "@fontsource/roboto-serif";
import Footer from '../../components/common/Footer';

function OrderConfirmed() {
  // Sample data - in real app this would come from order confirmation / state / props
  const orderDetails = {
    shipping: {
      name: 'Houssam',
      address: 'Tangier, Tanger-Tetouan-Al Hoceima, Morocco',
      method: 'Standard Shipping',
      estimatedDelivery: 'February 18 – 22, 2026',
    },
    items: [
      {
        name: 'Coffee_2 – Decaf 100% Arabica',
        image: '/assets/machine.jpg',
        quantity: 1,
        price: 'XX.XX',
      },
      // add more real items here when you have them
    ],
  };

  return (
    <>
    <DarkNavbar />
    <div className="bg-[#fdfaf7] min-h-screen">
      {/* Main Content – no header/navbar */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Success / Thank You Section */}
          <div className="pt-16 pb-10 px-6 lg:px-12 text-center">
            <img src="/assets/check.png" alt="Checkmark" className="w-24 h-24 mx-auto mb-8" />
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-5">
              Order Confirmed!
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Thank you for your purchase. Your order has been successfully placed and is being processed.
            </p>
          </div>

          {/* Details Sections */}
          <div className="px-6 lg:px-12 pb-12 lg:pb-16">
            {/* Shipment Information */}
            <div className="mb-14">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Shipment Information
              </h2>
              <div className="bg-[#F3F3F3] rounded-xl p-7  border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-base">
                  <div>
                    <p className="text-gray-500 mb-1.5">Name</p>
                    <p className="font-medium">{orderDetails.shipping.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1.5">Address</p>
                    <p className="font-medium">{orderDetails.shipping.address}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1.5">Shipping Method</p>
                    <p className="font-medium">{orderDetails.shipping.method}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1.5">Estimated Delivery</p>
                    <p className="font-medium">{orderDetails.shipping.estimatedDelivery}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Order Items
              </h2>
              <div className=" bg-[#F3F3F3] border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-200">
                {orderDetails.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-6 p-6"
                  >
                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-lg text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600 mt-1.5">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right font-medium text-lg text-gray-900">
                      {item.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Optional action buttons */}
        <div className="mt-12 text-center space-x-6">
          
          <Link
            to="/"
            className="bg-[#3d2b1f] text-white inline-block px-10 py-4 rounded-full font-medium text-lg hover:bg-[#2a1e16] transition"
          >
            Continue Shopping →
          </Link>
        </div>
      </main>
    </div>
    <Footer />
    </>
  );
}

export default OrderConfirmed;
