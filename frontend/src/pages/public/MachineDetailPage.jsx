import { useState, useEffect, useContext } from "react";
import { Minus, Plus } from "lucide-react";
import { useParams } from "react-router-dom";
import PeachLayout from "../../components/layouts/PeachLayout";
import publicApi from "../../api/publicApi";
import { BreadcrumbContext } from "../../contexts/BreadcrumbContext";
import CartContext from "../../contexts/CartContext";
import Breadcrumb from "../../components/common/Breadcrumb";

export default function MachineDetailPage() {
  const { id } = useParams();
  const { setBreadcrumbData } = useContext(BreadcrumbContext);
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Fetch machine data from backend
  useEffect(() => {
    const fetchMachine = async () => {
      try {
        setLoading(true);
        const data = await publicApi.getMachineById(id);
        const machineData = data.data || data;
        setProduct(machineData);
        // Set breadcrumb data
        setBreadcrumbData({ [id]: machineData.name });
      } catch (err) {
        setError(err.message || "Failed to load machine");
        console.error("Error fetching machine:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMachine();
    }
  }, [id, setBreadcrumbData]);

  const handleQuantityChange = (delta) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = {
      _id: product._id,
      productType: "machine",
      name: product.name,
      price: product.price,
      qty: quantity,
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
                Loading machine...
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
            {/* Main Product Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[360px_1fr_300px] gap-5 md:gap-6 mb-8 md:mb-12">
              {/* Column 1: Product Image */}
              <div>
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={
                      product.images && product.images.length > 0
                        ? product.images[0]
                        : "/assets/columbianbrewcoffee.jpg"
                    }
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

                {/* Quantity */}
                <div>
                  <label className="block text-xs md:text-sm font-bold text-charcoal mb-1 md:mb-2 font-instrument-sans">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3 bg-peach-light rounded-lg p-2 w-fit">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="p-1 hover:bg-white rounded transition"
                    >
                      <Minus className="w-4 h-4 text-charcoal" />
                    </button>
                    <span className="px-4 py-1 text-charcoal font-semibold min-w-[40px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="p-1 hover:bg-white rounded transition"
                    >
                      <Plus className="w-4 h-4 text-charcoal" />
                    </button>
                  </div>
                </div>

                {/* Price and Add to Cart */}
                <div className="space-y-3 pt-4 border-t border-peach">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-charcoal">
                      Price:
                    </span>
                    <span className="text-lg font-bold text-charcoal">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>

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
                {/* Machine Specifications */}
                <div className="flex-1 flex flex-col items-center mb-8 md:mb-0">
                  <div className="w-16 md:w-20 h-16 md:h-20 bg-white rounded-full flex items-center justify-center mb-4 md:mb-6">
                    <svg
                      className="w-8 md:w-10 h-8 md:h-10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect
                        x="2"
                        y="3"
                        width="20"
                        height="14"
                        rx="2"
                        ry="2"
                      ></rect>
                      <line x1="8" y1="21" x2="16" y2="21"></line>
                      <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                  </div>

                  <h3 className="text-sm md:text-base font-bold text-zinc-900 mb-4 md:mb-8">
                    Machine Specifications :
                  </h3>

                  <div className="w-full max-w-md">
                    <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-4 md:gap-6 mb-4 md:mb-8">
                      <div className="text-center md:text-left flex-shrink-0">
                        <div className="text-xs md:text-sm font-semibold text-brown mb-1">
                          Machine Type :
                        </div>
                        <div className="text-xs md:text-sm text-grey capitalize">
                          {product.type}
                        </div>
                      </div>

                      <div className="hidden md:block w-px h-12 bg-brown flex-shrink-0"></div>

                      <div className="text-center md:text-left flex-shrink-0">
                        <div className="text-xs md:text-sm font-semibold text-brown mb-1">
                          Supported Coffee Type
                        </div>
                        <div className="text-xs md:text-sm text-grey leading-relaxed">
                          {product.coffeeTypeSupported &&
                            product.coffeeTypeSupported.join(", ")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Origin & Process */}
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-16 md:w-20 h-16 md:h-20 bg-white rounded-full flex items-center justify-center mb-4 md:mb-6">
                    <svg
                      className="w-8 md:w-10 h-8 md:h-10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 6v6l4 2"></path>
                    </svg>
                  </div>

                  <h3 className="text-sm md:text-base font-bold text-zinc-900 mb-4 md:mb-8">
                    Stock Information :
                  </h3>

                  <div className="w-full max-w-md">
                    <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-4 md:gap-6">
                      <div className="text-center md:text-left flex-shrink-0">
                        <div className="text-xs md:text-sm font-semibold text-brown mb-1">
                          Available Stock :
                        </div>
                        <div className="text-xs md:text-sm text-grey">
                          {product.stock} units
                        </div>
                      </div>

                      <div className="hidden md:block w-px h-12 bg-brown flex-shrink-0"></div>

                      <div className="text-center md:text-left flex-shrink-0">
                        <div className="text-xs md:text-sm font-semibold text-brown mb-1">
                          Status
                        </div>
                        <div className="text-xs md:text-sm text-grey font-semibold">
                          {product.stock > 0 ? (
                            <span className="text-green-600">In Stock</span>
                          ) : (
                            <span className="text-red-600">Out of Stock</span>
                          )}
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
