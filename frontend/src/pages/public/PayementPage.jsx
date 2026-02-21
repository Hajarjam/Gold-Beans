import { useState, useEffect, useContext, useMemo } from "react";
import "@fontsource/instrument-serif";
import "@fontsource/instrument-sans";
import "@fontsource/roboto-serif";
import DarkNavbar from "../../components/common/DarkNavbar";
import Footer from "../../components/common/Footer";
import CartContext from "../../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URLL;

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
  const navigate = useNavigate();
  const [cardType, setCardType] = useState("visa");
  const [coupon, setCoupon] = useState("");
  const [loading, setLoading] = useState(false);
  const { items, clearCart } = useContext(CartContext);
  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0), 0);
  }, [items]);

  const shipping = 0; // ou calcul plus tard
  const total = subtotal + shipping;


  const [form, setForm] = useState({
    firstName: "", lastName: "", address: "",
    city: "", country: "", zip: "",
    phone: "", cardNumber: "", cardHolder: "",
    expiration: "09/26", cvv: "145", savePayment: false,
  });

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const loadMe = async () => {
      try {
        const r = await fetch(`${API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const me = await r.json();
        if (!r.ok) throw new Error(me?.message || "me error");

        setForm((prev) => ({
          ...prev,
          firstName: me.firstName || "",
          lastName: me.lastName || "",
        }));

        // OPTIONNEL: charger dernière adresse
        const r2 = await fetch(`${API_URL}/api/clients/me/addresses`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (r2.ok) {
          const addresses = await r2.json();
          const last = Array.isArray(addresses) && addresses.length ? addresses[addresses.length - 1] : null;
          if (last) {
            setForm((prev) => ({
              ...prev,
              address: last.street || "",
              city: last.city || "",
              zip: last.zip || "",
              country: last.country || "Morocco",
            }));
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    if (token) loadMe();
  }, [token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const getCartItems = () => {
    const raw = localStorage.getItem("cartItems");
    return raw ? JSON.parse(raw) : [];
  };

  const onFakePay = async () => {

    setLoading(true);
    try {
      if (!items || items.length === 0) {
        throw new Error("Cart empty (frontend)");
      }

      const payloadItems = items.map((it) => {
        const productType =
          it.productType || (it.grind || it.size || it.purchaseType ? "coffee" : "machine");

        return {
          productType,          // ✅ REQUIRED
          productId: it._id,     // ✅ REQUIRED
          name: it.name,
          price: Number(it.price || 0),
          quantity: Number(it.qty || 1),
          
          buyOption: it.purchaseType || "oneTime",
          deliveryEvery: it.deliveryFrequency || "",
        };
      });


      const body = {
        items: payloadItems,
        address: {
          street: form.address,
          city: form.city,
          zip: form.zip,
          country: form.country,
          phone: form.phone,
        },
        cardType,
        cardNumber: form.cardNumber,
      };

      const r = await fetch(`${API_URL}/api/checkout/fake`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await r.json();
      if (!r.ok) throw new Error(data?.message || "Checkout failed");

      const confirmationOrder = {
        address: body.address,        // ✅ street/city/zip/country/phone
        items: payloadItems.map((it) => ({
          name: it.name,
          quantity: it.quantity,
          price: it.price,
          image: it.image,            // si tu l’as dans le cart, sinon laisse
        })),
        cardType: body.cardType,      // ✅ visa/mastercard
        total,
        subtotal,
        shipping,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem("lastOrder", JSON.stringify(confirmationOrder));

      clearCart(); // 
      navigate("/client/confirmed", { state: { order: confirmationOrder } });
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
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
                <input
                  name="firstName"
                  placeholder="First name"
                  className={inputClass}
                  value={form.firstName}
                  onChange={handleChange}
                />
                <input
                  name="lastName"
                  placeholder="Last name"
                  className={inputClass}
                  value={form.lastName}
                  onChange={handleChange}
                />
              </div>


              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <input
                  name="address"
                  value={form.address}
                  placeholder="Address"
                  className={`${inputClass} md:col-span-2`}
                  onChange={handleChange}
                />

                <select
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Country</option>
                  <option value="Morocco">Morocco</option>
                  <option value="France">France</option>
                  <option value="Spain">Spain</option>
                  <option value="Germany">Germany</option>
                  <option value="USA">USA</option>
                </select>
              </div>


              <div className="grid grid-cols-2 gap-3 mb-3">
                <input name="city" placeholder="City" className={inputClass} onChange={handleChange} />
                <input name="zip" placeholder="ZIP code" className={inputClass} onChange={handleChange} />
              </div>

              <div className="flex gap-2">
                <select
                  name="phoneCode"
                  value={form.phoneCode || "+212"}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, phoneCode: e.target.value }))
                  }
                  className="w-28 border border-gray-200 rounded-md px-2 py-2.5 text-sm bg-white"
                >
                  <option value="+212">🇲🇦 +212</option>
                  <option value="+33">🇫🇷 +33</option>
                  <option value="+34">🇪🇸 +34</option>
                  <option value="+49">🇩🇪 +49</option>
                  <option value="+1">🇺🇸 +1</option>
                </select>

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  placeholder="Phone number"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  className="flex-1 border border-gray-200 rounded-md px-3 py-2.5 text-sm"
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      phone: e.target.value.replace(/\D/g, ""), // only numbers
                    }))
                  }
                />
              </div>

            </div>

            {/* Payment */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-5">Payment Method</h2>

              {/* Card type selector */}
              <div className="flex gap-3 mb-5">
                <button
                  onClick={() => setCardType("visa")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all text-sm font-medium ${cardType === "visa"
                    ? "border-black bg-peach text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
                    }`}
                >
                  <VisaIcon />
                  <span className={cardType === "visa" ? "text-white" : "text-[#1A1F71]"}>Visa</span>
                </button>
                <button
                  onClick={() => setCardType("mastercard")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all text-sm font-medium ${cardType === "mastercard"
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
                  <span className="font-medium">{subtotal.toFixed(2)} $</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-3">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">{shipping.toFixed(2)} $</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{total.toFixed(2)} $</span>
                </div>
              </div>

              <button
                disabled={loading}
                onClick={onFakePay}
                className="w-full mt-5 bg-brown text-white py-3 rounded-lg text-sm font-medium hover:bg-peach transition-colors disabled:opacity-60"
              >
                {loading ? "Processing..." : "Continue payment"}
              </button>
              <p className="text-center text-xs text-gray-500 mt-3">
                Not ready to checkout?{" "}
                <Link to="/coffees" className="font-semibold underline">
                  Continue Shopping
                </Link>

              </p>
            </div>


          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}