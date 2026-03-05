import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import PeachLayout from "../../components/layouts/PeachLayout";
import Breadcrumb from "../../components/common/Breadcrumb";
import { Coffee } from "lucide-react"; // optional if you want another icon
import AuthGateModal from "../../components/AuthGateModal";
import { useAuth } from "../../contexts/AuthProvider";
import CartContext from "../../contexts/CartContext";

/* Custom Icons */
function BeanIcon(props) {
  return (
 <>
 <img src="assets/Whole Bean.png  " className="w-5 h-5"></img>
 </>
  );
}

function GroundBeansIcon(props) {
  // a bunch of little dots representing ground beans
  return (
    <svg
      {...props}
      fill="currentColor"
      viewBox="0 0 24 24"
      className="w-5 h-5"
    >
      <circle cx="6" cy="7" r="1.5" />
      <circle cx="10" cy="11" r="1.5" />
      <circle cx="14" cy="8" r="1.5" />
      <circle cx="18" cy="12" r="1.5" />
      <circle cx="8" cy="15" r="1.5" />
      <circle cx="12" cy="18" r="1.5" />
      <circle cx="16" cy="15" r="1.5" />
    </svg>
  );
}

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

const BIG_ROAST_IMAGES = {
  light: "/assets/lightroast.png",
  medium: "/assets/mediumroast.png",
  dark: "/assets/darkroast.png",
};

export default function SubscriptionPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const { addToCart } = useContext(CartContext);

  const [selectedRoast, setSelectedRoast] = useState(ROASTS[0]);
  const [purchaseType] = useState("subscribe");
  const [deliveryFrequency, setDeliveryFrequency] = useState("2-weeks");
  const [selectedGrind, setSelectedGrind] = useState("whole-bean");
  const [added, setAdded] = useState(false);
  const [isAuthGateOpen, setIsAuthGateOpen] = useState(false);

  const productPrice = 18.99;

  const handleAddToCart = () => {
    const isUserAuthenticated = isAuthenticated || Boolean(user);
    if (authLoading) return;
    if (!isUserAuthenticated) {
      setIsAuthGateOpen(true);
      return;
    }

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
    <>
      <PeachLayout>
        <div className="py-2 px-4 md:px-8 lg:px-12">
          <Breadcrumb />
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-10">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-10">
            {/* LEFT */}
            <div>
              <img
                src={BIG_ROAST_IMAGES[selectedRoast.id]}
                alt={selectedRoast.title}
                className="w-full h-auto rounded-lg object-cover"
              />
            </div>

            {/* CENTER */}
            <div className="space-y-8">
              <h1 className="text-3xl font-bold font-instrument-serif text-charcoal">
                {selectedRoast.title} Subscription
              </h1>

              <ul className="space-y-2 text-sm text-dark-brown">
                <li>✔ Freshly roasted by specialty roasters</li>
                <li>✔ Flexible delivery & easy cancellation</li>
                <li>✔ Save 10% on every delivery</li>
              </ul>

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

              {/* GRIND */}
              <div>
                <label className="block text-sm font-bold text-charcoal mb-2">
                  Select Your Grind
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedGrind("whole-bean")}
                    className={`w-full px-4 py-2.5 rounded-lg border flex items-center justify-center gap-2
                      ${
                        selectedGrind === "whole-bean"
                          ? "border-charcoal bg-white text-charcoal"
                          : "border-transparent text-dark-brown hover:border-charcoal"
                      }`}
                  >
                    <BeanIcon className="w-5 h-5" />
                    Whole Bean
                  </button>

                  <button
                    onClick={() => setSelectedGrind("ground")}
                    className={`w-full px-4 py-2.5 rounded-lg border flex items-center justify-center gap-2
                      ${
                        selectedGrind === "ground"
                          ? "border-charcoal bg-white text-charcoal"
                          : "border-transparent text-dark-brown hover:border-charcoal"
                      }`}
                  >
                    <GroundBeansIcon className="w-5 h-5" />
                    Ground Beans
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="bg-white rounded-lg border border-peach p-5 h-fit mt-10 xl:mt-0">
              <label className="flex items-center justify-between text-sm">
                <span>Subscribe</span>
                <span className="font-semibold">
                  {(productPrice * 0.9).toFixed(2)}$
                </span>
              </label>

              <div className="mt-3">
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

              <button
                onClick={handleAddToCart}
                disabled={added}
                className={`w-full mt-4 py-2.5 rounded-lg text-sm flex items-center justify-center gap-2
                  ${
                    added
                      ? "bg-green-600 text-white cursor-default"
                      : "bg-charcoal text-white hover:bg-brown"
                  }`}
              >
                {added ? "Added to Cart" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </PeachLayout>

      <AuthGateModal
        isOpen={isAuthGateOpen}
        onClose={() => setIsAuthGateOpen(false)}
        onLogin={() => navigate("/login")}
        onRegister={() => navigate("/register")}
      />
    </>
  );
}

function RoastCard({ title, subtitle, description, image, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left border rounded-xl p-4 flex gap-4 items-center
        ${
          active
            ? "border-charcoal bg-white shadow-sm"
            : "border-peach-light text-dark-brown hover:border-charcoal"
        }`}
    >
      <img
        src={image}
        alt={title}
        className="w-20 h-20 object-contain"
      />
      <div>
        <h4 className="font-semibold text-charcoal">{title}</h4>
        <p className="text-xs text-dark-brown">{subtitle}</p>
      </div>
    </button>
  );
}