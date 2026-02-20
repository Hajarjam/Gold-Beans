import { useState, useEffect, useContext } from "react";
import { Coffee, Minus, Plus } from "lucide-react";
import { useParams } from "react-router-dom";
import PeachLayout from "../../components/layouts/PeachLayout";

import publicApi from "../../api/publicApi";
import { BreadcrumbContext } from "../../contexts/BreadcrumbContext";
import CartContext from "../../contexts/CartContext";
import Breadcrumb from "../../components/common/Breadcrumb";

export default function CoffeeDetailPage() {
  const { id } = useParams();
  const { setBreadcrumbData } = useContext(BreadcrumbContext);
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedSize, setSelectedSize] = useState("medium");
  const [selectedGrind, setSelectedGrind] = useState("whole-bean");
  const [quantity, setQuantity] = useState(1);
  const [purchaseType, setPurchaseType] = useState("one-time");
  const [deliveryFrequency, setDeliveryFrequency] = useState("2-weeks");
  const [isSizeOpen, setIsSizeOpen] = useState(false);
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);

  // Fetch product data from backend
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await publicApi.getProductDetails(id);
        const productData = data.data || data;
        setProduct(productData);
        // Set breadcrumb data
        setBreadcrumbData({ [id]: productData.name });
        // Set default size
        if (productData.sizes && productData.sizes.length > 0) {
          setSelectedSize(productData.sizes[0]);
        }
      } catch (err) {
        setError(err.message || "Failed to load product");
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, setBreadcrumbData]);

  const handleQuantityChange = (delta) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = {
      _id: product._id,
      productType: "coffee",
      name: product.name,
      price: purchaseType === "subscribe" ? product.price * 0.9 : product.price,
      size: selectedSize,
      grind: selectedGrind,
      qty: quantity,
      purchaseType,
      deliveryFrequency:
        purchaseType === "subscribe" ? deliveryFrequency : null,
      image:
        product.images && product.images.length > 0
          ? product.images[0]
          : "/assets/columbianbrewcoffee.jpg",
    };

    addToCart(cartItem);
  };

  return (
    <PeachLayout>
      <div className="py-2 px-4 md:px-8 lg:px-12 flex flex-row">
        {" "}
        <Breadcrumb />
      </div>
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6 pt-24 md:pt-32">
        {loading && (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="text-2xl font-instrument-serif text-charcoal">
                Loading product...
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center text-red-600">
              <div className="text-2xl font-instrument-serif mb-2">Error</div>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {product && (
          <div>
            {/* Main Product Section - 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[360px_1fr_300px] gap-5 md:gap-6 mb-8 md:mb-12">
              {/* Column 1: Product Image */}
              <div>
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-auto max-h-[250px] md:max-h-[400px] object-cover"
                  />
                </div>
              </div>

              {/* Column 2: Product Details */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl md:text-4xl font-bold font-instrument-serif text-charcoal mb-2 md:mb-3">
                    {product.name}
                  </h1>
                  <p className="text-xs md:text-sm text-dark-brown leading-relaxed font-instrument-sans">
                    {product.description}
                  </p>
                </div>

                {/* Bag Size */}
                <div>
                  <label className="block text-xs md:text-sm font-bold text-charcoal mb-1 md:mb-2 font-instrument-sans">
                    Bag Size
                  </label>
                  <div className="relative">
                    <select
                      value={selectedSize || "medium"}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      onClick={() => setIsSizeOpen(!isSizeOpen)}
                      className="w-full px-3 md:px-4 py-2 md:py-2.5 bg-white border border-peach rounded-lg text-xs md:text-sm text-charcoal 
                             focus:outline-none cursor-pointer appearance-none pr-8 md:pr-10"
                    >
                      <option value="small">250g</option>
                      <option value="medium">500g</option>
                      <option value="large">1kg</option>
                    </select>
                    <img
                      src="/assets/downarrow.png"
                      className={`absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 w-2.5 md:w-3 h-2.5 md:h-3 transition-transform duration-300 pointer-events-none ${
                        isSizeOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>

                {/* Select Your Grind */}
                <div>
                  <label className="block text-xs md:text-sm font-bold text-charcoal mb-1 md:mb-2 font-instrument-sans">
                    Select Your Grind
                  </label>
                  <div className="flex gap-2 md:gap-3">
                    <button
                      onClick={() => setSelectedGrind("whole-bean")}
                      className={`flex-1 px-2 md:px-4 py-2 md:py-2.5 rounded-lg border flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm transition-colors
                      ${
                        selectedGrind === "whole-bean"
                          ? "border-charcoal bg-white text-charcoal"
                          : "border-transparent bg-transparent text-dark-brown hover:border-charcoal"
                      }`}
                    >
                      <Coffee className="w-3 md:w-4 h-3 md:h-4" />
                      <span className="hidden sm:inline">Whole Bean</span>
                      <span className="sm:hidden">Whole</span>
                    </button>
                    <button
                      onClick={() => setSelectedGrind("ground")}
                      className={`flex-1 px-2 md:px-4 py-2 md:py-2.5 rounded-lg border flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm transition-colors
                      ${
                        selectedGrind === "ground"
                          ? "border-charcoal bg-white text-charcoal"
                          : "border-transparent bg-transparent text-dark-brown hover:border-charcoal"
                      }`}
                    >
                      <svg
                        className="w-3 md:w-4 h-3 md:h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="2" />
                        <circle cx="6" cy="8" r="1.5" />
                        <circle cx="18" cy="8" r="1.5" />
                        <circle cx="6" cy="16" r="1.5" />
                        <circle cx="18" cy="16" r="1.5" />
                      </svg>
                      Ground
                    </button>
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-xs md:text-sm font-bold text-charcoal mb-1 md:mb-2 font-instrument-sans">
                    Quantity
                  </label>
                  <div className="inline-flex items-center border border-peach rounded-lg bg-white">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="px-2 md:px-4 py-1.5 md:py-2 hover:bg-peach-light transition-colors text-charcoal"
                    >
                      <Minus className="w-3 md:w-4 h-3 md:h-4" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="w-8 md:w-12 text-center border-x border-peach py-1.5 md:py-2 focus:outline-none text-charcoal text-xs md:text-sm"
                    />
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="px-2 md:px-4 py-1.5 md:py-2 hover:bg-peach-light transition-colors text-charcoal"
                    >
                      <Plus className="w-3 md:w-4 h-3 md:h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Column 3: Purchase Options Card */}
              <div className="bg-white rounded-lg border border-peach p-4 md:p-5 h-fit mt-8 md:mt-10 lg:mt-20 col-span-1 md:col-span-2 lg:col-span-1">
                <div className="space-y-4">
                  {/* One-time Purchase */}
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="purchase-type"
                        value="one-time"
                        checked={purchaseType === "one-time"}
                        onChange={(e) => setPurchaseType(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-charcoal font-instrument-sans">
                        One-time Purchase
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-charcoal">
                       {product.price}$
                    </span>
                  </label>

                  {/* Subscribe */}
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="purchase-type"
                        value="subscribe"
                        checked={purchaseType === "subscribe"}
                        onChange={(e) => setPurchaseType(e.target.value)}
                        className="w-4 h-4"
                      />

                      <span className="text-sm text-charcoal font-instrument-sans">
                        Subscribe
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-charcoal">
                      {(product.price * 0.9).toFixed(2)}$
                    </span>
                  </label>

                  {/* Delivery Frequency */}
                  {purchaseType === "subscribe" && (
                    <div className="pt-2">
                      <label className="block text-xs md:text-sm text-dark-brown mb-1 md:mb-2 font-instrument-sans">
                        Deliver every
                      </label>
                      <div className="relative">
                        <select
                          value={deliveryFrequency}
                          onChange={(e) => setDeliveryFrequency(e.target.value)}
                          onClick={() => setIsDeliveryOpen(!isDeliveryOpen)}
                          className="w-full px-3 py-2 bg-white border border-peach-light rounded-lg text-xs md:text-sm text-charcoal 
                                 focus:outline-none focus:border-peach cursor-pointer appearance-none pr-8"
                        >
                          <option value="1-week">Every week</option>
                          <option value="2-weeks">Every 2 weeks</option>
                          <option value="3-weeks">Every 3 weeks</option>
                          <option value="1-month">Monthly</option>
                        </select>
                        <img
                          src="/assets/downarrow.png"
                          className={`absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 w-2.5 md:w-3 h-2.5 md:h-3 transition-transform duration-300 pointer-events-none ${
                            isDeliveryOpen ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </div>
                  )}

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-charcoal text-white text-xs md:text-sm font-medium py-2 md:py-2.5 px-3 md:px-4 rounded-lg
                                 hover:bg-brown transition-colors mt-3 md:mt-4 font-instrument-sans"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-peach my-8 md:my-10"></div>

            {/* Product Information Section */}
            <div className="px-2 md:px-6 py-8 md:py-10">
              <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-8 lg:gap-16">
                {/* Flavor Profile */}
                <div className="flex-1 flex flex-col items-center mb-8 md:mb-0">
                  <div className="w-16 md:w-20 h-16 md:h-20 bg-white rounded-full flex items-center justify-center mb-4 md:mb-6">
                    <img src="/assets/taste&roast.png" alt="Flavor profile" />
                  </div>

                  <h3 className="text-sm md:text-base font-bold text-zinc-900 mb-4 md:mb-8">
                    Flavor Profile :
                  </h3>

                  <div className="w-full max-w-md">
                    <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-4 md:gap-6 mb-4 md:mb-8">
                      <div className="text-center md:text-left flex-shrink-0">
                        <div className="text-xs md:text-sm font-semibold text-brown mb-1">
                          Roast Level :
                        </div>
                        <div className="text-xs md:text-sm text-grey">
                          {product.roastLevel}
                        </div>
                      </div>

                      <div className="hidden md:block w-px h-12 bg-brown flex-shrink-0"></div>

                      <div className="text-center md:text-left flex-shrink-0">
                        <div className="text-xs md:text-sm font-semibold text-brown mb-1">
                          Tasting Notes
                        </div>
                        <div className="text-xs md:text-sm text-grey leading-relaxed">
                          {product.tasteProfile &&
                            product.tasteProfile.join(", ")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Origin & Sourcing */}
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-16 md:w-20 h-16 md:h-20 bg-white rounded-full flex items-center justify-center mb-4 md:mb-6">
                    <img
                      src="/assets/Origin-source.png"
                      alt="Origin sourcing"
                    />
                  </div>

                  <h3 className="text-sm md:text-base font-bold text-zinc-900 mb-4 md:mb-8">
                    Origin & Sourcing
                  </h3>

                  <div className="w-full max-w-md">
                    <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-4 md:gap-6">
                      <div className="text-center md:text-left flex-shrink-0">
                        <div className="text-xs md:text-sm font-semibold text-brown mb-1">
                          Country of Origin :
                        </div>
                        <div className="text-xs md:text-sm text-grey">
                          {product.origin}
                        </div>
                      </div>

                      <div className="hidden md:block w-px h-12 bg-brown flex-shrink-0"></div>

                      <div className="text-center md:text-left flex-shrink-0">
                        <div className="text-xs md:text-sm font-semibold text-brown mb-1">
                          Intensity :
                        </div>
                        <div className="text-xs md:text-sm text-grey">
                          {"☕".repeat(product.intensity || 3)} (
                          {product.intensity}/5)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PeachLayout>
  );
}
