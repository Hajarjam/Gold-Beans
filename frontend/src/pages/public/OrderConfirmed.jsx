// src/pages/OrderConfirmed.jsx
import React, { useEffect, useMemo, useState } from "react";
import DarkNavbar from "../../components/common/DarkNavbar";
import Footer from "../../components/common/Footer";
import { Link, useLocation, useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URLL;

export default function OrderConfirmed() {
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("authToken");

  // 1) order venant du navigate state
  const stateOrder = location.state?.order;

  // 2) fallback: localStorage (si refresh)
  const storedOrder = useMemo(() => {
    try {
      const raw = localStorage.getItem("lastOrder");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const [order, setOrder] = useState(stateOrder || storedOrder);
  const [me, setMe] = useState(null);

  // Charger user connecté (pour afficher prénom/nom)
  useEffect(() => {
    if (!token) return;

    const loadMe = async () => {
      try {
        const r = await fetch(`${API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await r.json();
        if (r.ok) setMe(data);
      } catch (e) {
        console.error(e);
      }
    };

    loadMe();
  }, [token]);

  // Si pas d'order du tout, rediriger
  useEffect(() => {
    if (!order) navigate("/");
  }, [order, navigate]);

  if (!order) return null;

  // ✅ Shipping infos (plusieurs formes possibles)
  const shipping =
    order?.address ||
    order?.shipping ||
    order?.data?.address ||
    order?.data?.shipping ||
    {};

  // ✅ Items (plusieurs formes possibles)
  const rawItems =
    (Array.isArray(order?.items) && order.items) ||
    (Array.isArray(order?.orderItems) && order.orderItems) ||
    (Array.isArray(order?.data?.items) && order.data.items) ||
    (Array.isArray(order?.data?.orderItems) && order.data.orderItems) ||
    [];

  // ✅ Full name
  const fullName =
    order?.customerName ||
    order?.userName ||
    (me ? `${me.firstName || ""} ${me.lastName || ""}`.trim() : "") ||
    "Customer";

  // ✅ Address line
  const addressLine = [
    shipping.street || shipping.addressLine1 || shipping.line1,
    shipping.city,
    shipping.zip || shipping.postalCode,
    shipping.country,
  ]
    .filter(Boolean)
    .join(", ");

  // ✅ Phone
  const phoneValue =
    shipping.phone || shipping.phoneNumber || order.phone || order?.data?.phone || "—";

  // ✅ Total
  const totalValue =
    order.total ??
    order.totalPrice ??
    order.amount ??
    order?.data?.total ??
    order?.data?.totalPrice ??
    null;

  // ✅ Normalize items for UI
  const items = rawItems.map((item) => {
    // parfois backend renvoie productId comme objet complet
    const product = item.productId && typeof item.productId === "object" ? item.productId : null;

    return {
      name: item.name || product?.name || "Item",
      quantity: item.quantity ?? item.qty ?? item.count ?? 1,
      price: Number(item.price ?? product?.price ?? 0),
      image: item.image || product?.image || product?.photo || "/assets/machine.jpg",
    };
  });

  return (
  <>
    <DarkNavbar />

    <div className="bg-[#fdfaf7] min-h-[calc(100vh-64px)] flex  pt-16">
      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header compact */}
          <div className="pt-8 pb-6 px-6 lg:px-10 text-center">
            <img
              src="/assets/check.png"
              alt="Checkmark"
              className="w-14 h-14 mx-auto mb-4"
            />
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Order Confirmed!
            </h1>
            <p className="text-sm lg:text-base text-gray-600 max-w-xl mx-auto leading-relaxed">
              Your order has been placed successfully.
            </p>
          </div>

          <div className="px-6 lg:px-10 pb-6">
            {/* Shipment */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Shipment Information
              </h2>

              <div className="bg-[#F3F3F3] rounded-xl p-4 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                  <div>
                    <p className="text-gray-500">Name</p>
                    <p className="font-medium">{fullName}</p>
                  </div>

                  <div>
                    <p className="text-gray-500">Address</p>
                    <p className="font-medium line-clamp-2">
                      {addressLine || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="font-medium">{phoneValue}</p>
                  </div>

                  <div>
                    <p className="text-gray-500">Total</p>
                    <p className="font-medium">
                      {totalValue != null ? `${Number(totalValue).toFixed(2)} $` : "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Items compact + limite */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Order Items
              </h2>

              {(() => {
                const MAX = 3; // ✅ change à 2 si tu veux encore + compact
                const shown = items.slice(0, MAX);
                const rest = items.length - shown.length;

                return (
                  <div className="bg-[#F3F3F3] border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-200">
                    {shown.length === 0 ? (
                      <div className="p-4 text-sm text-gray-600">No items found.</div>
                    ) : (
                      <>
                        {shown.map((item, index) => (
                          <div key={index} className="flex items-center gap-3 p-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm text-gray-900 truncate">
                                {item.name}
                              </h3>
                              <p className="text-xs text-gray-600">
                                Qty: {item.quantity}
                              </p>
                            </div>

                            <div className="text-right font-medium text-sm text-gray-900">
                              {Number(item.price || 0).toFixed(2)} $
                            </div>
                          </div>
                        ))}

                        {rest > 0 && (
                          <div className="p-3 text-xs text-gray-600 text-center">
                            + {rest} more item{rest > 1 ? "s" : ""}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Bouton compact */}
        <div className="mt-6 text-center">
          <Link
            to="/coffees"
            className="bg-[#3d2b1f] text-white inline-block px-7 py-3 rounded-full font-medium text-sm hover:bg-[#2a1e16] transition"
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