import { useState } from "react";
import "@fontsource/instrument-serif";
import "@fontsource/instrument-sans";
import "@fontsource/roboto-serif";
import DarkNavbar from "../../components/common/DarkNavbar";
import Footer from "../../components/common/Footer";

const VisaIcon = () => (
  <svg viewBox="0 0 48 16" className="h-5 w-auto" fill="none">
    <text x="0" y="13" fontFamily="serif" fontWeight="bold" fontSize="14" fill="#1A1F71">VISA</text>
  </svg>
);

const MastercardIcon = () => (
  <svg viewBox="0 0 38 24" className="h-5 w-auto">
    <circle cx="14" cy="12" r="10" fill="#EB001B" />
    <circle cx="24" cy="12" r="10" fill="#F79E1B" />
    <path d="M19 5.8a10 10 0 0 1 0 12.4A10 10 0 0 1 19 5.8z" fill="#FF5F00" />
  </svg>
);

export default function CheckoutPage() {
  const [cardType, setCardType] = useState("visa");
  const [coupon, setCoupon] = useState("");
  const [form, setForm] = useState({
    firstName: "", lastName: "", address: "",
    apartment: "", city: "", state: "", zip: "",
    phone: "", cardNumber: "", cardHolder: "",
    expiration: "09/26", cvv: "145", savePayment: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const inputClass =
    "w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white";

  return (
    <>
    <DarkNavbar />
    <div className="min-h-screen py-20 bg-peach-light font-sans text-gray-800">
      {/* Breadcrumb */}
      <div className=" px-10 py-2 text-xs text-gray-500">
        Home &gt; Your Cart &gt; Checkout
      </div>

      {/* Main content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 px-10 py-6 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 max-w-5xl">
        {/* Left */}
        <div className="flex flex-col gap-6">
          {/* Delivery */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-5">Delivery</h2>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <input name="firstName" placeholder="First name" className={inputClass} onChange={handleChange} />
              <input name="lastName" placeholder="Last name" className={inputClass} onChange={handleChange} />
            </div>

            <div className="relative mb-3">
              <input name="address" placeholder="Address" className={inputClass} onChange={handleChange} />
              <svg className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <input name="city" placeholder="City" className={inputClass} onChange={handleChange} />
              <input name="zip" placeholder="ZIP code" className={inputClass} onChange={handleChange} />
            </div>

            <div className="relative">
              <input name="phone" placeholder="Phone number" className={inputClass} onChange={handleChange} />
              <span className="absolute right-3 top-2.5 text-gray-400 text-xs border border-gray-300 rounded-full w-4 h-4 flex items-center justify-center">?</span>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-5">Payment Method</h2>

            {/* Card type selector */}
            <div className="flex gap-3 mb-5">
              <button
                onClick={() => setCardType("visa")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all text-sm font-medium ${
                  cardType === "visa"
                    ? "border-black bg-peach text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
                }`}
              >
                <VisaIcon />
                <span className={cardType === "visa" ? "text-white" : "text-[#1A1F71]"}>Visa</span>
              </button>
              <button
                onClick={() => setCardType("mastercard")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all text-sm font-medium ${
                  cardType === "mastercard"
                    ? "border-black bg-peach text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
                }`}
              >
                <MastercardIcon />
                <span className="text-gray-700">Mastercard</span>
              </button>
            </div>

           

            <label className="block text-sm font-medium mb-1">Card Number</label>
            <input
              name="cardNumber"
              placeholder={cardType === "visa" ? "4111 1111 1111 1111" : "5500 0000 0000 0004"}
              className={`${inputClass} mb-4`}
              onChange={handleChange}
            />

            <label className="block text-sm font-medium mb-1">Card Name Holder</label>
            <input name="cardHolder" placeholder="Name on card" className={`${inputClass} mb-4`} onChange={handleChange} />

            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Expiration Date</label>
                <input name="expiration" 
                placeholder="MM/YY" className={inputClass} onChange={handleChange} />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">CVV</label>
                <input name="cvv" placeholder="123" className={inputClass} onChange={handleChange} />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" name="savePayment" className="rounded" onChange={handleChange} />
              Save payment informations
            </label>
          </div>
        </div>

        {/* Right - Order Summary */}
        <div>
          
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <input
              type="text"
              placeholder="Enter coupon code here"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              className={`${inputClass} mb-5`}
            />

            <div className="border-t border-gray-100 pt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">XX.XX</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-3">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-400 text-xs self-center">Enter Shipping Address</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>XX.XX</span>
              </div>
            </div>

            <button className="w-full mt-5 bg-brown text-white py-3 rounded-lg text-sm font-medium hover:bg-peach transition-colors">
              Continue payment
            </button>
             <p className="text-center text-xs text-gray-500 mt-3">
            Not ready to checkout?{" "}
            <a href="#" className="font-semibold underline">Continue Shopping</a>
          </p>
          </div>

         
        </div>
      </main>
    </div>
    <Footer />
    </>
  );
}