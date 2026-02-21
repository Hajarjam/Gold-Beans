import { useState, useContext } from "react";
import PeachLayout from "../../components/layouts/PeachLayout";
import Breadcrumb from "../../components/common/Breadcrumb";
import { Coffee, Check } from "lucide-react";
import CartContext from "../../contexts/CartContext";

/* ---------- ROAST DATA (SMALL CARD IMAGES) ---------- */
const ROASTS = [
  {
    id: "light",
    title: "Light Roast",
    subtitle: "Ripe Fruit • Citrus • Berry Fruit",
    description:
      "A celebration of the coffee fruit—curated to highlight bright, sweet, and delicate flavors like jam, berry, and citrus.",
    image: "/assets/light.png",
  },
  {
    id: "medium",
    title: "Medium Roast",
    subtitle: "Milk Chocolate • Nut • Sweet Vanilla",
    description:
      "Medium roast may be the most common style in the USA, but our smooth, expertly sourced coffees are anything but ordinary.",
    image: "/assets/medium.png",
  },
  {
    id: "dark",
    title: "Dark Roast",
    subtitle: "Roastiness • Milk Chocolate • Sweet Vanilla",
    description:
      "Boasts bold roasty flavor with balanced smokiness—for a consistently comforting cup you won't want to stop sipping.",
    image: "/assets/dark.png",
  },
];

/* ---------- BIG LEFT IMAGES ---------- */
const BIG_ROAST_IMAGES = {
  light: "/assets/lightroast.png",
  medium: "/assets/mediumroast.png",
  dark: "/assets/darkroast.png",
};

export default function SubscriptionPage() {
  const { addToCart } = useContext(CartContext);

  const [selectedRoast, setSelectedRoast] = useState(ROASTS[0]);
  const [purchaseType] = useState("subscribe");
  const [deliveryFrequency, setDeliveryFrequency] = useState("2-weeks");
  const [selectedGrind, setSelectedGrind] = useState("whole-bean");
  const [added, setAdded] = useState(false); 

  const productPrice = 18.99;

  /* ---------- ADD TO CART ---------- */
  const handleAddToCart = () => {
    const subscriptionItem = {
      _id: `subscription-${selectedRoast.id}-${selectedGrind}`,
      productType: "subscription",
      name: `${selectedRoast.title} Subscription`,
      price: Number((productPrice * 0.9).toFixed(2)),
      grind: selectedGrind,
      roast: selectedRoast.id,
      qty: 1,
      purchaseType,
      deliveryFrequency,
      image: BIG_ROAST_IMAGES[selectedRoast.id],
    };

    addToCart(subscriptionItem);

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <PeachLayout>
      <div className="py-2 px-4 md:px-8 lg:px-12">
        <Breadcrumb />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LEFT — BIG IMAGE */}
          <div>
            <div className="rounded-lg overflow-hidden">
              <img
                src={BIG_ROAST_IMAGES[selectedRoast.id]}
                alt={selectedRoast.title}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* CENTER — DETAILS */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-instrument-serif text-charcoal mb-3">
                {selectedRoast.title} Subscription
              </h1>

              <span className="inline-block bg-peach-light text-charcoal text-xs px-3 py-1 rounded-full mb-4">
                Up to 2 bags free
              </span>

              <p className="text-sm text-dark-brown leading-relaxed">
                Enjoy a curated selection of our best selling coffees,
                freshly roasted and delivered straight to your door.
              </p>
            </div>

            {/* BENEFITS */}
            <ul className="space-y-2 text-sm text-dark-brown">
              <li>✔ Freshly roasted by specialty roasters</li>
              <li>✔ Flexible delivery & easy cancellation</li>
              <li>✔ Save 10% on every delivery</li>
            </ul>

            {/* ROAST OPTIONS */}
            <div className="space-y-4">
              {ROASTS.map((roast) => (
                <RoastCard
                  key={roast.id}
                  {...roast}
                  active={selectedRoast.id === roast.id}
                  onClick={() => setSelectedRoast(roast)}
                />
              ))}
            </div>

            {/* GRIND TYPE */}
            <div>
              <label className="block text-xs md:text-sm font-bold text-charcoal mb-2">
                Select Your Grind
              </label>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedGrind("whole-bean")}
                  className={`flex-1 px-4 py-2.5 rounded-lg border flex items-center justify-center gap-2
                    ${
                      selectedGrind === "whole-bean"
                        ? "border-charcoal bg-white text-charcoal"
                        : "border-transparent text-dark-brown hover:border-charcoal"
                    }`}
                >
                  <Coffee className="w-4 h-4" />
                  Whole Bean
                </button>

                <button
                  onClick={() => setSelectedGrind("ground")}
                  className={`flex-1 px-4 py-2.5 rounded-lg border flex items-center justify-center gap-2
                    ${
                      selectedGrind === "ground"
                        ? "border-charcoal bg-white text-charcoal"
                        : "border-transparent text-dark-brown hover:border-charcoal"
                    }`}
                >
                  Ground
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT — SUBSCRIPTION CARD */}
          <div className="bg-white rounded-lg border border-peach p-5 h-fit mt-10">
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <span className="text-sm">Subscribe</span>
                <span className="font-semibold">
                  {(productPrice * 0.9).toFixed(2)}$
                </span>
              </label>

              <div>
                <label className="text-xs text-dark-brown mb-1 block">
                  Deliver every
                </label>
                <select
                  value={deliveryFrequency}
                  onChange={(e) => setDeliveryFrequency(e.target.value)}
                  className="w-full px-3 py-2 border border-peach-light rounded-lg text-sm"
                >
                  <option value="1-week">Every week</option>
                  <option value="2-weeks">Every 2 weeks</option>
                  <option value="3-weeks">Every 3 weeks</option>
                  <option value="1-month">Monthly</option>
                </select>
              </div>

              {/* ADD TO CART INDICATOR */}
              <button
                onClick={handleAddToCart}
                disabled={added}
                className={`w-full flex items-center justify-center gap-2 text-sm py-2.5 rounded-lg transition
                  ${
                    added
                      ? "bg-green-600 text-white cursor-default"
                      : "bg-charcoal text-white hover:bg-brown"
                  }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    Added to Cart
                  </>
                ) : (
                  "Add to Cart"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </PeachLayout>
  );
}

/* ---------- ROAST CARD ---------- */
function RoastCard({ title, subtitle, description, image, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left border rounded-xl p-4 flex gap-4 transition-all
        ${
          active
            ? "border-charcoal bg-white shadow-sm"
            : "border-peach-light bg-transparent hover:border-charcoal"
        }`}
    >
      <img
        src={image}
        alt={title}
        className="w-20 h-20 object-contain flex-shrink-0"
      />

      <div className="space-y-1">
        <h4 className="font-semibold text-charcoal">{title}</h4>
        <p className="text-xs font-medium text-dark-brown">{subtitle}</p>
        <p className="text-xs text-dark-brown leading-relaxed">
          {description}
        </p>
      </div>
    </button>
  );
}